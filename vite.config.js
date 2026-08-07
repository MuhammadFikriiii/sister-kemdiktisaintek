import { defineConfig, loadEnv } from 'vite'
import react from '@vitejs/plugin-react'

// https://vite.dev/config/
export default defineConfig(({ mode }) => {
  const env = loadEnv(mode, process.cwd(), '');

  return {
    plugins: [
      react(),
      {
        name: 'custom-login-middleware',
        configureServer(server) {
          server.middlewares.use('/api/login', (req, res, next) => {
            if (req.method !== 'POST') return next();

            let body = '';
            req.on('data', chunk => { body += chunk; });
            req.on('end', async () => {
              try {
                const { username, password } = JSON.parse(body || '{}');
                const customUsersStr = env.CUSTOM_USERS || env.VITE_CUSTOM_USERS;
                let isMatch = false;

                if (customUsersStr) {
                  const customUsers = JSON.parse(customUsersStr);
                  isMatch = customUsers.some(u => u.username === username && u.password === password);
                }

                if (!isMatch) {
                  res.statusCode = 401;
                  res.setHeader('Content-Type', 'application/json');
                  return res.end(JSON.stringify({ message: 'Username atau password salah.' }));
                }

                const sisterUsername = env.SISTER_USERNAME || env.VITE_SISTER_USERNAME;
                const sisterPassword = env.SISTER_PASSWORD || env.VITE_SISTER_PASSWORD;
                const sisterIdPengguna = env.SISTER_ID_PENGGUNA || env.VITE_SISTER_ID_PENGGUNA;

                const sisterRes = await fetch('https://sister-api.kemdiktisaintek.go.id/ws.php/1.0/authorize', {
                  method: 'POST',
                  headers: { 'Content-Type': 'application/json' },
                  body: JSON.stringify({
                    username: sisterUsername,
                    password: sisterPassword,
                    id_pengguna: sisterIdPengguna
                  })
                });

                const data = await sisterRes.json();
                res.statusCode = sisterRes.status;
                res.setHeader('Content-Type', 'application/json');
                res.end(JSON.stringify(data));
              } catch (err) {
                res.statusCode = 500;
                res.setHeader('Content-Type', 'application/json');
                res.end(JSON.stringify({ message: err.message || 'Gagal login lokal.' }));
              }
            });
          });
        }
      }
    ],
    server: {
      proxy: {
        '/api': {
          target: 'https://sister-api.kemdiktisaintek.go.id/ws.php/1.0',
          changeOrigin: true,
          rewrite: (path) => path.replace(/^\/api/, ''),
        },
      },
    },
  };
});

