ALTER TABLE "owners" DROP CONSTRAINT "owners_property_id_properties_id_fk";
--> statement-breakpoint
ALTER TABLE "owners" DROP CONSTRAINT "owners_apn_properties_apn_fk";
--> statement-breakpoint
ALTER TABLE "owners" DROP COLUMN "property_id";