import { loadEnv, defineConfig } from '@medusajs/framework/utils'

loadEnv(process.env.NODE_ENV || 'production', process.cwd())

module.exports = defineConfig({
  projectConfig: {
    databaseUrl: process.env.DATABASE_URL || 'postgres://postgres:postgres@localhost:5432/younoya',
    databaseDriverOptions: {
      connection: {
        ssl: false,
      },
    },
    http: {
      storeCors: process.env.STORE_CORS || 'http://localhost:5173,https://younoya.com',
      adminCors: process.env.ADMIN_CORS || 'http://localhost:9000,https://api.younoya.com',
      authCors: process.env.AUTH_CORS || 'http://localhost:5173,https://younoya.com',
      jwtSecret: process.env.JWT_SECRET || 'supersecret_jwt_key_younoya_production_2026',
      cookieSecret: process.env.COOKIE_SECRET || 'supersecret_cookie_key_younoya_production_2026',
    },
  },
  admin: {
    disable: process.env.MEDUSA_ADMIN_ENABLED !== 'true',
  },
  modules: [
    { resolve: "./src/modules/younoya-otp" },
    { resolve: "./src/modules/younoya-blog" },
    { resolve: "./src/modules/younoya-astro" },
    { resolve: "./src/modules/younoya-themes" },
    { resolve: "./src/modules/younoya-toolkits" },
    { resolve: "./src/modules/younoya-recipients" },
    {
      resolve: "@medusajs/medusa/auth",
      options: {
        providers: [
          {
            resolve: "@medusajs/auth-emailpass",
            id: "emailpass",
          },
          {
            resolve: "./src/modules/younoya-mobile-auth",
            id: "younoya-mobile-otp",
          },
        ],
      },
    },    {
      resolve: "@medusajs/medusa/payment",
      options: {
        providers: [
          {
            resolve: "./src/modules/younoya-razorpay",
            id: "razorpay",
            options: {
              key_id: process.env.RAZORPAY_KEY_ID || "rzp_test_TNGgxOeUADZzEF",
              key_secret: process.env.RAZORPAY_KEY_SECRET || "dummy_secret",
            },
          },
        ],
      },
    },
    {
      resolve: "@medusajs/medusa/file",
      options: {
        providers: [
          {
            resolve: "@medusajs/file-local",
            id: "local",
            options: {
              upload_dir: "static",
              backend_url: process.env.MEDUSA_BACKEND_URL || "https://api.younoya.com/static",
            },
          },
        ],
      },
    },
  ],
})
