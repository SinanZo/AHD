(async () => {
  const url = 'http://localhost:3004/';
  for (let i = 0; i < 30; i++) {
    try {
      const res = await fetch(url);
      console.log('server ready', res.status);
      process.exit(0);
    } catch (e) {
      process.stdout.write('.');
      await new Promise((r) => setTimeout(r, 1000));
    }
  }
  console.error('\nserver did not become ready after 30s');
  process.exit(2);
})();
