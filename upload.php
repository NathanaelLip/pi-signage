<?php
// **Important Security Considerations:**
// - File uploads can be a major security risk. Always validate file types, sizes, and names.
// - Sanitize user inputs and file paths to prevent directory traversal and other vulnerabilities.
// - Consider storing uploaded files outside of your web root to prevent direct access.
// - Implement proper authentication and authorization to control who can upload and manage files.

// Configuration
$uploadDirectory = 'uploads/'; // The directory where uploaded files will be stored
$allowedExtensions = ['jpg', 'jpeg', 'png', 'gif', 'mp4', 'mkv', 'webm', 'ogg'];
$maxFileSize = 999 * 1024 * 1024; // 5MB in bytes

// Create the upload directory if it doesn't exist
if (!is_dir($uploadDirectory)) {
    mkdir($uploadDirectory, 0755, true);
}

// Handle File Upload (for /upload endpoint in JavaScript)
if ($_SERVER['REQUEST_METHOD'] === 'POST' && isset($_FILES['files']) && $_POST['duration']) {
    $uploadedFilesData = [];
    $files = $_FILES['files'];
    $duration = $_POST['duration'];
    $numFiles = count($files['name']);

    for ($i = 0; $i < $numFiles; $i++) {
        $fileName = basename($files['name'][$i]); // Sanitize filename
        $fileTmpName = $files['tmp_name'][$i];
        $fileSize = $files['size'][$i];
        $fileType = mime_content_type($fileTmpName); // Get MIME type

        // Basic validation
        if ($files['error'][$i] === UPLOAD_ERR_OK) {
            $extension = strtolower(pathinfo($fileName, PATHINFO_EXTENSION));
            if (in_array($extension, $allowedExtensions)) {
                if ($fileSize <= $maxFileSize) {
                    $uniqueFileName = $duration . '~' . $fileName; // Add a unique prefix to avoid collisions
                    $destination = $uploadDirectory . $uniqueFileName;

                    if (move_uploaded_file($fileTmpName, $destination)) {
                        $uploadedFilesData[] = [
                            'name' => $fileName,
                            'size' => $fileSize,
                            'type' => $fileType,
                            'url' => '/' . $uploadDirectory . $uniqueFileName, // Public URL to access the file
                            'path' => realpath($destination), // Server-side path (for potential deletion)
                        ];
                    } else {
                        http_response_code(500);
                        echo json_encode(['error' => 'Failed to move uploaded file.']);
                        exit;
                    }
                } else {
                    http_response_code(400);
                    echo json_encode(['error' => 'File size exceeds the limit.']);
                    exit;
                }
            } else {
                http_response_code(400);
                echo json_encode(['error' => 'Invalid file type. type = ' . $fileType]);
                exit;
            }
        } else {
            http_response_code(400);
            echo json_encode(['error' => 'Error during file upload: ' . $files['error'][$i]]);
            exit;
        }
    }

    if (file_exists('update.false')) { 
        rename('update.false', 'update.true');
    }
    header('Content-Type: application/json');
    echo json_encode($uploadedFilesData);
    exit;
}

// Handle File Download (for /download/:filename endpoint in JavaScript - adjust as needed)
if (isset($_GET['filename'])) {
    $filename = basename($_GET['filename']); // Sanitize filename
    $filePath = $uploadDirectory . $filename;

    if (file_exists($filePath)) {
        $mimeType = mime_content_type($filePath);

        header('Content-Type: ' . $mimeType);
        header('Content-Disposition: attachment; filename="' . $filename . '"');
        header('Content-Length: ' . filesize($filePath));
        readfile($filePath);
        exit;
    } else {
        http_response_code(404);
        echo 'File not found.';
        exit;
    }
}

// Handle File Deletion (you'll need to send a request to a specific endpoint like /delete)
if ($_SERVER['REQUEST_METHOD'] === 'POST' && isset($_POST['action']) && $_POST['action'] === 'delete' && isset($_POST['filename'])) {
    $filenameToDelete = basename($_POST['filename']); // Sanitize filename
    $filePathToDelete = $uploadDirectory . $filenameToDelete;

    if (file_exists($filePathToDelete)) {
        if (unlink($filePathToDelete)) {
            header('Content-Type: application/json');
            if (file_exists('update.false')) { 
                rename('update.false', 'update.true');
            }
            echo json_encode(['message' => 'File deleted successfully.']);
            exit;
        } else {
            http_response_code(500);
            echo json_encode(['error' => 'Failed to delete file.']);
            exit;
        }
    } else {
        http_response_code(404);
        echo json_encode(['error' => 'File not found for deletion.']);
        exit;
    }
}

// Handle Listing Files (for the optional window.onload in JavaScript)
if ($_SERVER['REQUEST_METHOD'] === 'GET') {
    $filesList = [];
    $scan = scandir($uploadDirectory);
    foreach ($scan as $file) {
        if ($file !== '.' && $file !== '..') {
            $filePath = $uploadDirectory . $file;
            if (is_file($filePath)) {
                $filesList[] = [
                    'name' => $file,
                    'size' => filesize($filePath),
                    'url' => '/' . $uploadDirectory . $file,
                ];
            }
        }
    }
    header('Content-Type: application/json');
    echo json_encode($filesList);
    exit;
}

// If no specific action is requested, you can display a basic message or handle it differently.
echo 'PHP backend for file upload and management.';
?>