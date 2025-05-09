import { NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";
import { createSubscription } from "@/shared/subscription";

export async function GET(request: Request) {
  try {
    // Get the URL params
    const url = new URL(request.url);
    const email = url.searchParams.get("email");
    const force = url.searchParams.get("force") === "true";
    const debug = url.searchParams.get("debug") === "true";

    if (!email) {
      return NextResponse.json(
        { error: "Email parameter is required" },
        { status: 400 }
      );
    }

    const supabase = createClient();

    // Get the current logged in user
    const { data: userData, error: userError } = await supabase.auth.getUser();

    if (userError || !userData?.user) {
      return NextResponse.json(
        { error: "User not found. Make sure you're logged in." },
        { status: 404 }
      );
    }

    // Only allow users to activate their own account (unless force is true for testing)
    if (userData.user.email !== email && !force) {
      return NextResponse.json(
        { error: "You can only activate your own account" },
        { status: 403 }
      );
    }

    // Create premium subscription for this user
    const userId = userData.user.id;

    // First check if subscription already exists
    const { data: existingSub, error: existingSubError } = await supabase
      .from("subscriptions")
      .select("id, status")
      .eq("user_id", userId)
      .eq("status", "active")
      .maybeSingle();

    if (existingSubError) {
      console.error("Error checking existing subscription:", existingSubError);

      // Try to directly insert a subscription as a fallback
      if (debug) {
        try {
          // Calculate dates
          const currentDate = new Date();
          const endDate = new Date(currentDate);
          endDate.setFullYear(endDate.getFullYear() + 1); // Add one year

          const { data: directInsert, error: insertError } = await supabase
            .from("subscriptions")
            .insert({
              user_id: userId,
              status: "active",
              plan_type: "premium",
              plan_period: "yearly",
              current_period_start: currentDate.toISOString(),
              current_period_end: endDate.toISOString(),
              gumroad_subscription_id: "manual-activation-" + Date.now(),
              cancel_at_period_end: false,
            })
            .select("id");

          if (insertError) {
            return NextResponse.json(
              {
                error: "Failed to insert subscription directly",
                details: insertError,
              },
              { status: 500 }
            );
          }

          return NextResponse.json({
            success: true,
            message: "Premium activated directly for user",
            userId: userId,
            userEmail: userData.user.email,
            subscription: directInsert,
          });
        } catch (directError) {
          return NextResponse.json(
            {
              error: "Both subscription check and direct insertion failed",
              checkError: existingSubError,
              insertError: directError,
            },
            { status: 500 }
          );
        }
      }

      return NextResponse.json(
        {
          error: "Failed to check existing subscription",
          details: existingSubError,
          note: "Add &debug=true to try direct insertion",
        },
        { status: 500 }
      );
    }

    if (existingSub) {
      return NextResponse.json({
        success: true,
        message: "Premium subscription already active",
        subscription: existingSub,
      });
    }

    try {
      const success = await createSubscription(
        userId,
        "premium",
        "yearly", // Default to yearly
        "manual-activation-" + Date.now()
      );

      if (success) {
        return NextResponse.json({
          success: true,
          message: "Premium activated for user",
          userId: userId,
          userEmail: userData.user.email,
        });
      } else {
        // Try direct insertion as a fallback if createSubscription failed
        if (debug) {
          const currentDate = new Date();
          const endDate = new Date(currentDate);
          endDate.setFullYear(endDate.getFullYear() + 1); // Add one year

          const { data: directInsert, error: insertError } = await supabase
            .from("subscriptions")
            .insert({
              user_id: userId,
              status: "active",
              plan_type: "premium",
              plan_period: "yearly",
              current_period_start: currentDate.toISOString(),
              current_period_end: endDate.toISOString(),
              gumroad_subscription_id: "manual-activation-" + Date.now(),
              cancel_at_period_end: false,
            })
            .select("id");

          if (insertError) {
            return NextResponse.json(
              {
                error:
                  "Failed to insert subscription directly after createSubscription failed",
                details: insertError,
              },
              { status: 500 }
            );
          }

          return NextResponse.json({
            success: true,
            message:
              "Premium activated directly for user (after helper function failed)",
            userId: userId,
            userEmail: userData.user.email,
            subscription: directInsert,
          });
        }

        return NextResponse.json(
          {
            error: "Failed to create subscription",
            note: "Add &debug=true to try direct insertion",
          },
          { status: 500 }
        );
      }
    } catch (subscriptionError) {
      console.error("Error in createSubscription:", subscriptionError);
      return NextResponse.json(
        {
          error: "Error during subscription creation",
          details:
            subscriptionError instanceof Error
              ? subscriptionError.message
              : String(subscriptionError),
          note: "Add &debug=true to try direct insertion",
        },
        { status: 500 }
      );
    }
  } catch (error) {
    console.error("Error activating premium:", error);
    return NextResponse.json(
      {
        error: "Internal server error",
        details: error instanceof Error ? error.message : String(error),
      },
      { status: 500 }
    );
  }
}
