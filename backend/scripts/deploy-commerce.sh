#!/usr/bin/env bash
set -euo pipefail
root=/home/ubuntu/younoya/backend
archive=/tmp/younoya-commerce-release-20261007.tar.gz
backup=/tmp/younoya-commerce-rollback-$(date +%Y%m%d%H%M%S).tar.gz
test "$(readlink -f "$root")" = /home/ubuntu/younoya/backend
test -d "$root/.medusa/server"
test -s "$archive"
for required in .medusa/server/medusa-config.js .medusa/server/src/modules/younoya-commerce/db.js .medusa/server/src/modules/younoya-commerce/completion.js .medusa/server/src/modules/younoya-commerce/migrations/Migration20261007160000.js .medusa/server/src/modules/younoya-shiprocket/index.js; do
  tar -tzf "$archive" "$required" >/dev/null
done
cd "$root"
old_list=$(mktemp /tmp/younoya-commerce-old.XXXXXX)
new_list=$(mktemp /tmp/younoya-commerce-new.XXXXXX)
while IFS= read -r entry; do
  case "$entry" in
    src/modules/younoya-commerce/*|src/modules/younoya-shiprocket/*|src/modules/younoya-razorpay/*|src/api/admin/commerce/*|src/api/store/account/*|src/api/store/commerce/*|src/api/store/site-config/*|src/api/hooks/younoya-razorpay/*|src/api/store/gift-guide/payment-confirm/*|src/api/store/gift-guide/checkout-config/*|src/api/utils/commerce.ts|src/api/utils/commerce-guards.ts|src/api/utils/roles.ts|src/api/middlewares.ts|src/jobs/commerce.ts|src/subscribers/order-placed.ts|src/scripts/configure-checkout.ts|.medusa/server/src/modules/younoya-commerce/*|.medusa/server/src/modules/younoya-shiprocket/*|.medusa/server/src/modules/younoya-razorpay/*|.medusa/server/src/api/admin/commerce/*|.medusa/server/src/api/store/account/*|.medusa/server/src/api/store/commerce/*|.medusa/server/src/api/store/site-config/*|.medusa/server/src/api/hooks/younoya-razorpay/*|.medusa/server/src/api/store/gift-guide/payment-confirm/*|.medusa/server/src/api/store/gift-guide/checkout-config/*|.medusa/server/src/api/utils/commerce.*|.medusa/server/src/api/utils/commerce-guards.*|.medusa/server/src/api/utils/roles.*|.medusa/server/src/api/middlewares.*|.medusa/server/src/jobs/commerce.*|.medusa/server/src/subscribers/order-placed.*|.medusa/server/src/scripts/configure-checkout.*|.medusa/server/medusa-config.js|.medusa/server/medusa-config.js.map|medusa-config.ts|package.json|package-lock.json|.medusa/server/package.json|COMMERCE_LAUNCH.md|commerce.env.example|scripts/test-commerce-postgres.cjs|scripts/deploy-commerce.sh) ;;
    src/subscribers/customer-created.ts|.medusa/server/src/subscribers/customer-created.js) ;;
    *) echo 'Unexpected commerce archive entry';exit 1 ;;
  esac
  case "$entry" in *../*|/*) echo 'Unsafe archive path';exit 1;; esac
  if test -f "$entry"; then printf '%s\n' "$entry" >> "$old_list"; elif ! test -d "$entry" && [[ "$entry" != */ ]]; then printf '%s\n' "$entry" >> "$new_list"; fi
done < <(tar -tzf "$archive")
tar -czf "$backup" --files-from="$old_list"
rollback() {
  echo 'Restoring previous code. Additive database tables remain compatible.'
  cd "$root"
  while IFS= read -r entry; do rm -f -- "$root/$entry"; done < "$new_list"
  tar -xzf "$backup" -C "$root"
  pm2 restart younoya-backend >/dev/null
}
trap rollback ERR
tar -xzf "$archive" -C "$root"
cd "$root/.medusa/server"
node <<'NODE'
require('@medusajs/framework/utils').loadEnv('production',process.cwd())
if (!process.env.JWT_SECRET || !process.env.COOKIE_SECRET) throw new Error('Private auth secrets must already be configured')
if (process.env.COMMERCE_LIVE_ENABLED === 'true') throw new Error('New commerce activation must remain disabled for this rollout')
require('pg')
process.env.NODE_ENV='production'
const result=require('child_process').spawnSync(process.execPath,[require.resolve('@medusajs/cli/cli.js'),'db:migrate','--skip-links'],{env:process.env,stdio:'inherit'})
if (result.status!==0) process.exit(result.status||1)
NODE
pm2 restart younoya-backend
for attempt in $(seq 1 90); do
  if curl --fail --silent http://127.0.0.1:9000/health >/dev/null; then
    trap - ERR
    echo "Backend health passed; activation remains disabled. Code backup: $backup"
    exit 0
  fi
  sleep 1
done
exit 1
