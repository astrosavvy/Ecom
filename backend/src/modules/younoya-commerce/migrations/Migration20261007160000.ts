import { Migration } from "@medusajs/framework/mikro-orm/migrations"
export class Migration20261007160000 extends Migration {
  override async up(): Promise<void> {
    for (const [table, columns] of [
      ["commerce_setting", "data jsonb not null, published jsonb null, revision text null"],
      ["commerce_operation", "kind text not null, order_id text not null default '', payload jsonb not null, status text not null default 'queued', result jsonb null, error text null"],
      ["commerce_shipment", "order_id text not null unique, data jsonb not null, status text not null default 'paid', delivered_at timestamptz null"],
      ["commerce_request", "order_id text not null, customer_id text not null, kind text not null, reason text not null, status text not null default 'requested', data jsonb not null"],
    ]) this.addSql(`create table if not exists ${table} (id text primary key, ${columns}, created_at timestamptz not null default now(), updated_at timestamptz not null default now(), deleted_at timestamptz null);`)
    this.addSql("create index if not exists commerce_operation_queue on commerce_operation(status,updated_at);")
    this.addSql("create index if not exists commerce_operation_order on commerce_operation(order_id);")
    this.addSql("create index if not exists commerce_request_customer on commerce_request(customer_id,order_id);")
  }
  override async down(): Promise<void> {
    for (const name of ["commerce_request", "commerce_shipment", "commerce_operation", "commerce_setting"])
      this.addSql(`drop table if exists ${name};`)
  }
}
