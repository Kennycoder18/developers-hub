<?php
$dsn = "mysql:host=localhost;dbname=test";
$dbusername = "root";
$dbpassword = "";

try {
    $pdo = new PDO($dsn, $dbusername, $dbpassword);
    $pdo->setAttribute(PDO::ATTR_ERRMODE, PDO::ERRMODE_EXCEPTION);
} catch (PDOException $e) {
    echo "Connection failed: " . $e->getMessage();
}

if($pdo) {
    echo "
<!DOCTYPE html>    
<html>
    <head>
        <title>Connected</title>
        <style>
            body {
                font-family: poppins, sans-serif;
                background: linear-gradient(to left, #add8e6, #9de3ffff);
                padding: 20px;
                text-align: center;
            }
            h1 {
                color: #333333ff;
            }
            p {
                color: #555555ff;
            }
            em {
                color: #01cf31ff;
            }
        </style>
    </head>
    <body>
        <h1>Connected!</h1>
        <p>You are successfully connected to <em>test</em> database</p>
    </body>
</html>
    ";
}