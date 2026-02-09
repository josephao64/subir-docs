import { db, storage } from "./firebase-config.js";
import { ref, uploadBytes, getDownloadURL } from "https://www.gstatic.com/firebasejs/9.6.1/firebase-storage.js";
import { collection, addDoc, serverTimestamp } from "https://www.gstatic.com/firebasejs/9.6.1/firebase-firestore.js";

const uploadForm = document.getElementById('uploadForm');
const fileInput = document.getElementById('fileInput');
const loadingIndicator = document.getElementById('loadingIndicator');
const messageArea = document.getElementById('messageArea');

uploadForm.addEventListener('submit', async (e) => {
    e.preventDefault();
    messageArea.textContent = '';
    messageArea.className = 'message-area';

    const uploaderName = document.getElementById('uploaderName').value;
    const file = fileInput.files[0];

    if (!file) {
        showMessage('Por favor, selecciona un archivo.', 'error-msg');
        return;
    }

    // Allowed extensions check (frontend only, security should also be on backend rules)
    const allowedExtensions = ['xls', 'xlsx', 'doc', 'docx', 'pdf', 'jpg', 'jpeg', 'png'];
    const fileExtension = file.name.split('.').pop().toLowerCase();

    if (!allowedExtensions.includes(fileExtension)) {
        showMessage('Tipo de archivo no permitido.', 'error-msg');
        return;
    }

    setLoading(true);

    try {
        // 1. Compress the file
        const zip = new JSZip();
        zip.file(file.name, file);
        const compressedBlob = await zip.generateAsync({ type: "blob" });
        const zipFilename = `${file.name}_${Date.now()}.zip`;

        // 2. Upload to Firebase Storage
        const storageRef = ref(storage, 'uploads/' + zipFilename);
        const snapshot = await uploadBytes(storageRef, compressedBlob);
        const downloadURL = await getDownloadURL(snapshot.ref);

        // 3. Save metadata to Firestore
        await addDoc(collection(db, "uploads"), {
            uploaderName: uploaderName,
            originalFilename: file.name,
            storedFilename: zipFilename,
            downloadURL: downloadURL,
            fileType: fileExtension,
            timestamp: serverTimestamp()
        });

        showMessage('Archivo subido y comprimido con éxito.', 'success-msg');
        uploadForm.reset();

    } catch (error) {
        console.error("Error al subir archivo:", error);
        showMessage('Error al subir el archivo. Intenta de nuevo.', 'error-msg');
    } finally {
        setLoading(false);
    }
});

function showMessage(msg, className) {
    messageArea.textContent = msg;
    messageArea.className = `message-area ${className}`;
}

function setLoading(isLoading) {
    if (isLoading) {
        loadingIndicator.classList.remove('hidden');
        document.getElementById('uploadBtn').disabled = true;
    } else {
        loadingIndicator.classList.add('hidden');
        document.getElementById('uploadBtn').disabled = false;
    }
}
