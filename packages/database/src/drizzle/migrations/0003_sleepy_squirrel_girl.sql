ALTER TABLE "drizzle"."event" DROP CONSTRAINT "event_name_unique";--> statement-breakpoint
ALTER TABLE "drizzle"."event" DROP CONSTRAINT "event_slug_unique";--> statement-breakpoint
ALTER TABLE "drizzle"."event" ALTER COLUMN "description" SET NOT NULL;