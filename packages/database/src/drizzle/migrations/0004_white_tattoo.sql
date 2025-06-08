ALTER TABLE "drizzle"."role_permission" DROP CONSTRAINT "role_permission_role_id_role_id_fk";
--> statement-breakpoint
ALTER TABLE "drizzle"."role_permission" DROP CONSTRAINT "role_permission_permission_id_permission_id_fk";
--> statement-breakpoint
ALTER TABLE "drizzle"."role_permission" ADD CONSTRAINT "role_permission_role_id_role_id_fk" FOREIGN KEY ("role_id") REFERENCES "drizzle"."role"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "drizzle"."role_permission" ADD CONSTRAINT "role_permission_permission_id_permission_id_fk" FOREIGN KEY ("permission_id") REFERENCES "drizzle"."permission"("id") ON DELETE cascade ON UPDATE no action;