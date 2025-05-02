/**
 * Signals API utility
 * Fetches token data from the signals endpoint
 */

export async function fetchSignal(token) {
  const r = await fetch(`/signals/${token}.json`, { cache: 'no-store' });
  if (!r.ok) throw new Error('Signal not found');
  return r.json();
} 