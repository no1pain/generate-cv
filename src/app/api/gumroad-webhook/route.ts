import { NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";
import {
  createSubscription,
  updateSubscriptionStatus,
} from "@/shared/subscription";

// Webhook secret for verification
const WEBHOOK_SECRET = process.env.GUMROAD_WEBHOOK_SECRET || "";

export async function POST(request: Request) {
  // Get the request data
  const payload = await request.formData();

  const sellerID = payload.get("seller_id")?.toString();
  const productID = payload.get("product_id")?.toString();
  const productPermalink = payload.get("product_permalink")?.toString();
  const subscriptionID = payload.get("subscription_id")?.toString();
  const purchaserID = payload.get("purchaser_id")?.toString();
  const purchaserEmail = payload.get("email")?.toString();
  const saleID = payload.get("sale_id")?.toString();
  const saleTimestamp = payload.get("sale_timestamp")?.toString();
  const resource = payload.get("resource_name")?.toString();
  const action = payload.get("resource_action")?.toString();

  // Log the webhook event (for debugging)
  console.log("Gumroad webhook received:", {
    resource,
    action,
    subscriptionID,
    purchaserEmail,
  });

  try {
    // Skip processing if we're missing critical information
    if (!subscriptionID || !purchaserEmail) {
      return NextResponse.json(
        { error: "Missing required data" },
        { status: 400 }
      );
    }

    // Get the Supabase client
    const supabase = createClient();

    // Find the user by email
    const { data: userData, error: userError } = await supabase
      .from("profiles")
      .select("id")
      .eq("email", purchaserEmail)
      .single();

    if (userError || !userData) {
      console.error("User not found for subscription update", userError);
      return NextResponse.json({ error: "User not found" }, { status: 404 });
    }

    const userId = userData.id;

    // Handle the different webhook events

    // New subscription
    if (resource === "subscription" && action === "created") {
      // Determine the plan type based on the product permalink
      let planType = "premium";
      let planPeriod = "monthly";

      if (productPermalink?.includes("ixoazp")) {
        planPeriod = "yearly"; // Yearly plan
      } else if (productPermalink?.includes("wseban")) {
        planPeriod = "monthly"; // Monthly plan
      }

      // Create the subscription in our database
      const success = await createSubscription(
        userId,
        planType,
        planPeriod,
        subscriptionID as string
      );

      if (!success) {
        console.error("Failed to create subscription record");
        return NextResponse.json(
          { error: "Failed to create subscription" },
          { status: 500 }
        );
      }

      return NextResponse.json({ success: true });
    }

    // Subscription cancelled or failed
    if (
      resource === "subscription" &&
      (action === "cancelled" || action === "ended" || action === "failed")
    ) {
      const status =
        action === "cancelled"
          ? "canceled"
          : action === "ended"
          ? "ended"
          : "failed";

      // Update the subscription status
      const success = await updateSubscriptionStatus(
        subscriptionID as string,
        status,
        action === "cancelled" // Set cancel_at_period_end for cancellations
      );

      if (!success) {
        console.error("Failed to update subscription status");
        return NextResponse.json(
          { error: "Failed to update subscription" },
          { status: 500 }
        );
      }

      return NextResponse.json({ success: true });
    }

    // Subscription renewed
    if (resource === "subscription" && action === "renewed") {
      // Handle renewal (could update the current_period_end date)
      // For simplicity, we'll just return success
      return NextResponse.json({ success: true });
    }

    // Handle other webhook events as needed

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("Error processing Gumroad webhook:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}
