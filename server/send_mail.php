<?php
// send_mail.php - example server-side mail handler (PHP)
// IMPORTANT: This is a minimal example. In production, you must
// - Validate and sanitize inputs
// - Use an authenticated SMTP server (PHPMailer / SMTP), do NOT rely on mail() alone
// - Protect against spam with CAPTCHA / rate limiting

header('Content-Type: application/json');

// Debug helper: if ?debug=1 then respond to GET with basic server info to test reachability
$is_debug = isset($_GET['debug']) && $_GET['debug'] == '1';
if ($is_debug && $_SERVER['REQUEST_METHOD'] === 'GET') {
    echo json_encode([
        'ok' => true,
        'method' => 'GET',
        'php_version' => phpversion(),
        'sendmail_path' => ini_get('sendmail_path') ?: null,
        'server_software' => $_SERVER['SERVER_SOFTWARE'] ?? null,
    ]);
    exit;
}

// Only accept POST for normal operation
if ($_SERVER['REQUEST_METHOD'] !== 'POST') {
    http_response_code(405);
    echo json_encode(['error' => 'Method not allowed']);
    exit;
}

$name = isset($_POST['name']) ? strip_tags(trim($_POST['name'])) : '';
$email = isset($_POST['email']) ? filter_var(trim($_POST['email']), FILTER_VALIDATE_EMAIL) : false;
$phone = isset($_POST['phone']) ? strip_tags(trim($_POST['phone'])) : '';
$message = isset($_POST['message']) ? strip_tags(trim($_POST['message'])) : '';

if (!$name || !$email || !$message) {
    http_response_code(400);
    echo json_encode(['error' => 'Missing required fields']);
    exit;
}

$to = 'laitartlucas@gmail.com'; // <- destination email (you provided)
$subject = "Nova mensagem do site: $name";
$body = "Nome: $name\nEmail: $email\nTelefone: $phone\n\nMensagem:\n$message";
$headers = "From: $name <$email>\r\n" .
           "Reply-To: $email\r\n" .
           "X-Mailer: PHP/" . phpversion();

// Optional: Use PHPMailer with SMTP (recommended for Gmail reliability)
// To use this, install PHPMailer via Composer: composer require phpmailer/phpmailer
$use_smtp = false; // set to true if you want to send through SMTP (recommended)
$smtp_config = [
    'host' => 'smtp.gmail.com',
    'port' => 587,
    'username' => 'your@gmail.com', // your SMTP username (Gmail: your full email)
    'password' => 'your-app-password', // Gmail requires an App Password if 2FA is enabled
    'encryption' => 'tls',
    'from_email' => $email,
    'from_name' => $name,
];

if ($use_smtp) {
    // try to use PHPMailer
    try {
        if (!file_exists(__DIR__ . '/../vendor/autoload.php')) {
            throw new Exception('Composer autoload not found. Run "composer require phpmailer/phpmailer"');
        }
        require __DIR__ . '/../vendor/autoload.php';
        $mail = new PHPMailer\PHPMailer\PHPMailer(true);
        //Server settings
        $mail->isSMTP();
        $mail->Host = $smtp_config['host'];
        $mail->SMTPAuth = true;
        $mail->Username = $smtp_config['username'];
        $mail->Password = $smtp_config['password'];
        $mail->SMTPSecure = $smtp_config['encryption'];
        $mail->Port = $smtp_config['port'];

        //Recipients
        $mail->setFrom($smtp_config['from_email'], $smtp_config['from_name']);
        $mail->addAddress($to);
        $mail->addReplyTo($email, $name);

        // Content
        $mail->isHTML(false);
        $mail->Subject = $subject;
        $mail->Body    = $body;

        $mail->send();
        echo json_encode(['success' => true]);
        exit;
    } catch (Exception $e) {
        // fall back to mail() below but log error
        error_log('PHPMailer error: ' . $e->getMessage());
        if ($is_debug) {
            http_response_code(500);
            echo json_encode(['error' => 'PHPMailer error', 'message' => $e->getMessage()]);
            exit;
        }
    }
}

// Fallback: Use mail() for quick example (may not work on many hosts without proper config)
// Fallback: Use mail()
set_error_handler(function($errno, $errstr) {
    error_log("Mail error: $errstr");
});

$ok = mail($to, $subject, $body, $headers);
restore_error_handler();

if ($ok) {
    echo json_encode(['success' => true]);
} else {
    // provide extra info in debug mode to help troubleshooting
    $last = error_get_last();
    if ($is_debug) {
        http_response_code(500);
        echo json_encode([
            'error' => 'Could not send email',
            'mail_result' => $ok,
            'error_last' => $last,
            'sendmail_path' => ini_get('sendmail_path') ?: null,
            'debug_notes' => 'Check XAMPP sendmail config or use PHPMailer with SMTP'
        ]);
    } else {
        http_response_code(500);
        echo json_encode(['error' => 'Could not send email']);
    }
}

?>