import { Migration } from "@medusajs/framework/mikro-orm/migrations";

export class Migration20260831000001 extends Migration {
  override async up(): Promise<void> {
    this.addSql(`create table if not exists "theme" ("id" text not null, "name" text not null, "slug" text not null, "description" text null, "icon" text not null default '✦', "category" text not null default 'lifestyle', "sort_order" integer not null default 0, "active" boolean not null default true, "created_at" timestamptz not null default now(), "updated_at" timestamptz not null default now(), "deleted_at" timestamptz null, constraint "theme_pkey" primary key ("id"));`);
    this.addSql(`CREATE UNIQUE INDEX IF NOT EXISTS "IDX_theme_slug" ON "theme" ("slug") WHERE deleted_at IS NULL;`);
    this.addSql(`CREATE INDEX IF NOT EXISTS "IDX_theme_deleted_at" ON "theme" ("deleted_at") WHERE deleted_at IS NULL;`);

    this.addSql(`create table if not exists "product_theme" ("id" text not null, "product_id" text not null, "theme_id" text not null, "priority" text not null default 'medium', "created_at" timestamptz not null default now(), "updated_at" timestamptz not null default now(), "deleted_at" timestamptz null, constraint "product_theme_pkey" primary key ("id"));`);
    this.addSql(`CREATE INDEX IF NOT EXISTS "IDX_product_theme_product" ON "product_theme" ("product_id") WHERE deleted_at IS NULL;`);
    this.addSql(`CREATE INDEX IF NOT EXISTS "IDX_product_theme_theme" ON "product_theme" ("theme_id") WHERE deleted_at IS NULL;`);
    this.addSql(`CREATE INDEX IF NOT EXISTS "IDX_product_theme_deleted_at" ON "product_theme" ("deleted_at") WHERE deleted_at IS NULL;`);

    this.addSql(`create table if not exists "product_metadata" ("id" text not null, "product_id" text not null, "editorial_story" text null, "symbolic_significance" text null, "materials" text null, "dimensions" text null, "care_instructions" text null, "suitable_for" jsonb null, "symbolic_associations" jsonb null, "seo_title" text null, "meta_description" text null, "clean_url" text null, "created_at" timestamptz not null default now(), "updated_at" timestamptz not null default now(), "deleted_at" timestamptz null, constraint "product_metadata_pkey" primary key ("id"));`);
    this.addSql(`CREATE UNIQUE INDEX IF NOT EXISTS "IDX_product_metadata_product" ON "product_metadata" ("product_id") WHERE deleted_at IS NULL;`);
    this.addSql(`CREATE INDEX IF NOT EXISTS "IDX_product_metadata_deleted_at" ON "product_metadata" ("deleted_at") WHERE deleted_at IS NULL;`);
  }

  override async down(): Promise<void> {
    this.addSql(`drop table if exists "product_metadata" cascade;`);
    this.addSql(`drop table if exists "product_theme" cascade;`);
    this.addSql(`drop table if exists "theme" cascade;`);
  }
}
