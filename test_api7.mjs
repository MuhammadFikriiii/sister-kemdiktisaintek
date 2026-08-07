import axios from 'axios';
const login = async () => {
    const r = await axios.post('https://sister-api.kemdiktisaintek.go.id/ws.php/1.0/authorize', {
        username: process.env.VITE_SISTER_USERNAME, 
        password: process.env.VITE_SISTER_PASSWORD, 
        id_pengguna: process.env.VITE_SISTER_ID_PENGGUNA
    });
    return r.data.token;
};

const run = async () => {
    try {
        const t = await login();
        const asruni_id = '289a2348-34ed-41fd-81a2-3e2d6338d795';
        const res = await axios.get('https://sister-api.kemdiktisaintek.go.id/ws.php/1.0/pendidikan_formal?id_sdm=' + asruni_id, { headers: { Authorization: 'Bearer ' + t } });
        console.log(JSON.stringify(res.data, null, 2));
    } catch(e) {
        console.error(e.message);
    }
};
run();
