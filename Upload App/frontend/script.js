const ALLOWED_TYPES = ['image/jpeg', 'image/png', 'image/gif', 'image/webp', 'application/pdf'];
const MAX_SIZE = 10 * 1024 * 1024; // 10MB
const SEGMENT_COUNT = 24;

const dropzone = document.getElementById('dropzone');
const fileInput = document.getElementById('fileInput');
const idleState = document.getElementById('idleState');
const stagedState = document.getElementById('stagedState');
const transmitState = document.getElementById('transmitState');
const stagedPreview = document.getElementById('stagedPreview');
const stagedName = document.getElementById('stagedName');
const stagedSize = document.getElementById('stagedSize');
const clearBtn = document.getElementById('clearBtn');
const sendBtn = document.getElementById('sendBtn');
const errorMsg = document.getElementById('errorMsg');
const transmitName = document.getElementById('transmitName');
const transmitPercent = document.getElementById('transmitPercent');
const transmitStatus = document.getElementById('transmitStatus');
const segmentsEl = document.getElementById('segments');
const resultsGrid = document.getElementById('resultsGrid');
const resultsEmpty = document.getElementById('resultsEmpty');
const resultsCount = document.getElementById('resultsCount');

let stagedFile = null;

// Build the segmented progress bar once
for (let i = 0; i < SEGMENT_COUNT; i++) {
  const seg = document.createElement('div');
  seg.className = 'segment';
  segmentsEl.appendChild(seg);
}

function showState(name) {
  idleState.hidden = name !== 'idle';
  stagedState.hidden = name !== 'staged';
  transmitState.hidden = name !== 'transmit';
}

function formatSize(bytes) {
  if (bytes < 1024) return `${bytes} B`;
  if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(1)} KB`;
  return `${(bytes / (1024 * 1024)).toFixed(2)} MB`;
}

function showError(msg) {
  errorMsg.textContent = msg;
  errorMsg.hidden = false;
  dropzone.classList.add('invalid');
  setTimeout(() => dropzone.classList.remove('invalid'), 500);
}

function clearError() {
  errorMsg.hidden = true;
  errorMsg.textContent = '';
}

function validateFile(file) {
  if (!ALLOWED_TYPES.includes(file.type)) {
    return 'Unsupported file type. Use JPG, PNG, GIF, WEBP, or PDF.';
  }
  if (file.size > MAX_SIZE) {
    return `File is ${formatSize(file.size)} — max allowed is 10MB.`;
  }
  return null;
}

function stageFile(file) {
  const err = validateFile(file);
  if (err) {
    showError(err);
    resetToIdle();
    return;
  }
  clearError();
  stagedFile = file;

  stagedName.textContent = file.name;
  stagedSize.textContent = formatSize(file.size);

  stagedPreview.innerHTML = '';
  if (file.type.startsWith('image/')) {
    const img = document.createElement('img');
    img.src = URL.createObjectURL(file);
    stagedPreview.appendChild(img);
  } else {
    stagedPreview.textContent = 'PDF';
  }

  showState('staged');
}

function resetToIdle() {
  stagedFile = null;
  fileInput.value = '';
  showState('idle');
}

// --- Drag & drop ---
['dragenter', 'dragover'].forEach((evt) => {
  dropzone.addEventListener(evt, (e) => {
    e.preventDefault();
    dropzone.classList.add('dragover');
  });
});

['dragleave', 'drop'].forEach((evt) => {
  dropzone.addEventListener(evt, (e) => {
    e.preventDefault();
    dropzone.classList.remove('dragover');
  });
});

dropzone.addEventListener('drop', (e) => {
  const file = e.dataTransfer.files[0];
  if (file) stageFile(file);
});

dropzone.addEventListener('click', (e) => {
  if (idleState.hidden) return; // don't reopen picker while staged/transmitting
  fileInput.click();
});

dropzone.addEventListener('keydown', (e) => {
  if ((e.key === 'Enter' || e.key === ' ') && !idleState.hidden) {
    e.preventDefault();
    fileInput.click();
  }
});

fileInput.addEventListener('change', () => {
  const file = fileInput.files[0];
  if (file) stageFile(file);
});

clearBtn.addEventListener('click', (e) => {
  e.stopPropagation();
  resetToIdle();
});

// --- Upload with progress ---
sendBtn.addEventListener('click', (e) => {
  e.stopPropagation();
  if (!stagedFile) return;
  uploadFile(stagedFile);
});

function setSegments(percent) {
  const filledCount = Math.round((percent / 100) * SEGMENT_COUNT);
  [...segmentsEl.children].forEach((seg, i) => {
    seg.classList.toggle('filled', i < filledCount);
  });
}

function uploadFile(file) {
  showState('transmit');
  transmitName.textContent = file.name;
  transmitPercent.textContent = '0%';
  transmitStatus.textContent = 'transmitting…';
  setSegments(0);

  const formData = new FormData();
  formData.append('file', file);

  const xhr = new XMLHttpRequest();
  xhr.open('POST', '/api/upload');

  xhr.upload.addEventListener('progress', (e) => {
    if (!e.lengthComputable) return;
    const percent = Math.round((e.loaded / e.total) * 100);
    transmitPercent.textContent = `${percent}%`;
    setSegments(percent);
  });

  xhr.addEventListener('load', () => {
    if (xhr.status >= 200 && xhr.status < 300) {
      transmitStatus.textContent = 'complete';
      const data = JSON.parse(xhr.responseText);
      addResultCard(data.file);
      setTimeout(resetToIdle, 600);
    } else {
      let message = 'Upload failed. Try again.';
      try {
        message = JSON.parse(xhr.responseText).error || message;
      } catch (_) {}
      showError(message);
      showState('staged');
    }
  });

  xhr.addEventListener('error', () => {
    showError('Network error — could not reach the server.');
    showState('staged');
  });

  xhr.send(formData);
}

// --- Results gallery ---
function addResultCard(file) {
  resultsEmpty.hidden = true;
  const card = document.createElement('a');
  card.className = 'result-card';
  card.href = file.url;
  card.target = '_blank';
  card.rel = 'noopener';

  const thumb = document.createElement('div');
  thumb.className = 'result-card__thumb';
  if (file.mimeType && file.mimeType.startsWith('image/')) {
    const img = document.createElement('img');
    img.src = file.url;
    thumb.appendChild(img);
  } else {
    thumb.textContent = 'PDF';
  }

  const name = document.createElement('p');
  name.className = 'result-card__name';
  name.textContent = file.originalName || file.storedName;

  card.appendChild(thumb);
  card.appendChild(name);
  resultsGrid.prepend(card);

  const count = resultsGrid.querySelectorAll('.result-card').length;
  resultsCount.textContent = count;
}

// Load previously uploaded files on page load
async function loadExisting() {
  try {
    const res = await fetch('/api/files');
    const data = await res.json();
    if (data.files && data.files.length) {
      resultsEmpty.hidden = true;
      data.files.forEach((f) => {
        const ext = f.storedName.split('.').pop().toLowerCase();
        const isImage = ['jpg', 'jpeg', 'png', 'gif', 'webp'].includes(ext);
        addResultCard({
          originalName: f.storedName,
          storedName: f.storedName,
          url: f.url,
          mimeType: isImage ? 'image/*' : 'application/pdf',
        });
      });
    }
  } catch (err) {
    // Silent — gallery just stays empty if this fails
  }
}

loadExisting();
