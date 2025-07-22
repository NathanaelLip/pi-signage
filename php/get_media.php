<?php
header('Content-Type: application/json');

$uploadDir = '../uploads/'; // Path to your uploads directory

$allowedExtensions = ['jpg', 'jpeg', 'png', 'gif', 'mp4', 'mkv', 'webm', 'ogg'];
$imageFiles = [];

if (is_dir($uploadDir)) {
    $files = scandir($uploadDir);
    foreach ($files as $file) {
        if ($file !== '.' && $file !== '..') {
            $filePath = $uploadDir . $file;
            $extension = strtolower(pathinfo($filePath, PATHINFO_EXTENSION));
            if (is_file($filePath) && in_array($extension, $allowedExtensions)) {
                $imageFiles[] = $filePath; // Or just the filename if you prefer
            }
        }
    }
}

echo json_encode($imageFiles);
?>