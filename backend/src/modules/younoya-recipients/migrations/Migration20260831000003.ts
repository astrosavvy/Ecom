import { Migration } from "@medusajs/framework/mikro-orm/migrations";

export class Migration20260831000003 extends Migration {
  override async up(): Promise<void> {
    this.addSql(`create table if not exists "gift_recipient" ("id" text not null, "customer_id" text not null, "name" text not null, "relationship" text not null default 'friend', "dob" text null, "birth_time" text null, "birth_place" text null, "birth_time_unknown" boolean not null default false, "saved_preferences" jsonb null, "astrological_profile" jsonb null, "notes" text null, "created_at" timestamptz not null default now(), "updated_at" timestamptz not null default now(), "deleted_at" timestamptz null, constraint "gift_recipient_pkey" primary key ("id"));`);
    this.addSql(`CREATE INDEX IF NOT EXISTS "IDX_gift_recipient_customer" ON "gift_recipient" ("customer_id") WHERE deleted_at IS NULL;`);
    this.addSql(`CREATE INDEX IF NOT EXISTS "IDX_gift_recipient_deleted_at" ON "gift_recipient" ("deleted_at") WHERE deleted_at IS NULL;`);
  }

  override async down(): Promise<void> {
    this.addSql(`drop table if exists "gift_recipient" cascade;`);
  }
}
