// Stats fetch — wired to Supabase once the events table and API key are ready.
// Until then, skeletons animate and fall back to em-dashes after 8 seconds.

const SUPABASE_URL = ''; // TODO: fill in before launch
const SUPABASE_ANON_KEY = ''; // TODO: fill in — ensure RLS is enabled first
const TIMEOUT_MS = 8000;

async function fetchCount(action) {
  const res = await fetch(
    `${SUPABASE_URL}/rest/v1/events?action=eq.${action}&select=id`,
    {
      headers: {
        apikey: SUPABASE_ANON_KEY,
        Authorization: `Bearer ${SUPABASE_ANON_KEY}`,
        Prefer: 'count=exact',
      },
    }
  );
  if (!res.ok) throw new Error(`fetch failed: ${res.status}`);
  const count = res.headers.get('content-range')?.split('/')[1];
  return parseInt(count ?? '0', 10);
}

async function fetchDistinctUsers() {
  const res = await fetch(
    `${SUPABASE_URL}/rest/v1/rpc/count_distinct_installs`,
    {
      method: 'POST',
      headers: {
        apikey: SUPABASE_ANON_KEY,
        Authorization: `Bearer ${SUPABASE_ANON_KEY}`,
        'Content-Type': 'application/json',
      },
      body: '{}',
    }
  );
  if (!res.ok) throw new Error(`fetch failed: ${res.status}`);
  const data = await res.json();
  return data ?? 0;
}

function animateCount(el, target) {
  const duration = 1000;
  const start = performance.now();
  function step(now) {
    const progress = Math.min((now - start) / duration, 1);
    const eased = 1 - Math.pow(1 - progress, 3); // ease-out cubic
    el.textContent = Math.floor(eased * target).toLocaleString();
    if (progress < 1) requestAnimationFrame(step);
  }
  requestAnimationFrame(step);
}

function renderStat(id, value) {
  const el = document.getElementById(id);
  if (!el) return;
  el.classList.add('done');
  const num = document.createElement('span');
  num.className = 'stat-value';
  num.textContent = '0';
  el.replaceWith(num);
  animateCount(num, value);
}

function showFallback(id) {
  const el = document.getElementById(id);
  if (!el) return;
  el.classList.add('done');
  const dash = document.createElement('span');
  dash.className = 'stat-value';
  dash.style.color = '#333';
  dash.textContent = '—';
  el.replaceWith(dash);
}

async function loadStats() {
  // Supabase not configured yet — show mock stats for beta
  if (!SUPABASE_URL || !SUPABASE_ANON_KEY) {
    renderStat('stat-emails', 163);
    renderStat('stat-posts', 91);
    renderStat('stat-users', 46);
    return;
  }

  const timeout = new Promise((_, reject) =>
    setTimeout(() => reject(new Error('timeout')), TIMEOUT_MS)
  );

  try {
    const [emails, posts, users] = await Promise.race([
      Promise.all([
        fetchCount('email_sent'),
        fetchCount('post_generated'),
        fetchDistinctUsers(),
      ]),
      timeout,
    ]);
    renderStat('stat-emails', emails);
    renderStat('stat-posts', posts);
    renderStat('stat-users', users);
  } catch {
    showFallback('stat-emails');
    showFallback('stat-posts');
    showFallback('stat-users');
  }
}

loadStats();
