import { NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";

export async function GET(request: Request) {
  try {
    // Get the URL params
    const url = new URL(request.url);
    const email = url.searchParams.get("email");

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
        {
          error: "User not found. Make sure you're logged in.",
          details: userError,
        },
        { status: 404 }
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
      return NextResponse.json(
        {
          error: "Failed to check existing subscription",
          details: existingSubError,
        },
        { status: 500 }
      );
    }

    if (existingSub) {
      return NextResponse.json({
        success: true,
        message: "Premium subscription already active",
        subscription: existingSub,
        userId,
        userEmail: userData.user.email,
      });
    }

    // Calculate dates
    const currentDate = new Date();
    const endDate = new Date(currentDate);
    endDate.setFullYear(endDate.getFullYear() + 1); // Add one year

    // Prepare subscription data
    const subscriptionData = {
      user_id: userId,
      status: "active",
      plan_type: "premium",
      plan_period: "yearly",
      current_period_start: currentDate.toISOString(),
      current_period_end: endDate.toISOString(),
      gumroad_subscription_id: "direct-activation-" + Date.now(),
      cancel_at_period_end: false,
    };

    // Log the data we're about to insert
    console.log("Attempting to insert subscription:", subscriptionData);

    // Insert the subscription
    const { data: newSubscription, error: insertError } = await supabase
      .from("subscriptions")
      .insert(subscriptionData)
      .select("*")
      .single();

    if (insertError) {
      return NextResponse.json(
        {
          error: "Failed to create subscription directly",
          details: insertError,
          attempted: subscriptionData,
        },
        { status: 500 }
      );
    }

    return NextResponse.json({
      success: true,
      message: "Premium activated successfully",
      userId,
      userEmail: userData.user.email,
      subscription: newSubscription,
    });
  } catch (error) {
    console.error("Error in direct activation:", error);
    return NextResponse.json(
      {
        error: "Internal server error",
        details: error instanceof Error ? error.message : String(error),
      },
      { status: 500 }
    );
  }
}
