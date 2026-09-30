import { Migration } from "@medusajs/framework/mikro-orm/migrations";

export class Migration20260824151140 extends Migration {

  override async up(): Promise<void> {
    this.addSql(`create table if not exists "otp_challenge" ("id" text not null, "identifier" text not null, "identifier_type" text check ("identifier_type" in ('mobile', 'email')) not null default 'mobile', "otp_hash" text not null, "salt" text not null, "attempts" integer not null default 0, "max_attempts" integer not null default 5, "expires_at" timestamptz not null, "consumed_at" timestamptz null, "ip_address" text null, "status" text check ("status" in ('pending', 'verified', 'expired', 'rate_limited')) not null default 'pending', "created_at" timestamptz not null default now(), "updated_at" timestamptz not null default now(), "deleted_at" timestamptz null, constraint "otp_challenge_pkey" primary key ("id"));`);
    this.addSql(`CREATE INDEX IF NOT EXISTS "IDX_otp_challenge_deleted_at" ON "otp_challenge" ("deleted_at") WHERE deleted_at IS NULL;`);

    this.addSql(`create table if not exists "otp_rate_limit" ("id" text not null, "identifier" text not null, "identifier_type" text not null, "request_count" integer not null default 1, "window_start" timestamptz not null, "window_minutes" integer not null default 60, "created_at" timestamptz not null default now(), "updated_at" timestamptz not null default now(), "deleted_at" timestamptz null, constraint "otp_rate_limit_pkey" primary key ("id"));`);
    this.addSql(`CREATE INDEX IF NOT EXISTS "IDX_otp_rate_limit_deleted_at" ON "otp_rate_limit" ("deleted_at") WHERE deleted_at IS NULL;`);
  }

  override async down(): Promise<void> {
    this.addSql(`drop table if exists "otp_challenge" cascade;`);

    this.addSql(`drop table if exists "otp_rate_limit" cascade;`);
  }

}
