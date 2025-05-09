import { createClient } from "@/lib/supabase/client";
import {
  SubscriptionDetails,
  SubscriptionPlanPeriod,
  SubscriptionPlanType,
  SubscriptionStatus,
} from "@/types";

/**
 * Check if the user has an active premium subscription
 */
export async function checkUserSubscription(userId: string): Promise<boolean> {
  if (!userId) return false;

  const supabase = createClient();

  try {
    const { data, error } = await supabase
      .from("subscriptions")
      .select("*")
      .eq("user_id", userId)
      .eq("status", "active")
      .single();

    if (error) {
      console.error("Error checking subscription:", error);
      return false;
    }

    return !!data;
  } catch (error) {
    console.error("Error checking subscription:", error);
    return false;
  }
}

/**
 * Create a new subscription for the user
 */
export async function createSubscription(
  userId: string,
  planType: SubscriptionPlanType,
  planPeriod: SubscriptionPlanPeriod,
  gumroadSubscriptionId: string
): Promise<boolean> {
  if (!userId) return false;

  const supabase = createClient();

  try {
    // Calculate subscription period dates
    const currentDate = new Date();
    const currentPeriodStart = currentDate.toISOString();

    let currentPeriodEnd = new Date(currentDate);
    if (planPeriod === "monthly") {
      currentPeriodEnd.setMonth(currentPeriodEnd.getMonth() + 1);
    } else if (planPeriod === "yearly") {
      currentPeriodEnd.setFullYear(currentPeriodEnd.getFullYear() + 1);
    }

    const { error } = await supabase.from("subscriptions").insert({
      user_id: userId,
      status: "active" as SubscriptionStatus,
      plan_type: planType,
      plan_period: planPeriod,
      current_period_start: currentPeriodStart,
      current_period_end: currentPeriodEnd.toISOString(),
      gumroad_subscription_id: gumroadSubscriptionId,
      cancel_at_period_end: false,
    });

    if (error) {
      console.error("Error creating subscription:", error);
      return false;
    }

    return true;
  } catch (error) {
    console.error("Error creating subscription:", error);
    return false;
  }
}

/**
 * Update a subscription status (e.g., for cancellation)
 */
export async function updateSubscriptionStatus(
  gumroadSubscriptionId: string,
  status: SubscriptionStatus,
  cancelAtPeriodEnd: boolean = false
): Promise<boolean> {
  if (!gumroadSubscriptionId) return false;

  const supabase = createClient();

  try {
    const { error } = await supabase
      .from("subscriptions")
      .update({
        status: status,
        updated_at: new Date().toISOString(),
        cancel_at_period_end: cancelAtPeriodEnd,
      })
      .eq("gumroad_subscription_id", gumroadSubscriptionId);

    if (error) {
      console.error("Error updating subscription status:", error);
      return false;
    }

    return true;
  } catch (error) {
    console.error("Error updating subscription status:", error);
    return false;
  }
}

/**
 * Gets the user's subscription details
 */
export async function getUserSubscription(
  userId: string
): Promise<SubscriptionDetails | null> {
  if (!userId) return null;

  const supabase = createClient();

  try {
    const { data, error } = await supabase
      .from("subscriptions")
      .select("*")
      .eq("user_id", userId)
      .order("created_at", { ascending: false })
      .limit(1)
      .single();

    if (error) {
      console.error("Error getting subscription:", error);
      return null;
    }

    return data as SubscriptionDetails;
  } catch (error) {
    console.error("Error getting subscription:", error);
    return null;
  }
}
