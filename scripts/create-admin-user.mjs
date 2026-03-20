/**
 * Create an admin user in Supabase Auth and set role in profiles.
 * Uses SUPABASE_SERVICE_ROLE_KEY and NEXT_PUBLIC_SUPABASE_URL from .env.local.
 *
 * Run from project root:
 *   node --env-file=.env.local scripts/create-admin-user.mjs "deborahaboni8@gmail.com" "12345Block$"
 *
 * Or (Node < 20): set env vars first, then
 *   node scripts/create-admin-user.mjs "deborahaboni8@gmail.com" "12345Block$"
 */

import { createClient } from '@supabase/supabase-js';
import { readFileSync } from 'fs';
import { fileURLToPath } from 'url';
import { dirname, join } from 'path';

const __dirname = dirname(fileURLToPath(import.meta.url));
const rootDir = join(__dirname, '..');

function loadEnvLocal() {
  const paths = [join(process.cwd(), '.env.local'), join(rootDir, '.env.local')];
  for (const envPath of paths) {
    try {
      const content = readFileSync(envPath, 'utf-8');
      for (const line of content.split(/\r?\n/)) {
        const trimmed = line.trim();
        if (!trimmed || trimmed.startsWith('#')) continue;
        const eq = trimmed.indexOf('=');
        if (eq <= 0) continue;
        const key = trimmed.slice(0, eq).trim();
        let value = trimmed.slice(eq + 1).trim();
        if ((value.startsWith('"') && value.endsWith('"')) || (value.startsWith("'") && value.endsWith("'"))) {
          value = value.slice(1, -1);
        }
        process.env[key] = value;
      }
      return;
    } catch (_) {
      continue;
    }
  }
}

loadEnvLocal();

const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
const serviceKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

if (!url || !serviceKey) {
  console.error('Missing NEXT_PUBLIC_SUPABASE_URL or SUPABASE_SERVICE_ROLE_KEY. Set in .env.local or env.');
  process.exit(1);
}

const email = process.argv[2];
const password = process.argv[3];

if (!email || !password) {
  console.error('Usage: node scripts/create-admin-user.mjs <email> <password>');
  process.exit(1);
}

const supabase = createClient(url, serviceKey, { auth: { autoRefreshToken: false, persistSession: false } });

async function main() {
  console.log('Creating user:', email);

  const { data: user, error: createError } = await supabase.auth.admin.createUser({
    email,
    password,
    email_confirm: true,
  });

  if (createError) {
    if (createError.message.includes('already been registered')) {
      console.log('User already exists. Updating profile to admin...');
      const { data: { users } } = await supabase.auth.admin.listUsers();
      const existing = users?.find((u) => u.email === email);
      if (!existing) {
        console.error('Could not find existing user.');
        process.exit(1);
      }
      const { error: updateError } = await supabase.from('profiles').update({ role: 'admin' }).eq('id', existing.id);
      if (updateError) {
        console.error('Failed to set admin role:', updateError.message);
        process.exit(1);
      }
      console.log('Profile updated to admin. User can log in at /admin/login');
      return;
    }
    console.error('Create user failed:', createError.message);
    process.exit(1);
  }

  const userId = user.user?.id;
  if (!userId) {
    console.error('No user id returned');
    process.exit(1);
  }

  const { error: updateError } = await supabase.from('profiles').update({ role: 'admin' }).eq('id', userId);
  if (updateError) {
    console.error('User created but failed to set admin role:', updateError.message);
    process.exit(1);
  }

  console.log('Admin user created. They can log in at /admin/login');
}

main();
