import { NextResponse } from "next/server";

export async function GET() {
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

  return NextResponse.json({
    message: "Webhook check endpoint",
    envVariables: envCheck,
    webhookUrl: `${
      process.env.GUMROAD_WEBHOOK_URL ||
      "Not set - should be your domain + /api/gumroad-webhook"
    }`,
    currentTime: new Date().toISOString(),
  });
}

// This keeps track of received webhooks for debugging
const webhookLog: any[] = [];

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
