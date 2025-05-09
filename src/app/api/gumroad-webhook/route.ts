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

// Create a user account if it doesn't exist
async function ensureUserExists(
  supabase: any,
  email: string
): Promise<{ userId: string | null; error: any }> {
  try {
    // First, check if user already exists
    const { data: existingUsers, error: lookupError } =
      await supabase.auth.admin.listUsers();

    if (lookupError) {
      console.error("Error checking existing users:", lookupError);
      return { userId: null, error: lookupError };
    }

    // Find the user by email in auth system
    let user = null;

    if (email) {
      // Clean up emails for comparison
      const emailLower = email.toLowerCase().trim();

      // First try exact match
      user = existingUsers.users.find(
        (u: User) => u.email?.toLowerCase().trim() === emailLower
      );

      // If no exact match and the email is a Gumroad noreply address, try to find similar email
      if (!user && emailLower.includes("@customers.gumroad.com")) {
        // Extract username part from noreply@customers.gumroad.com format
        const username = emailLower.split("@")[0];
        console.log("Looking for similar emails matching:", username);

        // Look for any users with similar email parts
        const possibleUsers = existingUsers.users.filter((u) => {
          if (!u.email) return false;
          return (
            u.email.toLowerCase().includes(username) ||
            username.includes(u.email.toLowerCase().split("@")[0])
          );
        });

        if (possibleUsers.length === 1) {
          // If we only found one similar email, use that
          user = possibleUsers[0];
          console.log("Found user by partial email match:", user.email);
        } else if (possibleUsers.length > 1) {
          // If we found multiple, log them but don't automatically select
          console.log(
            "Multiple possible matching users:",
            possibleUsers.map((u) => u.email)
          );
        }
      }

      // If user is null at this point, we couldn't find a match
      if (!user) {
        // Let's log all the users for debugging
        console.log("User not found for email:", email);
        console.log(
          "Available users:",
          existingUsers.users.map((u) => u.email)
        );

        // If no user exists, create one
        console.log("Creating new user account for:", email);

        // Generate a temporary random password
        const tempPassword = crypto.randomBytes(16).toString("hex");

        const { data: newUser, error } = await supabase.auth.admin.createUser({
          email: email,
          password: tempPassword,
          email_confirm: true, // Auto-confirm the email
        });

        if (error) {
          console.error("Failed to create user:", error);
          return { userId: null, error };
        }

        return { userId: newUser.user.id, error: null };
      }
    }

    if (!user) {
      console.error("User not found for email:", email);
      return { userId: null, error: "User not found" };
    }

    const userId = user.id;

    return { userId, error: null };
  } catch (error) {
    console.error("Error ensuring user exists:", error);
    return { userId: null, error };
  }
}

export async function POST(request: Request) {
  try {
    // Get the request data
    const payload = await request.formData();

    // Get only the fields we actually use
    const productPermalink = payload.get("product_permalink")?.toString();
    const subscriptionID = payload.get("subscription_id")?.toString();
    const saleID = payload.get("sale_id")?.toString();
    let purchaserEmail = payload.get("email")?.toString();
    const resource = payload.get("resource_name")?.toString();
    const action = payload.get("resource_action")?.toString();
    const signature = request.headers.get("X-Gumroad-Signature");

    // Get the purchaser name for creating an account
    const purchaserName =
      payload.get("full_name")?.toString() ||
      payload.get("purchaser_name")?.toString() ||
      "Gumroad User";

    // Format Gumroad email properly (remove the noreply@ prefix if it exists)
    if (purchaserEmail && purchaserEmail.includes("@customers.gumroad.com")) {
      // Extract the actual email if available in another field
      const actualEmail = payload.get("purchaser_email")?.toString();
      if (actualEmail && actualEmail.includes("@")) {
        purchaserEmail = actualEmail;
      }
    }

    // Log the webhook event (for debugging)
    console.log("Gumroad webhook received:", {
      resource,
      action,
      subscriptionID,
      saleID,
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
    if (!purchaserEmail || (!subscriptionID && !saleID)) {
      return NextResponse.json(
        { error: "Missing required data (email or sale/subscription ID)" },
        { status: 400 }
      );
    }

    // Get the Supabase client
    const supabase = createClient();

    // Ensure user exists in our system
    const { userId, error: userError } = await ensureUserExists(
      supabase,
      purchaserEmail
    );

    if (userError || !userId) {
      console.error("Error ensuring user exists:", userError);
      return NextResponse.json(
        { error: "Failed to find or create user" },
        { status: 500 }
      );
    }

    // Handle the different webhook events

    // Handle both subscriptions and one-time purchases
    if (
      (resource === "subscription" && action === "created") ||
      (resource === "sale" && action === "created")
    ) {
      // Determine the plan type based on the product permalink
      const planType: SubscriptionPlanType = "premium";
      let planPeriod: SubscriptionPlanPeriod = "yearly"; // Default to yearly for one-time purchases

      if (resource === "subscription") {
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

      // Calculate subscription period dates
      const currentDate = new Date();
      const currentPeriodStart = currentDate.toISOString();

      const currentPeriodEnd = new Date(currentDate);
      if (planPeriod === "monthly") {
        currentPeriodEnd.setMonth(currentPeriodEnd.getMonth() + 1);
      } else if (planPeriod === "yearly") {
        currentPeriodEnd.setFullYear(currentPeriodEnd.getFullYear() + 1);
      }

      // Directly insert the subscription
      const { data: newSubscription, error: insertError } = await supabase
        .from("subscriptions")
        .insert({
          user_id: userId,
          status: "active" as SubscriptionStatus,
          plan_type: planType,
          plan_period: planPeriod,
          current_period_start: currentPeriodStart,
          current_period_end: currentPeriodEnd.toISOString(),
          gumroad_subscription_id:
            subscriptionID || saleID || "one-time-purchase",
          cancel_at_period_end: false,
        })
        .select("*")
        .single();

      if (insertError) {
        console.error("Failed to create subscription record:", insertError);
        return NextResponse.json(
          { error: "Failed to create subscription", details: insertError },
          { status: 500 }
        );
      }

      return NextResponse.json({
        success: true,
        message: "Successfully created premium access",
        userId,
        subscription: newSubscription,
      });
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
        subscriptionID || "",
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
