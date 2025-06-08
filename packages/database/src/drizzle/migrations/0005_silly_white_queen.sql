ALTER TABLE "drizzle"."user_role" DROP CONSTRAINT "user_role_user_id_user_id_fk";
--> statement-breakpoint
ALTER TABLE "drizzle"."user_role" DROP CONSTRAINT "user_role_role_id_role_id_fk";
--> statement-breakpoint
ALTER TABLE "drizzle"."user_role" ADD CONSTRAINT "user_role_user_id_user_id_fk" FOREIGN KEY ("user_id") REFERENCES "drizzle"."user"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "drizzle"."user_role" ADD CONSTRAINT "user_role_role_id_role_id_fk" FOREIGN KEY ("role_id") REFERENCES "drizzle"."role"("id") ON DELETE cascade ON UPDATE no action;