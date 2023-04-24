export const WEB_SITE_URL =
  process.env.NODE_ENV === 'production'
    ? process.env.WEB_SITE_URL
    : 'http://localhost:3001';
