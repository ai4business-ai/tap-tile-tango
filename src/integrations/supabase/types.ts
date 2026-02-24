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
      course_lessons: {
        Row: {
          content_json: Json
          created_at: string
          id: string
          lesson_type: Database["public"]["Enums"]["lesson_type"]
          module_id: string
          order_index: number
          title: string
          trainer_assignment_id: string | null
          trainer_skill_id: string | null
          updated_at: string
        }
        Insert: {
          content_json?: Json
          created_at?: string
          id?: string
          lesson_type?: Database["public"]["Enums"]["lesson_type"]
          module_id: string
          order_index?: number
          title: string
          trainer_assignment_id?: string | null
          trainer_skill_id?: string | null
          updated_at?: string
        }
        Update: {
          content_json?: Json
          created_at?: string
          id?: string
          lesson_type?: Database["public"]["Enums"]["lesson_type"]
          module_id?: string
          order_index?: number
          title?: string
          trainer_assignment_id?: string | null
          trainer_skill_id?: string | null
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "course_lessons_module_id_fkey"
            columns: ["module_id"]
            isOneToOne: false
            referencedRelation: "course_modules"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "course_lessons_trainer_assignment_id_fkey"
            columns: ["trainer_assignment_id"]
            isOneToOne: false
            referencedRelation: "assignments"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "course_lessons_trainer_skill_id_fkey"
            columns: ["trainer_skill_id"]
            isOneToOne: false
            referencedRelation: "skills"
            referencedColumns: ["id"]
          },
        ]
      }
      course_modules: {
        Row: {
          course_id: string
          created_at: string
          description: string | null
          id: string
          order_index: number
          title: string
          updated_at: string
        }
        Insert: {
          course_id: string
          created_at?: string
          description?: string | null
          id?: string
          order_index?: number
          title: string
          updated_at?: string
        }
        Update: {
          course_id?: string
          created_at?: string
          description?: string | null
          id?: string
          order_index?: number
          title?: string
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "course_modules_course_id_fkey"
            columns: ["course_id"]
            isOneToOne: false
            referencedRelation: "courses"
            referencedColumns: ["id"]
          },
        ]
      }
      courses: {
        Row: {
          course_type: Database["public"]["Enums"]["course_type"]
          cover_image_url: string | null
          created_at: string
          description: string
          id: string
          is_published: boolean
          order_index: number
          slug: string
          title: string
          updated_at: string
        }
        Insert: {
          course_type?: Database["public"]["Enums"]["course_type"]
          cover_image_url?: string | null
          created_at?: string
          description?: string
          id?: string
          is_published?: boolean
          order_index?: number
          slug: string
          title: string
          updated_at?: string
        }
        Update: {
          course_type?: Database["public"]["Enums"]["course_type"]
          cover_image_url?: string | null
          created_at?: string
          description?: string
          id?: string
          is_published?: boolean
          order_index?: number
          slug?: string
          title?: string
          updated_at?: string
        }
        Relationships: []
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
          environment: Database["public"]["Enums"]["environment_type"]
          id: string
          task_id: string
          updated_at: string
        }
        Insert: {
          count?: number
          created_at?: string
          date?: string
          device_id: string
          environment?: Database["public"]["Enums"]["environment_type"]
          id?: string
          task_id: string
          updated_at?: string
        }
        Update: {
          count?: number
          created_at?: string
          date?: string
          device_id?: string
          environment?: Database["public"]["Enums"]["environment_type"]
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
          is_locked: boolean
          name: string
          order_index: number
          slug: string
          updated_at: string
        }
        Insert: {
          created_at?: string
          description?: string | null
          id?: string
          is_locked?: boolean
          name: string
          order_index: number
          slug: string
          updated_at?: string
        }
        Update: {
          created_at?: string
          description?: string | null
          id?: string
          is_locked?: boolean
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
          environment: Database["public"]["Enums"]["environment_type"]
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
          environment?: Database["public"]["Enums"]["environment_type"]
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
          environment?: Database["public"]["Enums"]["environment_type"]
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
      user_courses: {
        Row: {
          course_id: string
          enrolled_at: string
          environment: Database["public"]["Enums"]["environment_type"]
          id: string
          last_lesson_id: string | null
          progress_percent: number
          user_id: string
        }
        Insert: {
          course_id: string
          enrolled_at?: string
          environment?: Database["public"]["Enums"]["environment_type"]
          id?: string
          last_lesson_id?: string | null
          progress_percent?: number
          user_id: string
        }
        Update: {
          course_id?: string
          enrolled_at?: string
          environment?: Database["public"]["Enums"]["environment_type"]
          id?: string
          last_lesson_id?: string | null
          progress_percent?: number
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "user_courses_course_id_fkey"
            columns: ["course_id"]
            isOneToOne: false
            referencedRelation: "courses"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "user_courses_last_lesson_id_fkey"
            columns: ["last_lesson_id"]
            isOneToOne: false
            referencedRelation: "course_lessons"
            referencedColumns: ["id"]
          },
        ]
      }
      user_lesson_progress: {
        Row: {
          completed_at: string | null
          environment: Database["public"]["Enums"]["environment_type"]
          id: string
          lesson_id: string
          score: number | null
          status: Database["public"]["Enums"]["lesson_status"]
          user_id: string
        }
        Insert: {
          completed_at?: string | null
          environment?: Database["public"]["Enums"]["environment_type"]
          id?: string
          lesson_id: string
          score?: number | null
          status?: Database["public"]["Enums"]["lesson_status"]
          user_id: string
        }
        Update: {
          completed_at?: string | null
          environment?: Database["public"]["Enums"]["environment_type"]
          id?: string
          lesson_id?: string
          score?: number | null
          status?: Database["public"]["Enums"]["lesson_status"]
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "user_lesson_progress_lesson_id_fkey"
            columns: ["lesson_id"]
            isOneToOne: false
            referencedRelation: "course_lessons"
            referencedColumns: ["id"]
          },
        ]
      }
      user_skills: {
        Row: {
          created_at: string
          current_level: number
          environment: Database["public"]["Enums"]["environment_type"]
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
          environment?: Database["public"]["Enums"]["environment_type"]
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
          environment?: Database["public"]["Enums"]["environment_type"]
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
      get_current_environment: {
        Args: never
        Returns: Database["public"]["Enums"]["environment_type"]
      }
      initialize_user_skills:
        | { Args: { p_user_id: string }; Returns: undefined }
        | {
            Args: {
              p_environment?: Database["public"]["Enums"]["environment_type"]
              p_user_id: string
            }
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
      course_type: "trainer" | "theory_practice" | "video" | "quiz"
      environment_type: "dev" | "prod"
      lesson_status: "not_started" | "in_progress" | "completed"
      lesson_type: "theory" | "practice" | "video" | "quiz" | "trainer_task"
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
      course_type: ["trainer", "theory_practice", "video", "quiz"],
      environment_type: ["dev", "prod"],
      lesson_status: ["not_started", "in_progress", "completed"],
      lesson_type: ["theory", "practice", "video", "quiz", "trainer_task"],
    },
  },
} as const
