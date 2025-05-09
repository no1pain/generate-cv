export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[];

export interface Database {
  public: {
    Tables: {
      profiles: {
        Row: {
          id: string;
          updated_at: string | null;
          username: string | null;
          full_name: string | null;
          email: string | null;
        };
        Insert: {
          id: string;
          updated_at?: string | null;
          username?: string | null;
          full_name?: string | null;
          email?: string | null;
        };
        Update: {
          id?: string;
          updated_at?: string | null;
          username?: string | null;
          full_name?: string | null;
          email?: string | null;
        };
        Relationships: [
          {
            foreignKeyName: "profiles_id_fkey";
            columns: ["id"];
            referencedRelation: "users";
            referencedColumns: ["id"];
          }
        ];
      };
      resumes: {
        Row: {
          id: string;
          created_at: string;
          updated_at: string | null;
          title: string | null;
          content: string | null;
          user_id: string;
          template: string | null;
          is_public: boolean | null;
        };
        Insert: {
          id?: string;
          created_at?: string;
          updated_at?: string | null;
          title?: string | null;
          content?: string | null;
          user_id: string;
          template?: string | null;
          is_public?: boolean | null;
        };
        Update: {
          id?: string;
          created_at?: string;
          updated_at?: string | null;
          title?: string | null;
          content?: string | null;
          user_id?: string;
          template?: string | null;
          is_public?: boolean | null;
        };
        Relationships: [
          {
            foreignKeyName: "resumes_user_id_fkey";
            columns: ["user_id"];
            referencedRelation: "users";
            referencedColumns: ["id"];
          }
        ];
      };
    };
    Views: {
      [_ in never]: never;
    };
    Functions: {
      [_ in never]: never;
    };
    Enums: {
      [_ in never]: never;
    };
    CompositeTypes: {
      [_ in never]: never;
    };
  };
}
