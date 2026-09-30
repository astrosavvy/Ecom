import { Migration } from "@medusajs/framework/mikro-orm/migrations";

export class Migration20260824151154 extends Migration {

  override async up(): Promise<void> {
    this.addSql(`create table if not exists "astro_profile" ("id" text not null, "owner_customer_id" text not null, "full_name" text not null, "relationship" text not null default 'self', "is_self" boolean not null default true, "phone" text null, "dob" text not null, "tob" text null, "pob" text null, "pob_lat" integer null, "pob_lng" integer null, "pob_tz" text not null default 'Asia/Kolkata', "sun_sign" text not null, "moon_sign" text not null, "nakshatra" text null, "nakshatra_index" integer not null default 0, "element" text not null, "ruling_planet" text not null, "chart" jsonb null, "created_at" timestamptz not null default now(), "updated_at" timestamptz not null default now(), "deleted_at" timestamptz null, constraint "astro_profile_pkey" primary key ("id"));`);
    this.addSql(`CREATE INDEX IF NOT EXISTS "IDX_astro_profile_deleted_at" ON "astro_profile" ("deleted_at") WHERE deleted_at IS NULL;`);
  }

  override async down(): Promise<void> {
    this.addSql(`drop table if exists "astro_profile" cascade;`);
  }

}
