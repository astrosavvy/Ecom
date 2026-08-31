import { Migration } from "@medusajs/framework/mikro-orm/migrations";

export class Migration20260831000002 extends Migration {
  override async up(): Promise<void> {
    this.addSql(`create table if not exists "toolkit" ("id" text not null, "customer_id" text not null, "recipient_profile_id" text null, "type" text not null default 'general', "status" text not null default 'generated', "recipient_name" text null, "recipient_relationship" text null, "intents" jsonb null, "occasion" text null, "gift_message" text null, "personalised_explanation" text null, "astro_snapshot" jsonb null, "created_at" timestamptz not null default now(), "updated_at" timestamptz not null default now(), "deleted_at" timestamptz null, constraint "toolkit_pkey" primary key ("id"));`);
    this.addSql(`CREATE INDEX IF NOT EXISTS "IDX_toolkit_customer" ON "toolkit" ("customer_id") WHERE deleted_at IS NULL;`);
    this.addSql(`CREATE INDEX IF NOT EXISTS "IDX_toolkit_deleted_at" ON "toolkit" ("deleted_at") WHERE deleted_at IS NULL;`);

    this.addSql(`create table if not exists "toolkit_item" ("id" text not null, "toolkit_id" text not null, "product_id" text not null, "product_handle" text null, "product_title" text null, "role" text not null default 'supporting', "selection_rationale" text null, "score" integer not null default 0, "display_order" integer not null default 0, "created_at" timestamptz not null default now(), "updated_at" timestamptz not null default now(), "deleted_at" timestamptz null, constraint "toolkit_item_pkey" primary key ("id"));`);
    this.addSql(`CREATE INDEX IF NOT EXISTS "IDX_toolkit_item_toolkit" ON "toolkit_item" ("toolkit_id") WHERE deleted_at IS NULL;`);
    this.addSql(`CREATE INDEX IF NOT EXISTS "IDX_toolkit_item_deleted_at" ON "toolkit_item" ("deleted_at") WHERE deleted_at IS NULL;`);

    this.addSql(`create table if not exists "recommendation_rule" ("id" text not null, "name" text not null, "description" text null, "priority" integer not null default 0, "active" boolean not null default true, "conditions" jsonb not null, "actions" jsonb not null, "version" integer not null default 1, "created_at" timestamptz not null default now(), "updated_at" timestamptz not null default now(), "deleted_at" timestamptz null, constraint "recommendation_rule_pkey" primary key ("id"));`);
    this.addSql(`CREATE INDEX IF NOT EXISTS "IDX_recommendation_rule_deleted_at" ON "recommendation_rule" ("deleted_at") WHERE deleted_at IS NULL;`);
  }

  override async down(): Promise<void> {
    this.addSql(`drop table if exists "recommendation_rule" cascade;`);
    this.addSql(`drop table if exists "toolkit_item" cascade;`);
    this.addSql(`drop table if exists "toolkit" cascade;`);
  }
}
