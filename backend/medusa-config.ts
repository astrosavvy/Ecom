import { loadEnv, defineConfig } from '@medusajs/framework/utils'
import crypto from 'crypto'

loadEnv(process.env.NODE_ENV || 'production', process.cwd())

function authSecret(name: string) {
  if (process.env[name]) return process.env[name]!
  if (process.env.NODE_ENV === 'production') throw new Error(`${name} must be configured in the private backend environment`)
  return crypto.randomBytes(48).toString('hex')
}

module.exports = defineConfig({
  projectConfig: {
    databaseUrl: process.env.DATABASE_URL || 'postgres://postgres:postgres@localhost:5432/younoya',
    databaseDriverOptions: {
      connection: {
        ssl: false,
      },
    },
    http: {
      storeCors: process.env.STORE_CORS || 'http://localhost:5173,http://127.0.0.1:5173,http://localhost:5175,http://127.0.0.1:5175,https://younoya.com,https://www.younoya.com,https://api.younoya.com',
      adminCors: process.env.ADMIN_CORS || 'http://localhost:5173,http://localhost:9000,https://api.younoya.com,https://younoya.com',
      authCors: process.env.AUTH_CORS || 'http://localhost:5173,http://127.0.0.1:5173,http://localhost:5175,http://127.0.0.1:5175,https://younoya.com,https://www.younoya.com,https://api.younoya.com',
      jwtSecret: authSecret('JWT_SECRET'),
      cookieSecret: authSecret('COOKIE_SECRET'),
    },
  },
  admin: {
    disable: true,
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
        providers: process.env.RAZORPAY_KEY_ID && process.env.RAZORPAY_KEY_SECRET ? [{
            resolve: "./src/modules/younoya-razorpay",
            id: "razorpay",
            options: {
              key_id: process.env.RAZORPAY_KEY_ID,
              key_secret: process.env.RAZORPAY_KEY_SECRET,
            },
          }] : [],
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
