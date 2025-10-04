export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[]

export type Database = {
  // Allows to automatically instantiate createClient with right options
  // instead of createClient<Database, { PostgrestVersion: 'XX' }>(URL, KEY)
  __InternalSupabase: {
    PostgrestVersion: "13.0.5"
  }
  public: {
    Tables: {
      activity_log: {
        Row: {
          activity_type: string
          created_at: string | null
          description: string
          id: string
          points_earned: number | null
          related_id: string | null
          user_id: string
        }
        Insert: {
          activity_type: string
          created_at?: string | null
          description: string
          id?: string
          points_earned?: number | null
          related_id?: string | null
          user_id: string
        }
        Update: {
          activity_type?: string
          created_at?: string | null
          description?: string
          id?: string
          points_earned?: number | null
          related_id?: string | null
          user_id?: string
        }
        Relationships: []
      }
      badges: {
        Row: {
          created_at: string | null
          criteria_type: string
          criteria_value: number
          description: string
          icon: string
          id: string
          name: string
          points_reward: number
        }
        Insert: {
          created_at?: string | null
          criteria_type: string
          criteria_value: number
          description: string
          icon: string
          id?: string
          name: string
          points_reward?: number
        }
        Update: {
          created_at?: string | null
          criteria_type?: string
          criteria_value?: number
          description?: string
          icon?: string
          id?: string
          name?: string
          points_reward?: number
        }
        Relationships: []
      }
      certificates: {
        Row: {
          badge_id: string | null
          certificate_url: string | null
          description: string
          id: string
          issued_date: string | null
          title: string
          user_id: string
        }
        Insert: {
          badge_id?: string | null
          certificate_url?: string | null
          description: string
          id?: string
          issued_date?: string | null
          title: string
          user_id: string
        }
        Update: {
          badge_id?: string | null
          certificate_url?: string | null
          description?: string
          id?: string
          issued_date?: string | null
          title?: string
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "certificates_badge_id_fkey"
            columns: ["badge_id"]
            isOneToOne: false
            referencedRelation: "badges"
            referencedColumns: ["id"]
          },
        ]
      }
      community_posts: {
        Row: {
          content: string
          created_at: string | null
          id: string
          image_url: string | null
          topic: string | null
          updated_at: string | null
          user_id: string
        }
        Insert: {
          content: string
          created_at?: string | null
          id?: string
          image_url?: string | null
          topic?: string | null
          updated_at?: string | null
          user_id: string
        }
        Update: {
          content?: string
          created_at?: string | null
          id?: string
          image_url?: string | null
          topic?: string | null
          updated_at?: string | null
          user_id?: string
        }
        Relationships: []
      }
      lessons: {
        Row: {
          content: string
          created_at: string | null
          id: string
          module_id: string | null
          order_index: number
          title: string
          video_url: string | null
        }
        Insert: {
          content: string
          created_at?: string | null
          id?: string
          module_id?: string | null
          order_index?: number
          title: string
          video_url?: string | null
        }
        Update: {
          content?: string
          created_at?: string | null
          id?: string
          module_id?: string | null
          order_index?: number
          title?: string
          video_url?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "lessons_module_id_fkey"
            columns: ["module_id"]
            isOneToOne: false
            referencedRelation: "modules"
            referencedColumns: ["id"]
          },
        ]
      }
      mission_submissions: {
        Row: {
          id: string
          mission_id: string | null
          officer_remarks: string | null
          proof_description: string | null
          proof_url: string | null
          status: string
          submitted_at: string | null
          updated_at: string | null
          user_id: string
          verified_at: string | null
          verified_by: string | null
        }
        Insert: {
          id?: string
          mission_id?: string | null
          officer_remarks?: string | null
          proof_description?: string | null
          proof_url?: string | null
          status?: string
          submitted_at?: string | null
          updated_at?: string | null
          user_id: string
          verified_at?: string | null
          verified_by?: string | null
        }
        Update: {
          id?: string
          mission_id?: string | null
          officer_remarks?: string | null
          proof_description?: string | null
          proof_url?: string | null
          status?: string
          submitted_at?: string | null
          updated_at?: string | null
          user_id?: string
          verified_at?: string | null
          verified_by?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "mission_submissions_mission_id_fkey"
            columns: ["mission_id"]
            isOneToOne: false
            referencedRelation: "missions"
            referencedColumns: ["id"]
          },
        ]
      }
      missions: {
        Row: {
          category: string
          created_at: string | null
          description: string
          difficulty: string
          duration_days: number
          icon: string
          id: string
          impact_description: string | null
          is_active: boolean
          points_reward: number
          title: string
        }
        Insert: {
          category: string
          created_at?: string | null
          description: string
          difficulty?: string
          duration_days?: number
          icon?: string
          id?: string
          impact_description?: string | null
          is_active?: boolean
          points_reward?: number
          title: string
        }
        Update: {
          category?: string
          created_at?: string | null
          description?: string
          difficulty?: string
          duration_days?: number
          icon?: string
          id?: string
          impact_description?: string | null
          is_active?: boolean
          points_reward?: number
          title?: string
        }
        Relationships: []
      }
      modules: {
        Row: {
          content: string
          created_at: string | null
          description: string
          difficulty: string
          duration_minutes: number
          id: string
          image_url: string | null
          order_index: number
          points: number
          title: string
          topics: string[]
          video_url: string | null
        }
        Insert: {
          content: string
          created_at?: string | null
          description: string
          difficulty: string
          duration_minutes?: number
          id?: string
          image_url?: string | null
          order_index?: number
          points?: number
          title: string
          topics?: string[]
          video_url?: string | null
        }
        Update: {
          content?: string
          created_at?: string | null
          description?: string
          difficulty?: string
          duration_minutes?: number
          id?: string
          image_url?: string | null
          order_index?: number
          points?: number
          title?: string
          topics?: string[]
          video_url?: string | null
        }
        Relationships: []
      }
      officer_roles: {
        Row: {
          created_at: string | null
          district: string | null
          id: string
          panchayat: string | null
          role: string
          user_id: string
        }
        Insert: {
          created_at?: string | null
          district?: string | null
          id?: string
          panchayat?: string | null
          role?: string
          user_id: string
        }
        Update: {
          created_at?: string | null
          district?: string | null
          id?: string
          panchayat?: string | null
          role?: string
          user_id?: string
        }
        Relationships: []
      }
      post_comments: {
        Row: {
          content: string
          created_at: string | null
          id: string
          post_id: string
          user_id: string
        }
        Insert: {
          content: string
          created_at?: string | null
          id?: string
          post_id: string
          user_id: string
        }
        Update: {
          content?: string
          created_at?: string | null
          id?: string
          post_id?: string
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "post_comments_post_id_fkey"
            columns: ["post_id"]
            isOneToOne: false
            referencedRelation: "community_posts"
            referencedColumns: ["id"]
          },
        ]
      }
      post_likes: {
        Row: {
          created_at: string | null
          id: string
          post_id: string
          user_id: string
        }
        Insert: {
          created_at?: string | null
          id?: string
          post_id: string
          user_id: string
        }
        Update: {
          created_at?: string | null
          id?: string
          post_id?: string
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "post_likes_post_id_fkey"
            columns: ["post_id"]
            isOneToOne: false
            referencedRelation: "community_posts"
            referencedColumns: ["id"]
          },
        ]
      }
      profiles: {
        Row: {
          avatar: string | null
          created_at: string | null
          district: string | null
          id: string
          name: string
          panchayat: string | null
          phone: string
          primary_crop: string | null
        }
        Insert: {
          avatar?: string | null
          created_at?: string | null
          district?: string | null
          id: string
          name: string
          panchayat?: string | null
          phone: string
          primary_crop?: string | null
        }
        Update: {
          avatar?: string | null
          created_at?: string | null
          district?: string | null
          id?: string
          name?: string
          panchayat?: string | null
          phone?: string
          primary_crop?: string | null
        }
        Relationships: []
      }
      quiz_attempts: {
        Row: {
          answers: Json
          created_at: string | null
          id: string
          module_id: string | null
          passed: boolean
          quiz_id: string | null
          score: number
          time_taken_seconds: number
          total_questions: number
          user_id: string | null
        }
        Insert: {
          answers: Json
          created_at?: string | null
          id?: string
          module_id?: string | null
          passed?: boolean
          quiz_id?: string | null
          score: number
          time_taken_seconds: number
          total_questions: number
          user_id?: string | null
        }
        Update: {
          answers?: Json
          created_at?: string | null
          id?: string
          module_id?: string | null
          passed?: boolean
          quiz_id?: string | null
          score?: number
          time_taken_seconds?: number
          total_questions?: number
          user_id?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "quiz_attempts_module_id_fkey"
            columns: ["module_id"]
            isOneToOne: false
            referencedRelation: "modules"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "quiz_attempts_quiz_id_fkey"
            columns: ["quiz_id"]
            isOneToOne: false
            referencedRelation: "quizzes"
            referencedColumns: ["id"]
          },
        ]
      }
      quiz_questions: {
        Row: {
          correct_answer: number
          created_at: string | null
          id: string
          options: Json
          order_index: number
          points: number
          question: string
          quiz_id: string | null
        }
        Insert: {
          correct_answer: number
          created_at?: string | null
          id?: string
          options: Json
          order_index?: number
          points?: number
          question: string
          quiz_id?: string | null
        }
        Update: {
          correct_answer?: number
          created_at?: string | null
          id?: string
          options?: Json
          order_index?: number
          points?: number
          question?: string
          quiz_id?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "quiz_questions_quiz_id_fkey"
            columns: ["quiz_id"]
            isOneToOne: false
            referencedRelation: "quizzes"
            referencedColumns: ["id"]
          },
        ]
      }
      quizzes: {
        Row: {
          created_at: string | null
          id: string
          module_id: string | null
          passing_score: number
          time_limit_minutes: number
          title: string
        }
        Insert: {
          created_at?: string | null
          id?: string
          module_id?: string | null
          passing_score?: number
          time_limit_minutes?: number
          title: string
        }
        Update: {
          created_at?: string | null
          id?: string
          module_id?: string | null
          passing_score?: number
          time_limit_minutes?: number
          title?: string
        }
        Relationships: [
          {
            foreignKeyName: "quizzes_module_id_fkey"
            columns: ["module_id"]
            isOneToOne: false
            referencedRelation: "modules"
            referencedColumns: ["id"]
          },
        ]
      }
      reward_redemptions: {
        Row: {
          id: string
          points_spent: number
          redeemed_at: string | null
          reward_id: string | null
          status: string
          user_id: string | null
        }
        Insert: {
          id?: string
          points_spent: number
          redeemed_at?: string | null
          reward_id?: string | null
          status?: string
          user_id?: string | null
        }
        Update: {
          id?: string
          points_spent?: number
          redeemed_at?: string | null
          reward_id?: string | null
          status?: string
          user_id?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "reward_redemptions_reward_id_fkey"
            columns: ["reward_id"]
            isOneToOne: false
            referencedRelation: "rewards"
            referencedColumns: ["id"]
          },
        ]
      }
      rewards: {
        Row: {
          category: string
          created_at: string | null
          description: string
          id: string
          image_url: string | null
          is_active: boolean
          points_cost: number
          stock_quantity: number
          title: string
        }
        Insert: {
          category: string
          created_at?: string | null
          description: string
          id?: string
          image_url?: string | null
          is_active?: boolean
          points_cost: number
          stock_quantity?: number
          title: string
        }
        Update: {
          category?: string
          created_at?: string | null
          description?: string
          id?: string
          image_url?: string | null
          is_active?: boolean
          points_cost?: number
          stock_quantity?: number
          title?: string
        }
        Relationships: []
      }
      user_badges: {
        Row: {
          badge_id: string | null
          earned_at: string | null
          id: string
          user_id: string | null
        }
        Insert: {
          badge_id?: string | null
          earned_at?: string | null
          id?: string
          user_id?: string | null
        }
        Update: {
          badge_id?: string | null
          earned_at?: string | null
          id?: string
          user_id?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "user_badges_badge_id_fkey"
            columns: ["badge_id"]
            isOneToOne: false
            referencedRelation: "badges"
            referencedColumns: ["id"]
          },
        ]
      }
      user_levels: {
        Row: {
          created_at: string | null
          current_level: number
          id: string
          next_level_xp: number
          total_xp: number
          updated_at: string | null
          user_id: string
        }
        Insert: {
          created_at?: string | null
          current_level?: number
          id?: string
          next_level_xp?: number
          total_xp?: number
          updated_at?: string | null
          user_id: string
        }
        Update: {
          created_at?: string | null
          current_level?: number
          id?: string
          next_level_xp?: number
          total_xp?: number
          updated_at?: string | null
          user_id?: string
        }
        Relationships: []
      }
      user_module_progress: {
        Row: {
          completed: boolean
          completed_at: string | null
          id: string
          module_id: string | null
          progress_percentage: number
          started_at: string | null
          user_id: string | null
        }
        Insert: {
          completed?: boolean
          completed_at?: string | null
          id?: string
          module_id?: string | null
          progress_percentage?: number
          started_at?: string | null
          user_id?: string | null
        }
        Update: {
          completed?: boolean
          completed_at?: string | null
          id?: string
          module_id?: string | null
          progress_percentage?: number
          started_at?: string | null
          user_id?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "user_module_progress_module_id_fkey"
            columns: ["module_id"]
            isOneToOne: false
            referencedRelation: "modules"
            referencedColumns: ["id"]
          },
        ]
      }
      user_points: {
        Row: {
          created_at: string | null
          description: string | null
          id: string
          points: number
          source: string
          user_id: string | null
        }
        Insert: {
          created_at?: string | null
          description?: string | null
          id?: string
          points?: number
          source: string
          user_id?: string | null
        }
        Update: {
          created_at?: string | null
          description?: string | null
          id?: string
          points?: number
          source?: string
          user_id?: string | null
        }
        Relationships: []
      }
      user_streaks: {
        Row: {
          created_at: string | null
          current_streak: number
          id: string
          last_activity_date: string
          longest_streak: number
          updated_at: string | null
          user_id: string | null
        }
        Insert: {
          created_at?: string | null
          current_streak?: number
          id?: string
          last_activity_date?: string
          longest_streak?: number
          updated_at?: string | null
          user_id?: string | null
        }
        Update: {
          created_at?: string | null
          current_streak?: number
          id?: string
          last_activity_date?: string
          longest_streak?: number
          updated_at?: string | null
          user_id?: string | null
        }
        Relationships: []
      }
    }
    Views: {
      [_ in never]: never
    }
    Functions: {
      complete_mission: {
        Args: {
          p_mission_id: string
          p_submission_id: string
          p_user_id: string
        }
        Returns: undefined
      }
      get_user_total_points: {
        Args: { p_user_id: string }
        Returns: number
      }
      update_user_streak: {
        Args: { p_user_id: string }
        Returns: undefined
      }
    }
    Enums: {
      [_ in never]: never
    }
    CompositeTypes: {
      [_ in never]: never
    }
  }
}

type DatabaseWithoutInternals = Omit<Database, "__InternalSupabase">

type DefaultSchema = DatabaseWithoutInternals[Extract<keyof Database, "public">]

export type Tables<
  DefaultSchemaTableNameOrOptions extends
    | keyof (DefaultSchema["Tables"] & DefaultSchema["Views"])
    | { schema: keyof DatabaseWithoutInternals },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof (DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"] &
        DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Views"])
    : never = never,
> = DefaultSchemaTableNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? (DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"] &
      DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Views"])[TableName] extends {
      Row: infer R
    }
    ? R
    : never
  : DefaultSchemaTableNameOrOptions extends keyof (DefaultSchema["Tables"] &
        DefaultSchema["Views"])
    ? (DefaultSchema["Tables"] &
        DefaultSchema["Views"])[DefaultSchemaTableNameOrOptions] extends {
        Row: infer R
      }
      ? R
      : never
    : never

export type TablesInsert<
  DefaultSchemaTableNameOrOptions extends
    | keyof DefaultSchema["Tables"]
    | { schema: keyof DatabaseWithoutInternals },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"]
    : never = never,
> = DefaultSchemaTableNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"][TableName] extends {
      Insert: infer I
    }
    ? I
    : never
  : DefaultSchemaTableNameOrOptions extends keyof DefaultSchema["Tables"]
    ? DefaultSchema["Tables"][DefaultSchemaTableNameOrOptions] extends {
        Insert: infer I
      }
      ? I
      : never
    : never

export type TablesUpdate<
  DefaultSchemaTableNameOrOptions extends
    | keyof DefaultSchema["Tables"]
    | { schema: keyof DatabaseWithoutInternals },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"]
    : never = never,
> = DefaultSchemaTableNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"][TableName] extends {
      Update: infer U
    }
    ? U
    : never
  : DefaultSchemaTableNameOrOptions extends keyof DefaultSchema["Tables"]
    ? DefaultSchema["Tables"][DefaultSchemaTableNameOrOptions] extends {
        Update: infer U
      }
      ? U
      : never
    : never

export type Enums<
  DefaultSchemaEnumNameOrOptions extends
    | keyof DefaultSchema["Enums"]
    | { schema: keyof DatabaseWithoutInternals },
  EnumName extends DefaultSchemaEnumNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[DefaultSchemaEnumNameOrOptions["schema"]]["Enums"]
    : never = never,
> = DefaultSchemaEnumNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? DatabaseWithoutInternals[DefaultSchemaEnumNameOrOptions["schema"]]["Enums"][EnumName]
  : DefaultSchemaEnumNameOrOptions extends keyof DefaultSchema["Enums"]
    ? DefaultSchema["Enums"][DefaultSchemaEnumNameOrOptions]
    : never

export type CompositeTypes<
  PublicCompositeTypeNameOrOptions extends
    | keyof DefaultSchema["CompositeTypes"]
    | { schema: keyof DatabaseWithoutInternals },
  CompositeTypeName extends PublicCompositeTypeNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"]
    : never = never,
> = PublicCompositeTypeNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? DatabaseWithoutInternals[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"][CompositeTypeName]
  : PublicCompositeTypeNameOrOptions extends keyof DefaultSchema["CompositeTypes"]
    ? DefaultSchema["CompositeTypes"][PublicCompositeTypeNameOrOptions]
    : never

export const Constants = {
  public: {
    Enums: {},
  },
} as const
