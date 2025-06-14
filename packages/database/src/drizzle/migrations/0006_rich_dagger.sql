CREATE TABLE "drizzle"."event_bookmark" (
	"event_id" uuid NOT NULL,
	"user_id" uuid NOT NULL,
	"created_at" timestamp with time zone DEFAULT now() NOT NULL,
	"updated_at" timestamp with time zone DEFAULT now() NOT NULL,
	CONSTRAINT "event_bookmark_event_id_user_id_pk" PRIMARY KEY("event_id","user_id")
);
--> statement-breakpoint
ALTER TABLE "drizzle"."event_bookmark" ADD CONSTRAINT "event_bookmark_event_id_event_id_fk" FOREIGN KEY ("event_id") REFERENCES "drizzle"."event"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "drizzle"."event_bookmark" ADD CONSTRAINT "event_bookmark_user_id_user_id_fk" FOREIGN KEY ("user_id") REFERENCES "drizzle"."user"("id") ON DELETE cascade ON UPDATE no action;