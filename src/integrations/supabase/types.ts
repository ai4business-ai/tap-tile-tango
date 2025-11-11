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
    PostgrestVersion: "13.0.4"
  }
  public: {
    Tables: {
      assignments: {
        Row: {
          created_at: string
          id: string
          level: string
          order_index: number
          skill_id: string
          task_id: string | null
          title: string
          updated_at: string
        }
        Insert: {
          created_at?: string
          id?: string
          level: string
          order_index: number
          skill_id: string
          task_id?: string | null
          title: string
          updated_at?: string
        }
        Update: {
          created_at?: string
          id?: string
          level?: string
          order_index?: number
          skill_id?: string
          task_id?: string | null
          title?: string
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "assignments_skill_id_fkey"
            columns: ["skill_id"]
            isOneToOne: false
            referencedRelation: "skills"
            referencedColumns: ["id"]
          },
        ]
      }
      documents: {
        Row: {
          created_at: string
          description: string | null
          extracted_text: string | null
          file_path: string
          file_size: number | null
          id: string
          mime_type: string | null
          task_type: string
          title: string
          updated_at: string
        }
        Insert: {
          created_at?: string
          description?: string | null
          extracted_text?: string | null
          file_path: string
          file_size?: number | null
          id?: string
          mime_type?: string | null
          task_type: string
          title: string
          updated_at?: string
        }
        Update: {
          created_at?: string
          description?: string | null
          extracted_text?: string | null
          file_path?: string
          file_size?: number | null
          id?: string
          mime_type?: string | null
          task_type?: string
          title?: string
          updated_at?: string
        }
        Relationships: []
      }
      prompt_attempts: {
        Row: {
          count: number
          created_at: string
          date: string
          device_id: string
          id: string
          task_id: string
          updated_at: string
        }
        Insert: {
          count?: number
          created_at?: string
          date?: string
          device_id: string
          id?: string
          task_id: string
          updated_at?: string
        }
        Update: {
          count?: number
          created_at?: string
          date?: string
          device_id?: string
          id?: string
          task_id?: string
          updated_at?: string
        }
        Relationships: []
      }
      skills: {
        Row: {
          created_at: string
          description: string | null
          id: string
          name: string
          order_index: number
          slug: string
          updated_at: string
        }
        Insert: {
          created_at?: string
          description?: string | null
          id?: string
          name: string
          order_index: number
          slug: string
          updated_at?: string
        }
        Update: {
          created_at?: string
          description?: string | null
          id?: string
          name?: string
          order_index?: number
          slug?: string
          updated_at?: string
        }
        Relationships: []
      }
      user_assignment_submissions: {
        Row: {
          ai_feedback: Json | null
          assignment_id: string
          completed_at: string | null
          created_at: string
          id: string
          score: number | null
          status: Database["public"]["Enums"]["assignment_status"]
          submitted_at: string | null
          updated_at: string
          user_answer: string | null
          user_id: string
        }
        Insert: {
          ai_feedback?: Json | null
          assignment_id: string
          completed_at?: string | null
          created_at?: string
          id?: string
          score?: number | null
          status?: Database["public"]["Enums"]["assignment_status"]
          submitted_at?: string | null
          updated_at?: string
          user_answer?: string | null
          user_id: string
        }
        Update: {
          ai_feedback?: Json | null
          assignment_id?: string
          completed_at?: string | null
          created_at?: string
          id?: string
          score?: number | null
          status?: Database["public"]["Enums"]["assignment_status"]
          submitted_at?: string | null
          updated_at?: string
          user_answer?: string | null
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "user_assignment_submissions_assignment_id_fkey"
            columns: ["assignment_id"]
            isOneToOne: false
            referencedRelation: "assignments"
            referencedColumns: ["id"]
          },
        ]
      }
      user_skills: {
        Row: {
          created_at: string
          current_level: number
          id: string
          is_goal_achieved: boolean
          progress_percent: number
          skill_id: string
          target_level: number
          updated_at: string
          user_id: string
        }
        Insert: {
          created_at?: string
          current_level?: number
          id?: string
          is_goal_achieved?: boolean
          progress_percent?: number
          skill_id: string
          target_level?: number
          updated_at?: string
          user_id: string
        }
        Update: {
          created_at?: string
          current_level?: number
          id?: string
          is_goal_achieved?: boolean
          progress_percent?: number
          skill_id?: string
          target_level?: number
          updated_at?: string
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "user_skills_skill_id_fkey"
            columns: ["skill_id"]
            isOneToOne: false
            referencedRelation: "skills"
            referencedColumns: ["id"]
          },
        ]
      }
    }
    Views: {
      [_ in never]: never
    }
    Functions: {
      initialize_user_skills: {
        Args: { p_user_id: string }
        Returns: undefined
      }
      log_security_event: {
        Args: { details?: Json; event_type: string; user_id?: string }
        Returns: undefined
      }
      recalculate_skill_progress: {
        Args: { p_skill_id: string; p_user_id: string }
        Returns: undefined
      }
    }
    Enums: {
      assignment_status:
        | "not_started"
        | "in_progress"
        | "submitted"
        | "completed"
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
    Enums: {
      assignment_status: [
        "not_started",
        "in_progress",
        "submitted",
        "completed",
      ],
    },
  },
} as const
