import { NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";

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

  // If test param is provided, check current user's subscription
  if (test === "true") {
    try {
      const supabase = createClient();

      // Get current user
      const { data: authData, error: authError } =
        await supabase.auth.getUser();

      if (authError) {
        return NextResponse.json({
          message: "Webhook check endpoint",
          envVariables: envCheck,
          webhookUrl: `${process.env.GUMROAD_WEBHOOK_URL || "Not set"}`,
          currentTime: new Date().toISOString(),
          testResult: {
            success: false,
            error: "Error checking user: " + authError.message,
            note: "You need to be logged in to check subscription status",
          },
        });
      }

      if (!authData.user) {
        return NextResponse.json({
          message: "Webhook check endpoint",
          envVariables: envCheck,
          webhookUrl: `${process.env.GUMROAD_WEBHOOK_URL || "Not set"}`,
          currentTime: new Date().toISOString(),
          testResult: {
            success: false,
            message: "You are not logged in",
            activationLink: `/api/activate-premium?email=${encodeURIComponent(
              email || ""
            )}&force=true`,
          },
        });
      }

      // If we got here, we found the user
      const user = authData.user;

      // If email was specified, check if it matches the logged in user
      if (email && email.toLowerCase() !== user.email?.toLowerCase()) {
        return NextResponse.json({
          message: "Webhook check endpoint",
          envVariables: envCheck,
          webhookUrl: `${process.env.GUMROAD_WEBHOOK_URL || "Not set"}`,
          currentTime: new Date().toISOString(),
          testResult: {
            success: false,
            message: `Email mismatch: Requested ${email} but you are logged in as ${user.email}`,
            activationLink: `/api/activate-premium?email=${encodeURIComponent(
              email
            )}&force=true`,
          },
        });
      }

      // Check if user has an active subscription
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
          activationLink: !subscription
            ? `/api/activate-premium?email=${encodeURIComponent(
                user.email || ""
              )}`
            : null,
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
      "To test your current user's subscription, add ?test=true to this URL",
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
