import { Migration } from "@medusajs/framework/mikro-orm/migrations";

export class Migration20261007120136 extends Migration {

  override async up(): Promise<void> {
    this.addSql(`alter table if exists "otp_challenge" add column if not exists "channel" text check ("channel" in ('email', 'whatsapp', 'sms')) not null default 'email', add column if not exists "delivery_status" text check ("delivery_status" in ('queued', 'accepted', 'failed')) not null default 'accepted', add column if not exists "provider_message_id" text null;`);
  }

  override async down(): Promise<void> {
    this.addSql(`alter table if exists "otp_challenge" drop column if exists "channel", drop column if exists "delivery_status", drop column if exists "provider_message_id";`);
  }

}
