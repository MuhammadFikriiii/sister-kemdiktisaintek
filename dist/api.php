<?php
// ============================================================
// KONFIGURASI BACKEND - Semua rahasia hanya ada di sini
// ============================================================

// Daftar user yang boleh login ke aplikasi ini
$CUSTOM_USERS = [
    ['username' => 'admin',  'password' => 'Stiepan7#'],
    ['username' => 'admin2', 'password' => 'Stiepan7#'],
    ['username' => 'admin3', 'password' => 'Stiepan7#'],
];

// Kredensial SISTER resmi (tidak pernah dikirim ke browser)
$SISTER_USERNAME    = 'rnlZm4mR7XZGmabDZiWaj9nTS3s5gV0s1kK6vW1/gMHX/aoTETxyae8UL8TNf37cFbe1MMuEsbJ9FP2nNaCevJw1fSx0/V2eKZ+34qHDmgM=';
$SISTER_PASSWORD    = 'ENm71yTjQb844isvy6qorzKXkSVy7s9u8xpeAcHk3KPv3qAybe406shJWF/xIETJxfo10Ix2r3l4K0g/pjqY9niV6um1svKbixkKvjcUL8aNVaJMRQKvUKWi8s/FHLu9';
$SISTER_ID_PENGGUNA = 'a4beddca-eed1-4116-9f74-6a99d68ea824';

// ============================================================

header('Content-Type: application/json');
header('Access-Control-Allow-Origin: *');
header('Access-Control-Allow-Methods: GET, POST, PUT, DELETE, OPTIONS');
header('Access-Control-Allow-Headers: Content-Type, Authorization');

if ($_SERVER['REQUEST_METHOD'] === 'OPTIONS') {
    http_response_code(200);
    exit();
}

// Ambil endpoint dari query string yang dikirim .htaccess
$endpoint = isset($_GET['endpoint']) ? rtrim(trim($_GET['endpoint']), '/') : '';

// ─── ROUTE: /api/login ───────────────────────────────────────
if ($endpoint === 'login') {
    if ($_SERVER['REQUEST_METHOD'] !== 'POST') {
        http_response_code(405);
        echo json_encode(['message' => 'Method not allowed']);
        exit;
    }

    $input = json_decode(file_get_contents('php://input'), true);
    $username = trim($input['username'] ?? '');
    $password = trim($input['password'] ?? '');

    if (!$username || !$password) {
        http_response_code(400);
        echo json_encode(['message' => 'Harap isi username dan password.']);
        exit;
    }

    // Cek kredensial user
    $isMatch = false;
    foreach ($CUSTOM_USERS as $u) {
        if ($u['username'] === $username && $u['password'] === $password) {
            $isMatch = true;
            break;
        }
    }

    if (!$isMatch) {
        http_response_code(401);
        echo json_encode(['message' => 'Username atau password salah.']);
        exit;
    }

    // Login berhasil → ambil token dari SISTER dengan kredensial rahasia
    $ch = curl_init('https://sister-api.kemdiktisaintek.go.id/ws.php/1.0/authorize');
    curl_setopt($ch, CURLOPT_RETURNTRANSFER, true);
    curl_setopt($ch, CURLOPT_POST, true);
    curl_setopt($ch, CURLOPT_HTTPHEADER, ['Content-Type: application/json']);
    curl_setopt($ch, CURLOPT_SSL_VERIFYPEER, false);
    curl_setopt($ch, CURLOPT_POSTFIELDS, json_encode([
        'username'    => $SISTER_USERNAME,
        'password'    => $SISTER_PASSWORD,
        'id_pengguna' => $SISTER_ID_PENGGUNA,
    ]));

    $response = curl_exec($ch);
    $httpCode = curl_getinfo($ch, CURLINFO_HTTP_CODE);
    $curlError = curl_error($ch);
    curl_close($ch);

    if ($curlError) {
        http_response_code(500);
        echo json_encode(['message' => 'Gagal menghubungi server SISTER: ' . $curlError]);
        exit;
    }

    http_response_code($httpCode);
    echo $response;
    exit;
}

// ─── ROUTE: /api/pegawai ───────────────────────────────────────
if ($endpoint === 'pegawai') {
    // Database configuration for pegawai
    $db_host = 'localhost';
    $db_name = 'stiepanc_sister';
    $db_user = 'stiepanc_sister';
    $db_pass = '123Stiepan#';

    try {
        $pdo = new PDO("mysql:host=$db_host;dbname=$db_name;charset=utf8", $db_user, $db_pass);
        $pdo->setAttribute(PDO::ATTR_ERRMODE, PDO::ERRMODE_EXCEPTION);
    } catch (PDOException $e) {
        http_response_code(500);
        echo json_encode(['message' => 'Database connection failed: ' . $e->getMessage()]);
        exit;
    }

    if ($_SERVER['REQUEST_METHOD'] === 'GET') {
        try {
            $stmt = $pdo->query("SELECT * FROM pegawai ORDER BY id DESC");
            $data = $stmt->fetchAll(PDO::FETCH_ASSOC);
            echo json_encode(['data' => $data]);
        } catch (PDOException $e) {
            http_response_code(500);
            echo json_encode(['message' => 'Failed to fetch data: ' . $e->getMessage()]);
        }
        exit;
    }

    if ($_SERVER['REQUEST_METHOD'] === 'POST') {
        $nip = $_POST['nip'] ?? '';
        $nama_pegawai = $_POST['nama_pegawai'] ?? '';
        $gelar = $_POST['gelar'] ?? '';
        $nomor_ktp = $_POST['nomor_ktp'] ?? '';
        $email = $_POST['email'] ?? '';
        $agama = $_POST['agama'] ?? '';
        $tempat_lahir = $_POST['tempat_lahir'] ?? '';
        $tanggal_lahir = $_POST['tanggal_lahir'] ?? null;
        $jenis_kelamin = $_POST['jenis_kelamin'] ?? '';
        $tahun_masuk = $_POST['tahun_masuk'] ?? null;
        $alamat = $_POST['alamat'] ?? '';
        $nomor_telepon = $_POST['nomor_telepon'] ?? '';

        $foto = null;
        if (isset($_FILES['foto']) && $_FILES['foto']['error'] === UPLOAD_ERR_OK) {
            $uploadDir = __DIR__ . '/uploads/pegawai/';
            if (!is_dir($uploadDir)) {
                mkdir($uploadDir, 0755, true);
            }
            $ext = pathinfo($_FILES['foto']['name'], PATHINFO_EXTENSION);
            $filename = uniqid('foto_') . '.' . $ext;
            $destination = $uploadDir . $filename;
            if (move_uploaded_file($_FILES['foto']['tmp_name'], $destination)) {
                $foto = 'uploads/pegawai/' . $filename;
            }
        }

        try {
            $sql = "INSERT INTO pegawai (foto, nip, nama_pegawai, gelar, nomor_ktp, email, agama, tempat_lahir, tanggal_lahir, jenis_kelamin, tahun_masuk, alamat, nomor_telepon) 
                    VALUES (:foto, :nip, :nama_pegawai, :gelar, :nomor_ktp, :email, :agama, :tempat_lahir, :tanggal_lahir, :jenis_kelamin, :tahun_masuk, :alamat, :nomor_telepon)";
            $stmt = $pdo->prepare($sql);
            $stmt->execute([
                ':foto' => $foto,
                ':nip' => $nip,
                ':nama_pegawai' => $nama_pegawai,
                ':gelar' => $gelar,
                ':nomor_ktp' => $nomor_ktp,
                ':email' => $email,
                ':agama' => $agama,
                ':tempat_lahir' => $tempat_lahir,
                ':tanggal_lahir' => $tanggal_lahir ? $tanggal_lahir : null,
                ':jenis_kelamin' => $jenis_kelamin,
                ':tahun_masuk' => $tahun_masuk ? $tahun_masuk : null,
                ':alamat' => $alamat,
                ':nomor_telepon' => $nomor_telepon
            ]);
            echo json_encode(['message' => 'Data pegawai berhasil disimpan', 'id' => $pdo->lastInsertId()]);
        } catch (PDOException $e) {
            http_response_code(400);
            echo json_encode(['message' => 'Gagal menyimpan: ' . $e->getMessage()]);
        }
        exit;
    }
}

// ─── ROUTE: Proxy semua /api/* lainnya ke SISTER ─────────────
$sisterBase = 'https://sister-api.kemdiktisaintek.go.id/ws.php/1.0/';
$sisterUrl  = $sisterBase . $endpoint;

// Bangun ulang query string tanpa parameter 'endpoint'
$params = $_GET;
unset($params['endpoint']);
$queryString = http_build_query($params);
if (!empty($queryString)) {
    $sisterUrl .= '?' . $queryString;
}

$ch = curl_init($sisterUrl);
curl_setopt($ch, CURLOPT_RETURNTRANSFER, true);
curl_setopt($ch, CURLOPT_SSL_VERIFYPEER, false);
curl_setopt($ch, CURLOPT_CUSTOMREQUEST, $_SERVER['REQUEST_METHOD']);

// Salin Authorization header (Bearer Token) dari request React ke SISTER
$headers = [];
if (isset($_SERVER['HTTP_AUTHORIZATION'])) {
    $headers[] = 'Authorization: ' . $_SERVER['HTTP_AUTHORIZATION'];
}
if (isset($_SERVER['CONTENT_TYPE'])) {
    $headers[] = 'Content-Type: ' . $_SERVER['CONTENT_TYPE'];
}
if (!empty($headers)) {
    curl_setopt($ch, CURLOPT_HTTPHEADER, $headers);
}

if (in_array($_SERVER['REQUEST_METHOD'], ['POST', 'PUT', 'PATCH'])) {
    curl_setopt($ch, CURLOPT_POSTFIELDS, file_get_contents('php://input'));
}

$response    = curl_exec($ch);
$httpCode    = curl_getinfo($ch, CURLINFO_HTTP_CODE);
$curlError   = curl_error($ch);
curl_close($ch);

if ($curlError) {
    http_response_code(502);
    echo json_encode(['message' => 'Proxy error: ' . $curlError]);
    exit;
}

http_response_code($httpCode);
echo $response;
