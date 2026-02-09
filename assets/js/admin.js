import { db } from "./firebase-config.js";
import { collection, getDocs, query, orderBy, limit } from "https://www.gstatic.com/firebasejs/9.6.1/firebase-firestore.js";

const authOverlay = document.getElementById('authOverlay');
const adminDashboard = document.getElementById('adminDashboard');
const loginBtn = document.getElementById('loginBtn');
const adminPasswordInput = document.getElementById('adminPassword');
const authError = document.getElementById('authError');
const logoutBtn = document.getElementById('logoutBtn');
const filesTableBody = document.querySelector('#filesTable tbody');
const loadingFiles = document.getElementById('loadingFiles');
const noFilesMsg = document.getElementById('noFilesMsg');

// Simple "auth" check
const ADMIN_PASS = "123";

loginBtn.addEventListener('click', () => {
    const password = adminPasswordInput.value;
    if (password === ADMIN_PASS) {
        authOverlay.classList.add('hidden');
        adminDashboard.classList.remove('hidden');
        loadFiles();
    } else {
        authError.textContent = "Contraseña incorrecta";
    }
});

logoutBtn.addEventListener('click', () => {
    window.location.reload(); // Simple logout by reload
});

async function loadFiles() {
    loadingFiles.classList.remove('hidden');
    filesTableBody.innerHTML = '';

    try {
        const q = query(collection(db, "uploads"), orderBy("timestamp", "desc"), limit(50)); // Limit to last 50 for now
        const querySnapshot = await getDocs(q);

        loadingFiles.classList.add('hidden');

        if (querySnapshot.empty) {
            noFilesMsg.classList.remove('hidden');
            return;
        }

        querySnapshot.forEach((doc) => {
            const data = doc.data();
            const row = document.createElement('tr');

            // Format date if timestamp exists
            let dateStr = "Procesando...";
            if (data.timestamp) {
                dateStr = new Date(data.timestamp.seconds * 1000).toLocaleString();
            }

            row.innerHTML = `
                <td>${dateStr}</td>
                <td>${data.uploaderName}</td>
                <td>${data.originalFilename}</td>
                <td>
                    <a href="${data.downloadURL}" class="download-btn" target="_blank" download>Descargar .zip</a>
                </td>
            `;
            filesTableBody.appendChild(row);
        });

    } catch (error) {
        console.error("Error al cargar archivos:", error);
        loadingFiles.textContent = "Error al cargar los archivos.";
    }
}
