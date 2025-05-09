import { NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";
import { createSubscription } from "@/shared/subscription";

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

    // Get the user by email from auth.users
    const { data: userData, error: userError } = await supabase.auth.getUser();

    if (userError || !userData?.user) {
      return NextResponse.json(
        { error: "User not found. Make sure you're logged in." },
        { status: 404 }
      );
    }

    // Only allow users to activate their own account or require admin permission
    if (userData.user.email !== email) {
      return NextResponse.json(
        { error: "You can only activate your own account" },
        { status: 403 }
      );
    }

    // Create premium subscription for this user
    const userId = userData.user.id;

    // First check if subscription already exists
    const { data: existingSub } = await supabase
      .from("subscriptions")
      .select("id, status")
      .eq("user_id", userId)
      .eq("status", "active")
      .maybeSingle();

    if (existingSub) {
      return NextResponse.json({
        success: true,
        message: "Premium subscription already active",
        subscription: existingSub,
      });
    }

    const success = await createSubscription(
      userId,
      "premium",
      "monthly",
      "test-subscription-id"
    );

    if (success) {
      return NextResponse.json({
        success: true,
        message: "Premium activated for user",
      });
    } else {
      return NextResponse.json(
        { error: "Failed to create subscription" },
        { status: 500 }
      );
    }
  } catch (error) {
    console.error("Error activating premium:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}
