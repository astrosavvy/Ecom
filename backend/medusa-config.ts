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
      storeCors: process.env.STORE_CORS || 'https://younoya.com,http://localhost:3000',
      adminCors: process.env.ADMIN_CORS || 'https://younoya.com,http://localhost:3000,http://localhost:9000',
      authCors: process.env.AUTH_CORS || 'https://younoya.com,http://localhost:3000,http://localhost:9000',
      jwtSecret: process.env.JWT_SECRET || 'supersecret_jwt_key_younoya_production_2026',
      cookieSecret: process.env.COOKIE_SECRET || 'supersecret_cookie_key_younoya_production_2026',
    },
  },
  admin: {
    disable: true,
  },
  modules: [
    { resolve: "./src/modules/younoya-otp" },
    { resolve: "./src/modules/younoya-blog" },
    {
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
  ],
})
