<?php
// proxy.php - Proxy PHP sederhana untuk mengatasi CORS / Rewrite Vercel di cPanel
header("Access-Control-Allow-Origin: *");
header("Access-Control-Allow-Methods: GET, POST, PUT, DELETE, OPTIONS");
header("Access-Control-Allow-Headers: Authorization, Content-Type");

// Tangani pre-flight Request
if ($_SERVER['REQUEST_METHOD'] === 'OPTIONS') {
    http_response_code(200);
    exit();
}

// 1. Ambil path dan query dari request aplikasi 
$request_uri = $_SERVER['REQUEST_URI'];
// Buang /api/ beserta nama foldernya jika berada dalam subfolder
$path_and_query = preg_replace('/^.*\/api\//', '', $request_uri);

// 2. Gabungkan ke target server API SISTER
$target_url = "https://sister-api.kemdiktisaintek.go.id/ws.php/1.0/" . $path_and_query;

// 3. Siapkan request via cURL
$ch = curl_init($target_url);
curl_setopt($ch, CURLOPT_RETURNTRANSFER, true);
curl_setopt($ch, CURLOPT_FOLLOWLOCATION, true);
// Hindari isu sertifikat SSL pada beberapa cPanel lama
curl_setopt($ch, CURLOPT_SSL_VERIFYPEER, false);

// 4. Teruskan Headers (Termasuk Bearer Token Authorization dari localstorage)
$headers = array();
if (function_exists('getallheaders')) {
    $reqHeaders = getallheaders();
    foreach ($reqHeaders as $name => $val) {
        $name_lower = strtolower($name);
        // Jangan teruskan header host dan content-length asli
        if ($name_lower !== 'host' && $name_lower !== 'content-length') {
            $headers[] = "$name: $val";
        }
    }
}
curl_setopt($ch, CURLOPT_HTTPHEADER, $headers);

// 5. Pengecekan Method / Body Payload Data
$method = $_SERVER['REQUEST_METHOD'];
if ($method === 'POST' || $method === 'PUT') {
    curl_setopt($ch, CURLOPT_CUSTOMREQUEST, $method);
    curl_setopt($ch, CURLOPT_POSTFIELDS, file_get_contents('php://input'));
}

// 6. Eksekusi Request
$response = curl_exec($ch);
$http_code = curl_getinfo($ch, CURLINFO_HTTP_CODE);
curl_close($ch);

// 7. Berikan Response kembali ke Frontend dengan status aslinya
http_response_code($http_code);
header('Content-Type: application/json');
echo $response;
?>