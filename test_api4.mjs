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
        const r = await axios.get('https://sister-api.kemdiktisaintek.go.id/ws.php/1.0/referensi/sdm', {
            headers: { Authorization: 'Bearer ' + t }
        });
        const asruni = r.data.find(x => x.nama_sdm.toLowerCase().includes('asruni'));
        console.log('Asruni ID:', asruni?.id_sdm);
        
        if (asruni) {
            const bidang_ilmu = await axios.get('https://sister-api.kemdiktisaintek.go.id/ws.php/1.0/data_pribadi/bidang_ilmu/' + asruni.id_sdm, { headers: { Authorization: 'Bearer ' + t } });
            console.log('Bidang Ilmu:', JSON.stringify(bidang_ilmu.data, null, 2));
        }
    } catch(e) {
        console.error(e.response ? e.response.data : e.message);
    }
};
run();
