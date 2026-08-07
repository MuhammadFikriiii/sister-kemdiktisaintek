export default async function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).json({ message: 'Method not allowed' });
  }

  try {
    let body = req.body;
    if (typeof body === 'string') {
      body = JSON.parse(body);
    }
    const { username, password } = body || {};

    if (!username || !password) {
      return res.status(400).json({ message: 'Harap isi username dan password.' });
    }

    // 1. Verifikasi kredensial custom di server side
    const customUsersStr = process.env.CUSTOM_USERS || process.env.VITE_CUSTOM_USERS;
    let isMatch = false;

    if (customUsersStr) {
      try {
        const customUsers = JSON.parse(customUsersStr);
        const matchedUser = customUsers.find(
          u => u.username === username && u.password === password
        );
        if (matchedUser) {
          isMatch = true;
        }
      } catch (e) {
        console.error("Gagal parsing CUSTOM_USERS", e);
      }
    }

    if (!isMatch) {
      return res.status(401).json({ message: 'Username atau password salah.' });
    }

    // 2. Gunakan kredensial SISTER rahasia dari environment server side
    const sisterUsername = process.env.SISTER_USERNAME || process.env.VITE_SISTER_USERNAME;
    const sisterPassword = process.env.SISTER_PASSWORD || process.env.VITE_SISTER_PASSWORD;
    const sisterIdPengguna = process.env.SISTER_ID_PENGGUNA || process.env.VITE_SISTER_ID_PENGGUNA;

    const sisterRes = await fetch('https://sister-api.kemdiktisaintek.go.id/ws.php/1.0/authorize', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        username: sisterUsername,
        password: sisterPassword,
        id_pengguna: sisterIdPengguna,
      }),
    });

    const data = await sisterRes.json();

    if (!sisterRes.ok) {
      return res.status(sisterRes.status).json(data);
    }

    return res.status(200).json(data);
  } catch (error) {
    console.error("Serverless auth error:", error);
    return res.status(500).json({ message: error.message || 'Gagal memproses autentikasi server.' });
  }
}
