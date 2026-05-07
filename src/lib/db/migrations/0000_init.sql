CREATE TABLE "accounts" (
	"id" text PRIMARY KEY NOT NULL,
	"user_id" text NOT NULL,
	"provider_id" text NOT NULL,
	"account_id" text NOT NULL,
	"access_token" text,
	"refresh_token" text,
	"id_token" text,
	"access_token_expires_at" timestamp,
	"refresh_token_expires_at" timestamp,
	"scope" text,
	"password" text,
	"created_at" timestamp DEFAULT now() NOT NULL,
	"updated_at" timestamp DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE "attempts" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"user_id" text NOT NULL,
	"set_id" text NOT NULL,
	"exam_code" text NOT NULL,
	"started_at" timestamp NOT NULL,
	"submitted_at" timestamp NOT NULL,
	"duration_seconds_taken" integer NOT NULL,
	"total_questions" integer NOT NULL,
	"attempted" integer NOT NULL,
	"correct" integer NOT NULL,
	"score_percent" integer NOT NULL,
	"passed" boolean NOT NULL,
	"responses" jsonb NOT NULL
);
--> statement-breakpoint
CREATE TABLE "exams" (
	"code" text PRIMARY KEY NOT NULL,
	"name" text NOT NULL,
	"full_name" text NOT NULL,
	"description" text,
	"total_questions" integer NOT NULL,
	"duration_minutes" integer NOT NULL,
	"pass_mark_percent" integer NOT NULL,
	"negative_marking" boolean DEFAULT false NOT NULL,
	"active" boolean DEFAULT true NOT NULL,
	"created_at" timestamp DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE "questions" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"exam_code" text NOT NULL,
	"topic_code" text NOT NULL,
	"question" text NOT NULL,
	"options" jsonb NOT NULL,
	"correct_index" integer NOT NULL,
	"explanation" text NOT NULL,
	"difficulty" integer DEFAULT 2 NOT NULL
);
--> statement-breakpoint
CREATE TABLE "sessions" (
	"id" text PRIMARY KEY NOT NULL,
	"user_id" text NOT NULL,
	"expires_at" timestamp NOT NULL,
	"token" text NOT NULL,
	"ip_address" text,
	"user_agent" text,
	"created_at" timestamp DEFAULT now() NOT NULL,
	"updated_at" timestamp DEFAULT now() NOT NULL,
	CONSTRAINT "sessions_token_unique" UNIQUE("token")
);
--> statement-breakpoint
CREATE TABLE "test_set_questions" (
	"set_id" text NOT NULL,
	"question_id" uuid NOT NULL,
	"question_order" integer NOT NULL,
	CONSTRAINT "test_set_questions_set_id_question_id_pk" PRIMARY KEY("set_id","question_id")
);
--> statement-breakpoint
CREATE TABLE "test_sets" (
	"id" text PRIMARY KEY NOT NULL,
	"exam_code" text NOT NULL,
	"name" text NOT NULL,
	"description" text,
	"topic_code" text,
	"duration_seconds" integer NOT NULL,
	"is_dynamic" boolean DEFAULT false NOT NULL,
	"display_order" integer NOT NULL
);
--> statement-breakpoint
CREATE TABLE "topics" (
	"code" text NOT NULL,
	"exam_code" text NOT NULL,
	"name" text NOT NULL,
	"weight_in_exam" integer,
	"display_order" integer NOT NULL,
	CONSTRAINT "topics_exam_code_code_pk" PRIMARY KEY("exam_code","code")
);
--> statement-breakpoint
CREATE TABLE "users" (
	"id" text PRIMARY KEY NOT NULL,
	"email" text NOT NULL,
	"name" text,
	"image" text,
	"email_verified" boolean DEFAULT false NOT NULL,
	"created_at" timestamp DEFAULT now() NOT NULL,
	"updated_at" timestamp DEFAULT now() NOT NULL,
	CONSTRAINT "users_email_unique" UNIQUE("email")
);
--> statement-breakpoint
CREATE TABLE "verifications" (
	"id" text PRIMARY KEY NOT NULL,
	"identifier" text NOT NULL,
	"value" text NOT NULL,
	"expires_at" timestamp NOT NULL,
	"created_at" timestamp DEFAULT now() NOT NULL,
	"updated_at" timestamp DEFAULT now() NOT NULL
);
--> statement-breakpoint
ALTER TABLE "accounts" ADD CONSTRAINT "accounts_user_id_users_id_fk" FOREIGN KEY ("user_id") REFERENCES "public"."users"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "attempts" ADD CONSTRAINT "attempts_user_id_users_id_fk" FOREIGN KEY ("user_id") REFERENCES "public"."users"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "attempts" ADD CONSTRAINT "attempts_set_id_test_sets_id_fk" FOREIGN KEY ("set_id") REFERENCES "public"."test_sets"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "attempts" ADD CONSTRAINT "attempts_exam_code_exams_code_fk" FOREIGN KEY ("exam_code") REFERENCES "public"."exams"("code") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "questions" ADD CONSTRAINT "questions_exam_code_exams_code_fk" FOREIGN KEY ("exam_code") REFERENCES "public"."exams"("code") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "sessions" ADD CONSTRAINT "sessions_user_id_users_id_fk" FOREIGN KEY ("user_id") REFERENCES "public"."users"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "test_set_questions" ADD CONSTRAINT "test_set_questions_set_id_test_sets_id_fk" FOREIGN KEY ("set_id") REFERENCES "public"."test_sets"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "test_set_questions" ADD CONSTRAINT "test_set_questions_question_id_questions_id_fk" FOREIGN KEY ("question_id") REFERENCES "public"."questions"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "test_sets" ADD CONSTRAINT "test_sets_exam_code_exams_code_fk" FOREIGN KEY ("exam_code") REFERENCES "public"."exams"("code") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "topics" ADD CONSTRAINT "topics_exam_code_exams_code_fk" FOREIGN KEY ("exam_code") REFERENCES "public"."exams"("code") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
CREATE INDEX "user_idx" ON "attempts" USING btree ("user_id");--> statement-breakpoint
CREATE INDEX "user_exam_idx" ON "attempts" USING btree ("user_id","exam_code");--> statement-breakpoint
CREATE INDEX "exam_topic_idx" ON "questions" USING btree ("exam_code","topic_code");