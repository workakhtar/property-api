ALTER TABLE "properties" ALTER COLUMN "state" SET DATA TYPE varchar(10);--> statement-breakpoint
ALTER TABLE "owners" ADD COLUMN "apn" varchar(255) NOT NULL;--> statement-breakpoint
ALTER TABLE "owners" ADD CONSTRAINT "owners_apn_properties_apn_fk" FOREIGN KEY ("apn") REFERENCES "public"."properties"("apn") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "owners" DROP COLUMN "name";--> statement-breakpoint
ALTER TABLE "owners" DROP COLUMN "email";--> statement-breakpoint
ALTER TABLE "owners" DROP COLUMN "phone";--> statement-breakpoint
ALTER TABLE "owners" DROP COLUMN "mailing_address";--> statement-breakpoint
ALTER TABLE "owners" DROP COLUMN "type";