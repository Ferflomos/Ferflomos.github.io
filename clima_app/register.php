<?php
require 'config.php'; // Archivo con la configuración de la base de datos

if ($_SERVER['REQUEST_METHOD'] === 'POST') {
    $username = $_POST['username'];
    $password = $_POST['password'];

    if (!empty($username) && !empty($password)) {
        $password_hash = password_hash($password, PASSWORD_BCRYPT);

        $stmt = $pdo->prepare("INSERT INTO users (username, password_hash) VALUES (?, ?)");
        if ($stmt->execute([$username, $password_hash])) {
            echo 'Registro exitoso';
        } else {
            echo 'Error en el registro';
        }
    } else {
        echo 'Todos los campos son obligatorios';
    }
}
?>

<form method="post">
    Usuario: <input type="text" name="username" required><br>
    Contraseña: <input type="password" name="password" required><br>
    <input type="submit" value="Registrar">
</form>
