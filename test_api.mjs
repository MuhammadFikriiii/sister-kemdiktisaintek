import axios from 'axios';
import fs from 'fs';

const login = async () => {
    const r = await axios.post('https://sister-api.kemdiktisaintek.go.id/ws-sandbox.php/1.0/authorize', {
        username: process.env.VITE_SISTER_USERNAME, 
        password: process.env.VITE_SISTER_PASSWORD, 
        id_pengguna: process.env.VITE_SISTER_ID_PENGGUNA
    });
    return r.data.token;
};

const run = async () => {
    try {
        const t = await login();
        const r = await axios.get('https://sister-api.kemdiktisaintek.go.id/ws-sandbox.php/1.0/referensi/kelompok_bidang', {
            headers: { Authorization: 'Bearer ' + t }
        });
        fs.writeFileSync('bidang.json', JSON.stringify(r.data, null, 2));
        console.log('Done, wrote ' + r.data.length + ' items');
    } catch(e) {
        console.error(e.response ? e.response.data : e.message);
    }
};

run();

