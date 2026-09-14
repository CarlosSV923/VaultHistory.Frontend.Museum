import nextEnv from '@next/env';

const { loadEnvConfig } = nextEnv;

loadEnvConfig(process.cwd());

const requiredUrls = ['USER_API_URL', 'HISTORY_API_URL'];
const missing = requiredUrls.filter((name) => !process.env[name]);
const invalidUrls = requiredUrls.filter((name) => {
  const value = process.env[name];
  if (!value) return false;
  try { new URL(value); return false; } catch { return true; }
});

if (!process.env.HISTORY_FRONTEND_TOKEN) missing.push('HISTORY_FRONTEND_TOKEN');

if (missing.length || invalidUrls.length) {
  const errors = [
    ...(missing.length ? [`Missing required variables: ${missing.join(', ')}.`] : []),
    ...(invalidUrls.length ? [`Variables must be absolute URLs: ${invalidUrls.join(', ')}.`] : []),
  ];
  console.error(errors.join(' '));
  process.exit(1);
}

console.log('Environment configuration is valid.');
