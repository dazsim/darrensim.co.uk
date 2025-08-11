<?php
header('Content-Type: application/json');
header('Access-Control-Allow-Origin: *');
header('Access-Control-Allow-Methods: GET, POST');
header('Access-Control-Allow-Headers: Content-Type');

// Get the URL to check from the request
$url = $_GET['url'] ?? $_POST['url'] ?? '';

if (empty($url)) {
    http_response_code(400);
    echo json_encode(['error' => 'No URL provided']);
    exit;
}

// Validate URL format
if (!filter_var($url, FILTER_VALIDATE_URL)) {
    http_response_code(400);
    echo json_encode(['error' => 'Invalid URL format']);
    exit;
}

// Initialize curl
$ch = curl_init();
curl_setopt_array($ch, [
    CURLOPT_URL => $url,
    CURLOPT_RETURNTRANSFER => true,
    CURLOPT_HEADER => true,
    CURLOPT_NOBODY => true, // Only get headers, not body
    CURLOPT_FOLLOWLOCATION => true,
    CURLOPT_MAXREDIRS => 5,
    CURLOPT_TIMEOUT => 10,
    CURLOPT_CONNECTTIMEOUT => 5,
    CURLOPT_SSL_VERIFYPEER => false, // Skip SSL verification for testing
    CURLOPT_USERAGENT => 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36'
]);

// Execute the request
$response = curl_exec($ch);
$httpCode = curl_getinfo($ch, CURLINFO_HTTP_CODE);
$error = curl_error($ch);
$info = curl_getinfo($ch);
curl_close($ch);

// Check for curl errors
if ($error) {
    echo json_encode([
        'isHealthy' => false,
        'status' => null,
        'error' => $error,
        'curlInfo' => $info
    ]);
    exit;
}

// Extract status from raw headers if available
$statusCode = $httpCode;
if (preg_match('/HTTP\/\d\.\d\s+(\d{3})/', $response, $matches)) {
    $statusCode = intval($matches[1]);
}

// Determine if the URL is healthy
$isHealthy = $statusCode >= 200 && $statusCode < 400;

// Return the result
echo json_encode([
    'isHealthy' => $isHealthy,
    'status' => $statusCode,
    'error' => null,
    'url' => $url,
    'responseHeaders' => substr($response, 0, 500) // First 500 chars for debugging
]);
?>
