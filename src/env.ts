export default {
  LIFF_ID: process.env.NEXT_PUBLIC_LIFF_ID,
  PB_HOST: process.env.NEXT_PUBLIC_PB_HOST || "http://127.0.0.1:8090",
  PB_ADMIN_EMAIL: process.env.NEXT_PUBLIC_PB_ADMIN_EMAIL || "a@a.com",
  PB_ADMIN_PASSWORD: process.env.NEXT_PUBLIC_PB_ADMIN_PASSWORD || "password123",
  PB_USER_DEFAULT_PASSWORD:
    process.env.NEXT_PUBLIC_PB_USER_DEFAULT_PASSWORD || "password123",
}
