import type { VercelRequest, VercelResponse } from '@vercel/node';
import { createClient } from '@supabase/supabase-js';
import { ALLOWED_SITES } from '../lib/allowed-sites';

const ALLOWED_ACTIONS = new Set(['email_draft_opened', 'post_generated']);

const supabase = createClient(
  process.env.SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!
);

export default async function handler(req: VercelRequest, res: VercelResponse) {
  // CORS — required because requests come from a Chrome extension service worker
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'POST, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');

  // Handle preflight
  if (req.method === 'OPTIONS') {
    return res.status(204).end();
  }

  if (req.method !== 'POST') {
    return res.status(405).json({ ok: false, error: 'Method not allowed' });
  }

  const { installId, action, site } = req.body ?? {};

  if (!installId || typeof installId !== 'string') {
    return res.status(400).json({ ok: false, error: 'Missing installId' });
  }
  if (!ALLOWED_ACTIONS.has(action)) {
    return res.status(400).json({ ok: false, error: 'Invalid action' });
  }
  if (!ALLOWED_SITES.has(site)) {
    return res.status(400).json({ ok: false, error: 'Unknown site' });
  }

  const { error } = await supabase.from('events').insert({
    install_id: installId,
    action,
    site,
  });

  if (error) {
    console.error('Supabase insert error:', error);
    return res.status(500).json({ ok: false, error: 'Database error' });
  }

  return res.status(200).json({ ok: true });
}
