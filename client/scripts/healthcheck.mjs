(async () => {
  try {
    const res = await fetch('http://localhost:3004/', { method: 'GET' });
    console.log('status', res.status);
    const text = await res.text();
    console.log(text.slice(0, 400));
  } catch (e) {
    console.error('fetch error', e.message || e);
    process.exitCode = 2;
  }
})();
