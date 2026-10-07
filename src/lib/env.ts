import { z } from "zod";

const envSchema = z.object({
  NEXT_PUBLIC_APP_NAME: z.string().default("MathLab"),
  NEXT_PUBLIC_SITE_URL: z.string().url().default("http://localhost:3000"),

  NEXT_PUBLIC_SUPABASE_URL: z.string().min(1, "NEXT_PUBLIC_SUPABASE_URL is required"),
  NEXT_PUBLIC_SUPABASE_ANON_KEY: z.string().min(1, "NEXT_PUBLIC_SUPABASE_ANON_KEY is required"),
  SUPABASE_SERVICE_ROLE_KEY: z.string().optional(),

  GEMINI_API_KEY: z.string().optional(),
  GEMINI_MODEL: z.string().default("gemini-2.5-flash"),

  AI_DAILY_LIMIT_STUDENT: z.coerce.number().default(30),
  AI_DAILY_LIMIT_TEACHER: z.coerce.number().default(100),
  REQUIRE_TEACHER_APPROVAL: z
    .string()
    .transform((val) => val === "true")
    .default("false"),
});

const _env = envSchema.safeParse({
  NEXT_PUBLIC_APP_NAME: process.env.NEXT_PUBLIC_APP_NAME,
  NEXT_PUBLIC_SITE_URL: process.env.NEXT_PUBLIC_SITE_URL,
  NEXT_PUBLIC_SUPABASE_URL: process.env.NEXT_PUBLIC_SUPABASE_URL,
  NEXT_PUBLIC_SUPABASE_ANON_KEY: process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY,
  SUPABASE_SERVICE_ROLE_KEY: process.env.SUPABASE_SERVICE_ROLE_KEY,
  GEMINI_API_KEY: process.env.GEMINI_API_KEY,
  GEMINI_MODEL: process.env.GEMINI_MODEL,
  AI_DAILY_LIMIT_STUDENT: process.env.AI_DAILY_LIMIT_STUDENT,
  AI_DAILY_LIMIT_TEACHER: process.env.AI_DAILY_LIMIT_TEACHER,
  REQUIRE_TEACHER_APPROVAL: process.env.REQUIRE_TEACHER_APPROVAL,
});

if (!_env.success) {
  console.warn("⚠️ Warning: Environment variables validation issues:", _env.error.format());
}

export const env = _env.success
  ? _env.data
  : {
      NEXT_PUBLIC_APP_NAME: process.env.NEXT_PUBLIC_APP_NAME || "MathLab",
      NEXT_PUBLIC_SITE_URL: process.env.NEXT_PUBLIC_SITE_URL || "http://localhost:3000",
      NEXT_PUBLIC_SUPABASE_URL: process.env.NEXT_PUBLIC_SUPABASE_URL || "https://placeholder.supabase.co",
      NEXT_PUBLIC_SUPABASE_ANON_KEY: process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || "placeholder-anon-key",
      SUPABASE_SERVICE_ROLE_KEY: process.env.SUPABASE_SERVICE_ROLE_KEY || "",
      GEMINI_API_KEY: process.env.GEMINI_API_KEY || "",
      GEMINI_MODEL: process.env.GEMINI_MODEL || "gemini-2.5-flash",
      AI_DAILY_LIMIT_STUDENT: Number(process.env.AI_DAILY_LIMIT_STUDENT || 30),
      AI_DAILY_LIMIT_TEACHER: Number(process.env.AI_DAILY_LIMIT_TEACHER || 100),
      REQUIRE_TEACHER_APPROVAL: process.env.REQUIRE_TEACHER_APPROVAL === "true",
    };
