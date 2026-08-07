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
        
        const endpoints = [
            '/data_pribadi/profil/',
            '/data_pribadi/kependudukan/',
            '/data_pribadi/keluarga/',
            '/data_pribadi/alamat/',
            '/data_pribadi/kepegawaian/',
            '/data_pribadi/lain/',
            '/data_pribadi/bidang_ilmu/'
        ];
        
        let found = false;
        for (const ep of endpoints) {
            try {
                const res = await axios.get('https://sister-api.kemdiktisaintek.go.id/ws.php/1.0' + ep + asruni_id, { headers: { Authorization: 'Bearer ' + t } });
                const jsonStr = JSON.stringify(res.data).toLowerCase();
                if (jsonStr.includes('manajemen') || jsonStr.includes('terapan')) {
                    console.log('FOUND IN:', ep);
                    console.log(JSON.stringify(res.data, null, 2));
                    found = true;
                }
            } catch(e) {}
        }
        
        if (!found) {
            console.log("NOT FOUND in any data_pribadi endpoints.");
        }
    } catch(e) {
        console.error(e.message);
    }
};
run();
