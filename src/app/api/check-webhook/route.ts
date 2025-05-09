import { NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";
import { User } from "@supabase/supabase-js";

// This keeps track of received webhooks for debugging
interface WebhookEntry {
  timestamp: string;
  headers: Record<string, string>;
  body: string;
}

const webhookLog: WebhookEntry[] = [];

export async function GET(request: Request) {
  // Parse the URL to get any parameters
  const url = new URL(request.url);
  const test = url.searchParams.get("test");
  const email = url.searchParams.get("email");

  // Return environment variables check (safe to expose in this limited way)
  const envCheck = {
    supabaseUrl: process.env.NEXT_PUBLIC_SUPABASE_URL ? "✅ Set" : "❌ Missing",
    supabaseAnonKey: process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY
      ? "✅ Set"
      : "❌ Missing",
    openaiKey: process.env.OPENAI_API_KEY ? "✅ Set" : "❌ Missing",
    monthlyProductId: process.env.MONTHLY_SUBSCRIPTION_PRODUCT_ID
      ? "✅ Set"
      : "❌ Missing",
    yearlyProductId: process.env.YEARLY_SUBSCRIPTION_PRODUCT_ID
      ? "✅ Set"
      : "❌ Missing",
    gumroadAppSecret: process.env.GUMROAD_APP_SECRET ? "✅ Set" : "❌ Missing",
    gumroadAppId: process.env.GUMROAD_APP_ID ? "✅ Set" : "❌ Missing",
  };

  // If test param is provided, perform a subscription check for debugging
  if (test === "true" && email) {
    try {
      const supabase = createClient();

      // Try to get all users from auth table
      const { data: listData, error: listError } =
        await supabase.auth.admin.listUsers();

      if (listError) {
        return NextResponse.json({
          message: "Webhook check endpoint",
          envVariables: envCheck,
          webhookUrl: `${process.env.GUMROAD_WEBHOOK_URL || "Not set"}`,
          currentTime: new Date().toISOString(),
          testResult: {
            success: false,
            error: "Error fetching users: " + listError.message,
          },
        });
      }

      // Search for the user in the list (case insensitive)
      const emailLowercase = email.toLowerCase().trim();
      const foundUsers = listData?.users.filter(
        (u: User) => u.email?.toLowerCase().trim() === emailLowercase
      );

      // Check for matching users with similar emails to help with troubleshooting
      const similarUsers = listData?.users.filter((u: User) =>
        u.email?.toLowerCase().includes(emailLowercase.split("@")[0])
      );

      // Determine if we found a user
      const user = foundUsers && foundUsers.length > 0 ? foundUsers[0] : null;

      if (!user) {
        return NextResponse.json({
          message: "Webhook check endpoint",
          envVariables: envCheck,
          webhookUrl: `${process.env.GUMROAD_WEBHOOK_URL || "Not set"}`,
          currentTime: new Date().toISOString(),
          testResult: {
            success: false,
            message: "User not found with email: " + email,
            listLookupError: listError,
            totalUsersFound: listData?.users.length || 0,
            similarEmailsFound: similarUsers?.map((u) => u.email) || [],
            allUsers: listData?.users.map((u) => u.email) || [],
            troubleshooting:
              "Make sure the email matches exactly what's in your Supabase auth table",
          },
        });
      }

      // If we found a user, check for subscription
      const { data: subscription } = await supabase
        .from("subscriptions")
        .select("*")
        .eq("user_id", user.id)
        .eq("status", "active")
        .maybeSingle();

      return NextResponse.json({
        message: "Webhook check endpoint",
        envVariables: envCheck,
        webhookUrl: `${process.env.GUMROAD_WEBHOOK_URL || "Not set"}`,
        currentTime: new Date().toISOString(),
        testResult: {
          success: true,
          userFound: true,
          userId: user.id,
          userEmail: user.email,
          hasSubscription: !!subscription,
          subscriptionDetails: subscription || "No active subscription",
        },
      });
    } catch (error) {
      console.error("Error in webhook check:", error);
      return NextResponse.json({
        message: "Webhook check endpoint",
        envVariables: envCheck,
        webhookUrl: `${process.env.GUMROAD_WEBHOOK_URL || "Not set"}`,
        currentTime: new Date().toISOString(),
        testResult: {
          success: false,
          error: "Error checking subscription: " + error,
          detail: error instanceof Error ? error.stack : "Unknown error type",
        },
      });
    }
  }

  return NextResponse.json({
    message: "Webhook check endpoint",
    envVariables: envCheck,
    webhookUrl: `${
      process.env.GUMROAD_WEBHOOK_URL ||
      "Not set - should be your domain + /api/gumroad-webhook"
    }`,
    currentTime: new Date().toISOString(),
    recentWebhooks: webhookLog,
    testing:
      "To test a specific email, add ?test=true&email=user@example.com to this URL",
  });
}

export async function POST(request: Request) {
  try {
    // Log the full request for debugging
    const body = await request.text();
    const headers: Record<string, string> = {};
    request.headers.forEach((value, key) => {
      headers[key] = value;
    });

    // Store webhook in memory (will be cleared on server restart)
    webhookLog.unshift({
      timestamp: new Date().toISOString(),
      headers,
      body,
    });

    // Keep only the last 10 webhooks
    if (webhookLog.length > 10) {
      webhookLog.pop();
    }

    return NextResponse.json({
      success: true,
      message: "Webhook received and logged",
      recentWebhooks: webhookLog,
    });
  } catch (error) {
    console.error("Error processing test webhook:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}
