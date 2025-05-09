"use client";

import {
  createContext,
  useContext,
  useEffect,
  useState,
  ReactNode,
  useCallback,
} from "react";
import { User, Session } from "@supabase/supabase-js";
import { createClient } from "@/lib/supabase/client";
import {
  checkUserSubscription,
  getUserSubscription,
} from "@/shared/subscription";
import { SubscriptionDetails } from "@/types";

type AuthContextType = {
  user: User | null;
  session: Session | null;
  isLoading: boolean;
  isPremium: boolean;
  subscriptionDetails: SubscriptionDetails | null;
  signIn: (email: string, password: string) => Promise<void>;
  signUp: (email: string, password: string) => Promise<void>;
  signOut: () => Promise<void>;
  signInWithGoogle: () => Promise<void>;
  refreshPremiumStatus: () => Promise<void>;
};

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [session, setSession] = useState<Session | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isPremium, setIsPremium] = useState(false);
  const [subscriptionDetails, setSubscriptionDetails] =
    useState<SubscriptionDetails | null>(null);
  const supabase = createClient();

  // Define refreshPremiumStatus with useCallback to avoid dependency cycle
  const refreshPremiumStatus = useCallback(async () => {
    if (!user) return;

    try {
      // Check if user has an active subscription
      const hasPremium = await checkUserSubscription(user.id);
      setIsPremium(hasPremium);

      // Get detailed subscription info
      if (hasPremium) {
        const subscriptionData = await getUserSubscription(user.id);
        setSubscriptionDetails(subscriptionData);
      } else {
        setSubscriptionDetails(null);
      }
    } catch (error) {
      console.error("Error checking premium status:", error);
      setIsPremium(false);
      setSubscriptionDetails(null);
    }
  }, [user]);

  // Check premium status whenever user changes
  useEffect(() => {
    const checkPremiumStatus = async () => {
      if (user) {
        await refreshPremiumStatus();
      } else {
        setIsPremium(false);
        setSubscriptionDetails(null);
      }
    };

    checkPremiumStatus();
  }, [user, refreshPremiumStatus]);

  useEffect(() => {
    const setData = async () => {
      try {
        const {
          data: { session },
          error,
        } = await supabase.auth.getSession();
        if (error) throw error;
        setSession(session);
        setUser(session?.user ?? null);
      } catch (error) {
        console.error("Error loading user:", error);
      } finally {
        setIsLoading(false);
      }
    };

    setData();

    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange((_event, session) => {
      setSession(session);
      setUser(session?.user ?? null);
      setIsLoading(false);
    });

    return () => {
      subscription.unsubscribe();
    };
  }, [supabase.auth]);

  const signIn = async (email: string, password: string) => {
    try {
      setIsLoading(true);
      const { error } = await supabase.auth.signInWithPassword({
        email,
        password,
      });
      if (error) throw error;
    } catch (error) {
      console.error("Error signing in:", error);
      throw error;
    } finally {
      setIsLoading(false);
    }
  };

  const signUp = async (email: string, password: string) => {
    try {
      setIsLoading(true);
      const { error } = await supabase.auth.signUp({ email, password });
      if (error) throw error;
    } catch (error) {
      console.error("Error signing up:", error);
      throw error;
    } finally {
      setIsLoading(false);
    }
  };

  const signOut = async () => {
    try {
      setIsLoading(true);
      const { error } = await supabase.auth.signOut();
      if (error) throw error;
    } catch (error) {
      console.error("Error signing out:", error);
      throw error;
    } finally {
      setIsLoading(false);
    }
  };

  const signInWithGoogle = async () => {
    try {
      setIsLoading(true);
      const { error } = await supabase.auth.signInWithOAuth({
        provider: "google",
        options: {
          redirectTo: `${window.location.origin}/auth/callback`,
        },
      });
      if (error) throw error;
    } catch (error) {
      console.error("Error signing in with Google:", error);
      throw error;
    } finally {
      setIsLoading(false);
    }
  };

  const value = {
    user,
    session,
    isLoading,
    isPremium,
    subscriptionDetails,
    signIn,
    signUp,
    signOut,
    signInWithGoogle,
    refreshPremiumStatus,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
}
