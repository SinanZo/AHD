export async function sendErrorReport(payload) {
  const _base = import.meta.env.VITE_APP_BASE_URL || window.location.origin;

  // 1) Try POST /api/logs (implement server route when ready)
  try {
    const res = await fetch('/api/logs', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ type: 'client_error', ...payload }),
    });
    if (res.ok) {
      return await res.json(); // { ok: true, ticketId: 'AD-XXXXXX' } if your server returns it
    }
  } catch {
    /* ignore and fallback */
  }

  // 2) Fallback: open a mailto with a compact body (user can send manually)
  try {
    const subject = encodeURIComponent('Abdulhaq Dimensions — Client Error Report');
    const compact = [
      `URL: ${payload.url}`,
      `Message: ${payload.message}`,
      `Name: ${payload.name}`,
      `AppReady: ${payload.appReady}`,
      `UserAgent: ${payload.userAgent}`,
      `Time: ${payload.time}`,
      '',
      'Stack:',
      (payload.stack || '').split('\n').slice(0, 12).join('\n'),
      '',
      'Component stack:',
      (payload.componentStack || '').split('\n').slice(0, 12).join('\n'),
    ].join('\n');

    const body = encodeURIComponent(compact);
    const to = 'info@abdulhaqdimensions.com';
    const href = `mailto:${to}?subject=${subject}&body=${body}`;
    window.open(href, '_blank', 'noopener,noreferrer');
  } catch {
    /* ignore */
  }

  return { ok: false };
}
