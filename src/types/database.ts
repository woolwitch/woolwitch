export interface Database {
  woolwitch: {
    Tables: {
      products: {
        Row: {
          id: string;
          name: string;
          description: string;
          price: number;
          image_url: string;
          category: string;
          stock_quantity: number;
          is_available: boolean;
          created_at: string;
        };
        Insert: Omit<
          Database["woolwitch"]["Tables"]["products"]["Row"],
          "id" | "created_at"
        >;
        Update: Partial<Database["woolwitch"]["Tables"]["products"]["Insert"]>;
      };
      user_roles: {
        Row: {
          id: string;
          user_id: string;
          role: "admin" | "user";
          created_at: string;
        };
        Insert: Omit<
          Database["woolwitch"]["Tables"]["user_roles"]["Row"],
          "id" | "created_at"
        >;
        Update: Partial<
          Database["woolwitch"]["Tables"]["user_roles"]["Insert"]
        >;
      };
    };
    Functions: {
      is_admin: {
        Args: Record<PropertyKey, never>;
        Returns: boolean;
      };
    };
  };
  public: {
    Tables: {
      [_ in never]: never;
    };
  };
}

export type Product = Database["woolwitch"]["Tables"]["products"]["Row"];
export type UserRole = Database["woolwitch"]["Tables"]["user_roles"]["Row"];
