
async function check() {
  const imports = [
    'vite',
    'path',
    'fs',
    '@vitejs/plugin-react',
    '@tailwindcss/vite',
    '@aiready/components',
    '@aiready/core'
  ];
  for (const m of imports) {
    console.log('Testing:', m);
    try {
      await import(m);
      console.log('OK:', m);
    } catch (e) {
      console.error('FAILED:', m);
      console.error(e.message);
      if (e.code) console.error(e.code);
    }
  }
}
check();
