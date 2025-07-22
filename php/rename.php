<?php
// **Important Security Considerations:**
// - Sanitize user inputs thoroughly to prevent directory traversal and other vulnerabilities.
// - Validate the new filename to ensure it's acceptable.
// - Implement proper authentication and authorization to control who can rename files.

$uploadDirectory = '../uploads/';

if ($_SERVER['REQUEST_METHOD'] === 'POST' && isset($_POST['old_name']) && isset($_POST['new_name'])) {
    $oldName = basename($_POST['old_name']); // Sanitize
    $newName = basename($_POST['new_name']); // Sanitize

    $oldPath = $uploadDirectory . $oldName;
    $newPath = $uploadDirectory . $newName;

    if (file_exists($oldPath)) {
        if (rename($oldPath, $newPath)) {
            if (file_exists('../update.false')) { 
                rename('../update.false', '../update.true');
            }
            header('Content-Type: application/json');
            echo json_encode(['message' => 'File renamed successfully.']);
            exit;
        } else {
            http_response_code(500);
            echo json_encode(['error' => 'Failed to rename file.']);
            exit;
        }
    } else {
        http_response_code(404);
        echo json_encode(['error' => 'Original file not found.']);
        exit;
    }
} else {
    http_response_code(400);
    echo json_encode(['error' => 'Invalid request.']);
    exit;
}
?>