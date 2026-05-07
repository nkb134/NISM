// Lightweight PostHog client. Posts directly to /capture/ over fetch — no
// posthog-js dependency, ~30 LOC, satisfies the four events the founder
// asked for: signup, test_started, test_completed, topic_drill.
//
// Privacy: distinct_id stored in localStorage only (no cookies), per CLAUDE.md.
// No-ops on the server and when NEXT_PUBLIC_POSTHOG_KEY is not set, so the
// site works fine until the founder adds the key.

const KEY = process.env.NEXT_PUBLIC_POSTHOG_KEY;
const HOST = process.env.NEXT_PUBLIC_POSTHOG_HOST ?? 'https://app.posthog.com';
const DID_KEY = 'ph_did';

function getDistinctId(): string {
  if (typeof window === 'undefined') return '';
  let id = window.localStorage.getItem(DID_KEY);
  if (!id) {
    id = crypto.randomUUID();
    window.localStorage.setItem(DID_KEY, id);
  }
  return id;
}

function send(payload: Record<string, unknown>) {
  if (!KEY || typeof window === 'undefined') return;
  // keepalive lets the request finish even if the page navigates away
  // (important for `test_completed` which fires immediately before redirect).
  void fetch(`${HOST}/capture/`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ api_key: KEY, ...payload }),
    keepalive: true,
  }).catch(() => {
    // Analytics failures are silent.
  });
}

export function track(event: string, properties: Record<string, unknown> = {}) {
  send({
    event,
    distinct_id: getDistinctId(),
    properties: {
      ...properties,
      ...(typeof window !== 'undefined' ? { $current_url: window.location.href } : {}),
    },
    timestamp: new Date().toISOString(),
  });
}

/** Associate the anon distinct_id with a real user id. Idempotent — safe to
 *  call on every page load for a signed-in user. */
export function identify(userId: string, props: Record<string, unknown> = {}) {
  if (!KEY || typeof window === 'undefined') return;
  const anonId = getDistinctId();
  if (anonId === userId) return;
  send({
    event: '$identify',
    distinct_id: userId,
    properties: { $set: props, $anon_distinct_id: anonId },
    timestamp: new Date().toISOString(),
  });
  window.localStorage.setItem(DID_KEY, userId);
}
