import { loadEnv, defineConfig } from '@medusajs/framework/utils'

loadEnv(process.env.NODE_ENV || 'development', process.cwd())

module.exports = defineConfig({
  projectConfig: {
    databaseUrl: process.env.DATABASE_URL || 'postgres://postgres:postgres@localhost:5432/younoya',
    redisUrl: process.env.REDIS_URL || 'redis://localhost:6379',
    http: {
      storeCors: process.env.STORE_CORS || 'http://localhost:8000',
      adminCors: process.env.ADMIN_CORS || 'http://localhost:9000',
      authCors: process.env.AUTH_CORS || 'http://localhost:8000,http://localhost:9000',
      jwtSecret: process.env.JWT_SECRET || 'supersecret_jwt_key_younoya',
      cookieSecret: process.env.COOKIE_SECRET || 'supersecret_cookie_key_younoya',
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
              key_id: process.env.RAZORPAY_KEY_ID,
              key_secret: process.env.RAZORPAY_KEY_SECRET,
            },
          },
        ],
      },
    },
  ],
})
