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
        const suzi = r.data.find(x => x.nama_sdm.toLowerCase().includes('suzi'));
        console.log('Suzi ID:', suzi?.id_sdm);
        
        if (suzi) {
            const endpoints = [
                '/data_pribadi/profil/',
                '/data_pribadi/kependudukan/',
                '/data_pribadi/keluarga/',
                '/data_pribadi/alamat/',
                '/data_pribadi/kepegawaian/',
                '/data_pribadi/lain/',
                '/data_pribadi/bidang_ilmu/',
                '/pendidikan_formal?id_sdm=',
                '/penempatan?id_sdm='
            ];
            
            for (const ep of endpoints) {
                try {
                    const res = await axios.get('https://sister-api.kemdiktisaintek.go.id/ws.php/1.0' + ep + suzi.id_sdm, { headers: { Authorization: 'Bearer ' + t } });
                    const jsonStr = JSON.stringify(res.data).toLowerCase();
                    if (jsonStr.includes('manajemen') || jsonStr.includes('terapan')) {
                        console.log('FOUND IN:', ep);
                        console.log(JSON.stringify(res.data, null, 2));
                    }
                } catch(e) {}
            }
        }
    } catch(e) {
        console.error(e.message);
    }
};
run();
