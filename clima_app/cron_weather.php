<?php
require 'config.php';
session_start();

if (!isset($_SESSION['username'])) {
    die('No autenticado');
}

$api_key = '6798d92ccdffd2e4456da81c0b768de7'; // clave API 
$city = 'bogotá'; // ciudad

$url = "http://api.openweathermap.org/data/2.5/weather?q=$city&appid=$api_key&units=metric";
$response = file_get_contents($url);
$data = json_decode($response, true);

if ($data && $data['cod'] === 200) {
    $temperature = $data['main']['temp'];
    $description = $data['weather'][0]['description'];
    $timestamp = date('Y-m-d H:i:s');

    $stmt = $pdo->prepare("INSERT INTO weather_data (username, city, temperature, description, timestamp) VALUES (?, ?, ?, ?, ?)");
    $stmt->execute([$_SESSION['username'], $city, $temperature, $description, $timestamp]);

    echo 'Datos del clima guardados automáticamente';
} else {
    echo 'Error al obtener datos del clima';
}

