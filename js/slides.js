const fileInput = document.getElementById("file-input");
const durationInput = document.getElementById("duration");
const duration = durationInput ? durationInput.value : "10";
const uploadButton = document.querySelector("#upload-section button");
const uploadProgress = document.getElementById("upload-progress");
const fileListContainer = document.getElementById("file-list");
const fileListUl = document.querySelector("#file-list ul");
const uploadSection = document.getElementById("upload-section");
const uploadLabel = document.querySelector('label[for="file-input"]');

uploadSection.addEventListener("dragover", (e) => {
  e.preventDefault();
  uploadLabel.classList.add("drag-over");
});

uploadSection.addEventListener("dragleave", () => {
  uploadLabel.classList.remove("drag-over");
});

uploadSection.addEventListener("drop", (e) => {
  e.preventDefault();
  uploadLabel.classList.remove("drag-over");

  const droppedFiles = e.dataTransfer.files;

  handleDroppedFiles(droppedFiles);
});

function handleDroppedFiles(files) {
  if (files.length === 0) {
    alert("Please drop files to upload.");
    return;
  }
  uploadProgress.classList.add("upload-msg");
  uploadProgress.innerHTML = "Uploading...";

  const formData = new FormData();
  for (let i = 0; i < files.length; i++) {
    formData.append("files[]", files[i]);
  }

  formData.append("duration", duration);

  fetch("../php/upload.php", {
    method: "POST",
    body: formData,
  })
    .then((response) => response.json())
    .then((data) => {
      uploadProgress.classList.add("upload-msg");
      uploadProgress.innerHTML = "Upload complete.";
      if (Array.isArray(data)) {
        fetchFileList();
      } else if (data && data.message) {
        alert(data.message);
      } else {
        alert("Upload successful.");
        fetchFileList();
      }
    })
    .catch((error) => {
      uploadProgress.classList.add("upload-msg");
      uploadProgress.innerHTML = "Upload failed.";
      console.error("Error uploading files:", error);
      alert("Error uploading files. Please try again.");
    });

  setTimeout(function () {
    uploadProgress.classList.remove("upload-msg");
  }, 5000);
}

let uploadedFiles = [];

document.getElementById("file-input").onchange = function () {
  uploadFiles();
};

function uploadFiles() {
  const files = fileInput.files;
  if (files.length === 0) {
    alert("Please select files to upload.");
    return;
  }

  uploadProgress.classList.add("upload-msg");
  uploadProgress.innerHTML = "Uploading...";

  const formData = new FormData();
  for (let i = 0; i < files.length; i++) {
    formData.append("files[]", files[i]);
  }

  formData.append("duration", duration);

  fetch("../php/upload.php", {
    method: "POST",
    body: formData,
  })
    .then((response) => response.json())
    .then((data) => {
      uploadProgress.classList.add("upload-msg");
      uploadProgress.innerHTML = "Upload complete.";
      if (Array.isArray(data)) {
        fetchFileList();
      } else if (data && data.message) {
        alert(data.message);
      } else {
        alert("Upload successful.");
        fetchFileList();
      }
      fileInput.value = "";
      duration.value = "10";
    })
    .catch((error) => {
      uploadProgress.classList.add("upload-msg");
      uploadProgress.innerHTML = "Upload failed.";
      console.error("Error uploading files:", error);
      alert("Error uploading files. Please try again.");
    });

  setTimeout(function () {
    uploadProgress.classList.remove("upload-msg");
  }, 5000);
}

function fetchFileList() {
  fetch("../php/upload.php", {
    method: "GET",
  })
    .then((response) => response.json())
    .then((data) => {
      uploadedFiles = data;
      displayFileList();
    })
    .catch((error) => {
      console.error("Error fetching file list:", error);
      fileListContainer.innerHTML = "<p>Error loading file list.</p><ul></ul>";
      fileListUl = document.querySelector("#file-list ul");
    });
}

function displayFileList() {
  if (uploadedFiles.length === 0) {
    fileListContainer.innerHTML = "<p>No files uploaded yet.</p><ul></ul>";
    fileListUl = document.querySelector("#file-list ul");
    return;
  }

  fileListUl.innerHTML = "";
  uploadedFiles.forEach((fileInfo, index) => {
    const listItem = document.createElement("li");
    const isEnabled = !fileInfo.name.endsWith(".disabled");
    const filePath = fileInfo.name;
    const fileType = fileInfo.name.split(".").pop();
    const fileName = fileInfo.name.split("~").pop();
    const duration = fileInfo.name.split("~").slice(-2)[0];

    listItem.classList.toggle("disabled-slide", !isEnabled);

    listItem.innerHTML = `
                    <div class="file-info">
                        <image src="uploads/${filePath}" class="image" id="image-${index}" />
                        <video class="video" controls id="video-${index}">
                            <source src="uploads/${filePath}" type="video/mp4">
                            <source src="uploads/${filePath}" type="video/mkv">
                            Your browser does not support the video tag.
                        </video>
                        <input class="filename" type="text" id="filename-${index}" value="${fileName}" disabled>
                        <input class="seconds" type="text" id="duration-${index}" value="${duration}"  disabled>
                    </div>
                    <div class="file-actions">
                        <button class="edit" id="edit-${index}" onclick="enableEdit(${index})"><svg xmlns="http://www.w3.org/2000/svg" height="24px" viewBox="0 -960 960 960" width="24px"><path d="M200-200h57l391-391-57-57-391 391v57Zm-80 80v-170l528-527q12-11 26.5-17t30.5-6q16 0 31 6t26 18l55 56q12 11 17.5 26t5.5 30q0 16-5.5 30.5T817-647L290-120H120Zm640-584-56-56 56 56Zm-141 85-28-29 57 57-29-28Z"/></svg></button>
                        <button class="save" style="display:none;" id="save-${index}" onclick="saveFilename('${
      fileInfo.name
    }', ${index})"><svg xmlns="http://www.w3.org/2000/svg" height="24px" viewBox="0 -960 960 960" width="24px"><path d="m381-240 424-424-57-56-368 367-169-170-57 57 227 226Zm0 113L42-466l169-170 170 170 366-367 172 168-538 538Z"/></svg></button>
                        <button class="cancel" style="display:none;" id="cancel-${index}" onclick="cancelEdit(${index}, '${
      fileInfo.name
    }')"><svg xmlns="http://www.w3.org/2000/svg" height="24px" viewBox="0 -960 960 960" width="24px"><path d="m336-280 144-144 144 144 56-56-144-144 144-144-56-56-144 144-144-144-56 56 144 144-144 144 56 56ZM480-80q-83 0-156-31.5T197-197q-54-54-85.5-127T80-480q0-83 31.5-156T197-763q54-54 127-85.5T480-880q83 0 156 31.5T763-763q54 54 85.5 127T880-480q0 83-31.5 156T763-197q-54 54-127 85.5T480-80Zm0-80q134 0 227-93t93-227q0-134-93-227t-227-93q-134 0-227 93t-93 227q0 134 93 227t227 93Zm0-320Z"/></svg></button>
                        <button class="download" onclick="downloadFile('${
                          fileInfo.url || fileInfo.name
                        }')"><svg xmlns="http://www.w3.org/2000/svg" height="24px" viewBox="0 -960 960 960" width="24px" padding="0" margin="0"><path d="M480-320 280-520l56-58 104 104v-326h80v326l104-104 56 58-200 200ZM240-160q-33 0-56.5-23.5T160-240v-120h80v120h480v-120h80v120q0 33-23.5 56.5T720-160H240Z"/></svg></button>
                        <button class="toggle" onclick="toggleDisable('${
                          fileInfo.name
                        }', ${index})">${
      isEnabled
        ? '<svg xmlns="http://www.w3.org/2000/svg" height="24px" viewBox="0 -960 960 960" width="24px"><path d="m644-428-58-58q9-47-27-88t-93-32l-58-58q17-8 34.5-12t37.5-4q75 0 127.5 52.5T660-500q0 20-4 37.5T644-428Zm128 126-58-56q38-29 67.5-63.5T832-500q-50-101-143.5-160.5T480-720q-29 0-57 4t-55 12l-62-62q41-17 84-25.5t90-8.5q151 0 269 83.5T920-500q-23 59-60.5 109.5T772-302Zm20 246L624-222q-35 11-70.5 16.5T480-200q-151 0-269-83.5T40-500q21-53 53-98.5t73-81.5L56-792l56-56 736 736-56 56ZM222-624q-29 26-53 57t-41 67q50 101 143.5 160.5T480-280q20 0 39-2.5t39-5.5l-36-38q-11 3-21 4.5t-21 1.5q-75 0-127.5-52.5T300-500q0-11 1.5-21t4.5-21l-84-82Zm319 93Zm-151 75Z"/></svg>'
        : '<svg xmlns="http://www.w3.org/2000/svg" height="24px" viewBox="0 -960 960 960" width="24px"><path d="M480-320q75 0 127.5-52.5T660-500q0-75-52.5-127.5T480-680q-75 0-127.5 52.5T300-500q0 75 52.5 127.5T480-320Zm0-72q-45 0-76.5-31.5T372-500q0-45 31.5-76.5T480-608q45 0 76.5 31.5T588-500q0 45-31.5 76.5T480-392Zm0 192q-146 0-266-81.5T40-500q54-137 174-218.5T480-800q146 0 266 81.5T920-500q-54 137-174 218.5T480-200Zm0-300Zm0 220q113 0 207.5-59.5T832-500q-50-101-144.5-160.5T480-720q-113 0-207.5 59.5T128-500q50 101 144.5 160.5T480-280Z"/></svg>'
    }</button>
                        <button class="delete" onclick="deleteFile('${
                          fileInfo.name
                        }')"><svg xmlns="http://www.w3.org/2000/svg" height="24px" viewBox="0 -960 960 960" width="24px"><path d="M280-120q-33 0-56.5-23.5T200-200v-520h-40v-80h200v-40h240v40h200v80h-40v520q0 33-23.5 56.5T680-120H280Zm400-600H280v520h400v-520ZM360-280h80v-360h-80v360Zm160 0h80v-360h-80v360ZM280-720v520-520Z"/></svg></button>
                    </div>
                `;
    fileListUl.appendChild(listItem);

    if (fileType === "mkv" || fileType === "mp4") {
      document.getElementById(`video-${index}`).style.display = "block";
      document.getElementById(`image-${index}`).style.display = "none";
    } else {
      document.getElementById(`video-${index}`).style.display = "none";
    }
  });
}

function enableEdit(index) {
  document.getElementById(`filename-${index}`).disabled = false;
  document.getElementById(`duration-${index}`).disabled = false;
  document.getElementById(`save-${index}`).style.display = "inline-block";
  document.getElementById(`cancel-${index}`).style.display = "inline-block";
  document.getElementById(`edit-${index}`).style.display = "none";
}

function cancelEdit(index, originalName) {
  document.getElementById(`filename-${index}`).value = originalName
    .split("~")
    .pop();
  document.getElementById(`filename-${index}`).disabled = true;
  document.getElementById(`duration-${index}`).disabled = true;
  document.getElementById(`save-${index}`).style.display = "none";
  document.getElementById(`cancel-${index}`).style.display = "none";
  document.getElementById(`edit-${index}`).style.display = "inline-block";
}

function saveFilename(oldName, index) {
  let newName = document.getElementById(`filename-${index}`).value;
  let newDur = document.getElementById(`duration-${index}`).value;
  if (
    newName === oldName.split("~").pop() &&
    newDur === oldName.split("~").slice(-2)[0]
  ) {
    cancelEdit(index, oldName);
    return;
  }
  if (newName != oldName.split("~").pop()) {
    mergeName = oldName.split("~").slice(-2)[0] + "~" + newName;
  }
  if (newDur != oldName.split("~").slice(-2)[0]) {
    mergeName = newDur + "~" + oldName.split("~").pop();
  }
  if (
    newName != oldName.split("~").pop() &&
    newDur != oldName.split("~").slice(-2)[0]
  ) {
    mergeName = newDur + "~" + newName;
  }

  fetch("../php/rename.php", {
    method: "POST",
    headers: {
      "Content-Type": "application/x-www-form-urlencoded",
    },
    body: `old_name=${encodeURIComponent(
      oldName
    )}&new_name=${encodeURIComponent(mergeName)}`,
  })
    .then((response) => response.json())
    .then((data) => {
      if (data.message === "File renamed successfully.") {
        fetchFileList();
      } else {
        alert(`Error renaming file: ${data.error || "Unknown error"}`);
      }
    })
    .catch((error) => {
      console.error("Error renaming file:", error);
      alert("Error renaming file. Please try again.");
    });
}

function toggleDisable(filename, index) {
  const isDisabled = filename.endsWith(".disabled");
  const newFilename = isDisabled
    ? filename.slice(0, -".disabled".length)
    : filename + ".disabled";

  fetch("../php/rename.php", {
    method: "POST",
    headers: {
      "Content-Type": "application/x-www-form-urlencoded",
    },
    body: `old_name=${encodeURIComponent(
      filename
    )}&new_name=${encodeURIComponent(newFilename)}`,
  })
    .then((response) => response.json())
    .then((data) => {
      if (data.message === "File renamed successfully.") {
        fetchFileList();
      } else {
        alert(`Error toggling status: ${data.error || "Unknown error"}`);
      }
    })
    .catch((error) => {
      console.error("Error toggling file status:", error);
      alert("Error toggling file status. Please try again.");
    });
}

function downloadFile(urlOrName) {
  window.location.href = urlOrName;
}

function deleteFile(filename, index) {
  if (confirm(`Are you sure you want to delete ${filename}?`)) {
    fetch("../php/upload.php", {
      method: "POST",
      headers: {
        "Content-Type": "application/x-www-form-urlencoded",
      },
      body: `action=delete&filename=${encodeURIComponent(filename)}`,
    })
      .then((response) => response.json())
      .then((data) => {
        if (data.message === "File deleted successfully.") {
          fetchFileList();
        } else {
          alert(`Error deleting file: ${data.error || "Unknown error"}`);
        }
      })
      .catch((error) => {
        console.error("Error deleting file:", error);
        alert("Error deleting file. Please try again.");
      });
  }
}

function formatFileSize(bytes) {
  if (bytes === 0) return "0 Bytes";
  const k = 1024;
  const sizes = ["Bytes", "KB", "MB", "GB", "TB"];
  const i = Math.floor(Math.log(bytes) / Math.log(k));
  return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + " " + sizes[i];
}

document.addEventListener("DOMContentLoaded", function () {
  function calcStorage() {
    fetch("../php/storage.php")
      .then((response) => {
        if (!response.ok) {
          throw new Error(`HTTP error! status: ${response.status}`);
        }
        return response.text();
      })
      .then((data) => {
        const storageLeft = document.getElementById("storage-left");
        if (storageLeft) {
          storageLeft.innerHTML = data + " left";
        } else {
          console.error("Element with ID 'storageLeft' not found.");
        }
      })
      .catch((error) => {
        console.error("Error fetching storage information:", error);
        const storageLeft = document.getElementById("storage-left");
        if (storageLeft) {
          storageLeft.innerHTML = "Error loading storage info.";
        }
      });
  }

  calcStorage();
});

window.onload = fetchFileList;
