import { NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";
import {
  createSubscription,
  updateSubscriptionStatus,
} from "@/shared/subscription";
import {
  SubscriptionPlanPeriod,
  SubscriptionPlanType,
  SubscriptionStatus,
} from "@/types";
import { User } from "@supabase/supabase-js";
import crypto from "crypto";

export async function POST(request: Request) {
  try {
    // Get the request data
    const payload = await request.formData();

    // Get only the fields we actually use
    const productPermalink = payload.get("product_permalink")?.toString();
    const subscriptionID = payload.get("subscription_id")?.toString();
    const purchaserEmail = payload.get("email")?.toString();
    const resource = payload.get("resource_name")?.toString();
    const action = payload.get("resource_action")?.toString();
    const signature = request.headers.get("X-Gumroad-Signature");

    // Log the webhook event (for debugging)
    console.log("Gumroad webhook received:", {
      resource,
      action,
      subscriptionID,
      purchaserEmail,
      productPermalink,
      signature,
    });

    // Verify the webhook signature if environment variable is set
    const appSecret = process.env.GUMROAD_APP_SECRET;
    if (appSecret && signature) {
      // Convert form data to string for verification
      const rawBody = Array.from(payload.entries())
        .map(([key, value]) => `${key}=${encodeURIComponent(value.toString())}`)
        .join("&");

      // Create HMAC using SHA-256
      const hmac = crypto.createHmac("sha256", appSecret);
      hmac.update(rawBody);
      const calculatedSignature = hmac.digest("hex");

      // Compare signatures
      if (calculatedSignature !== signature) {
        console.error("Invalid webhook signature");
        return NextResponse.json(
          { error: "Invalid signature" },
          { status: 401 }
        );
      }
    }

    // Skip processing if we're missing critical information
    if (!subscriptionID || !purchaserEmail) {
      return NextResponse.json(
        { error: "Missing required data" },
        { status: 400 }
      );
    }

    // Get the Supabase client
    const supabase = createClient();

    // Find the user by email in auth system
    const { data: userResponse, error: userError } =
      await supabase.auth.admin.listUsers();

    if (userError) {
      console.error("Error listing users:", userError);
      return NextResponse.json(
        { error: "Failed to find user" },
        { status: 500 }
      );
    }

    // Find the matching user by email
    const user = userResponse.users.find(
      (u: User) => u.email?.toLowerCase() === purchaserEmail.toLowerCase()
    );

    if (!user) {
      console.error("User not found for email:", purchaserEmail);
      return NextResponse.json({ error: "User not found" }, { status: 404 });
    }

    const userId = user.id;

    // Handle the different webhook events

    // New subscription
    if (resource === "subscription" && action === "created") {
      // Determine the plan type based on the product permalink
      const planType: SubscriptionPlanType = "premium";
      let planPeriod: SubscriptionPlanPeriod = "monthly";

      // Use the environment variable product IDs to identify the plan
      const monthlyProductId =
        process.env.MONTHLY_SUBSCRIPTION_PRODUCT_ID || "wseban";
      const yearlyProductId =
        process.env.YEARLY_SUBSCRIPTION_PRODUCT_ID || "ixoazp";

      if (productPermalink?.includes(yearlyProductId)) {
        planPeriod = "yearly"; // Yearly plan
      } else if (productPermalink?.includes(monthlyProductId)) {
        planPeriod = "monthly"; // Monthly plan
      }

      // Check if subscription already exists
      const { data: existingSub } = await supabase
        .from("subscriptions")
        .select("id")
        .eq("user_id", userId)
        .eq("status", "active")
        .maybeSingle();

      if (existingSub) {
        // Already has an active subscription
        console.log("User already has an active subscription:", userId);
        return NextResponse.json({
          success: true,
          message: "Subscription already exists",
        });
      }

      // Create the subscription in our database
      const success = await createSubscription(
        userId,
        planType,
        planPeriod,
        subscriptionID
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
      const status: SubscriptionStatus =
        action === "cancelled"
          ? "canceled"
          : action === "ended"
          ? "ended"
          : "failed";

      // Update the subscription status
      const success = await updateSubscriptionStatus(
        subscriptionID,
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
