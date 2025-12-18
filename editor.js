// Cropper.js is loaded via CDN in index.html
// Using global Cropper object

let isEditMode = false;
let currentImageElement = null;
let cropper = null;

const STORAGE_KEY = 'eie-landing-edits';

export function initEditor() {
    const toggleBtn = document.getElementById('toggle-edit-mode');
    const cropModal = document.getElementById('crop-modal');
    const cropImageTarget = document.getElementById('crop-image-target');
    const cropCancelBtn = document.getElementById('crop-cancel');
    const cropApplyBtn = document.getElementById('crop-apply');
    const imageInput = document.getElementById('image-upload-input');
    const downloadBtn = document.getElementById('download-html');
    const resetBtn = document.getElementById('reset-edits');
    const saveBtn = document.getElementById('save-edits');
    const editButtonsGroup = document.getElementById('edit-buttons');
    const imageSizeSlider = document.getElementById('image-size-slider');
    const imageSizeValue = document.getElementById('image-size-value');

    // 페이지 로드 시 저장된 편집 내용 복원
    restoreEdits();

    toggleBtn.addEventListener('click', () => {
        isEditMode = !isEditMode;
        document.body.classList.toggle('edit-mode-active', isEditMode);
        toggleBtn.textContent = isEditMode ? '✅ 편집 모드 끄기' : '✏️ 편집 모드 켜기';
        toggleBtn.style.background = isEditMode ? '#28a745' : '#8C002B';
        toggleBtn.style.borderColor = isEditMode ? '#28a745' : '#8C002B';
        if (editButtonsGroup) {
            editButtonsGroup.style.display = isEditMode ? 'flex' : 'none';
        }

        setupEditableElements();
    });

    // Handle Image Clicking
    document.addEventListener('click', (e) => {
        if (!isEditMode) return;

        // Prevent default link behavior in edit mode
        if (e.target.closest('a')) {
            e.preventDefault();
        }

        if (e.target.tagName === 'IMG' && !e.target.closest('#crop-modal') && !e.target.closest('.logo')) {
            openCropModal(e.target);
        }
    });

    // Image Upload Handling
    imageInput.addEventListener('change', (e) => {
        const file = e.target.files[0];
        if (file) {
            const reader = new FileReader();
            reader.onload = (event) => {
                cropImageTarget.src = event.target.result;
                if (cropper) cropper.destroy();
                initCropper(); // Re-init with new image
            };
            reader.readAsDataURL(file);
        }
        // Reset input
        imageInput.value = '';
    });

    // Cancel Crop
    cropCancelBtn.addEventListener('click', () => {
        closeModal();
    });

    // Image Size Slider
    imageSizeSlider.addEventListener('input', (e) => {
        const size = e.target.value;
        imageSizeValue.textContent = `${size}%`;
    });

    // Apply Crop
    cropApplyBtn.addEventListener('click', () => {
        if (!cropper) return;

        // Get cropped result
        const canvas = cropper.getCroppedCanvas();
        if (canvas && currentImageElement) {
            currentImageElement.src = canvas.toDataURL(); // Update the image on page

            // Apply size from slider
            const size = imageSizeSlider.value;
            currentImageElement.style.width = `${size}%`;
            currentImageElement.style.height = 'auto';
            currentImageElement.style.maxWidth = `${size}%`;

            // Save to localStorage
            saveImageEdit(currentImageElement);

            // Optional: Flash effect to show update
            currentImageElement.style.outline = '4px solid #00ff00';
            setTimeout(() => {
                currentImageElement.style.outline = '';
            }, 500);
        }
        closeModal();
    });

    // Download HTML
    downloadBtn.addEventListener('click', () => {
        downloadCurrentHTML();
    });

    // Save Edits
    saveBtn.addEventListener('click', () => {
        // 현재 모든 편집 가능한 요소의 텍스트 저장
        document.querySelectorAll('[contenteditable="true"]').forEach(el => {
            if (!el.closest('#editor-controls') && !el.closest('#crop-modal')) {
                saveTextEdit(el);
            }
        });

        // 모든 이미지도 저장 (data-original-src가 있는 이미지만)
        document.querySelectorAll('img[data-original-src]').forEach(img => {
            if (!img.closest('#editor-controls') && !img.closest('#crop-modal')) {
                saveImageEdit(img);
            }
        });

        // 저장 확인 메시지
        const message = document.createElement('div');
        message.textContent = '✅ 저장되었습니다!';
        message.style.cssText = `
            position: fixed;
            top: 50%;
            left: 50%;
            transform: translate(-50%, -50%);
            background: #28a745;
            color: white;
            padding: 20px 40px;
            border-radius: 8px;
            font-size: 1.2rem;
            font-weight: bold;
            z-index: 10001;
            box-shadow: 0 4px 12px rgba(0,0,0,0.3);
        `;
        document.body.appendChild(message);
        setTimeout(() => {
            message.remove();
        }, 2000);
    });

    // Reset Edits
    resetBtn.addEventListener('click', () => {
        if (confirm('모든 편집 내용을 초기화하시겠습니까?')) {
            localStorage.removeItem(STORAGE_KEY);
            location.reload();
        }
    });

    function openCropModal(img) {
        currentImageElement = img;
        cropModal.style.display = 'flex';

        // Determine aspect ratio from the target image's computed size
        const rect = img.getBoundingClientRect();
        const aspectRatio = rect.width / rect.height;

        // Get current width percentage (if previously set) or default to 100
        const currentWidth = img.style.width ? parseInt(img.style.width) : 100;
        imageSizeSlider.value = currentWidth;
        imageSizeValue.textContent = `${currentWidth}%`;

        document.getElementById('crop-ratio-display').textContent = `현재 비율 고정: ${Math.round(rect.width)}x${Math.round(rect.height)} (${aspectRatio.toFixed(2)})`;

        cropImageTarget.src = img.src;

        // Initialize Cropper
        if (cropper) cropper.destroy();
        initCropper(aspectRatio);
    }

    function initCropper(aspectRatio) {
        cropper = new Cropper(cropImageTarget, {
            aspectRatio: aspectRatio || NaN, // NaN means free crop if we didn't want to lock it
            viewMode: 1, // Restrict crop box to canvas
            autoCropArea: 1,
            guides: true,
            background: false,
        });
    }

    function closeModal() {
        cropModal.style.display = 'none';
        if (cropper) {
            cropper.destroy();
            cropper = null;
        }
        currentImageElement = null;
    }
}

function setupEditableElements() {
    const textTags = ['h1', 'h2', 'h3', 'h4', 'h5', 'h6', 'p', 'span', '.btn'];

    // Toggle contenteditable
    document.querySelectorAll(textTags.join(',')).forEach(el => {
        // Avoid editing system UI
        if (el.closest('#editor-controls') || el.closest('#crop-modal')) return;

        if (isEditMode) {
            el.setAttribute('contenteditable', 'true');
            el.classList.add('editable-element');

            // 텍스트 변경 시 자동 저장
            el.addEventListener('blur', () => saveTextEdit(el));
        } else {
            el.removeAttribute('contenteditable');
            el.classList.remove('editable-element');
        }
    });
}

function downloadCurrentHTML() {
    // Clone document to clean up editor UI before saving
    const clone = document.documentElement.cloneNode(true);

    // Remove editor controls and modals
    const controls = clone.querySelector('#editor-controls');
    const modal = clone.querySelector('#crop-modal');
    if (controls) controls.remove();
    if (modal) modal.remove();

    // Remove editable attributes and classes
    const editables = clone.querySelectorAll('[contenteditable]');
    editables.forEach(el => {
        el.removeAttribute('contenteditable');
        el.classList.remove('editable-element');
    });

    // Remove script tag that imports the editor (optional/tricky, maybe just leave it)

    const htmlContent = clone.outerHTML;
    const blob = new Blob([htmlContent], { type: 'text/html' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'index-edited.html';
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
}

// localStorage 저장/복원 함수들
function getStoredEdits() {
    const stored = localStorage.getItem(STORAGE_KEY);
    return stored ? JSON.parse(stored) : { images: {}, texts: {} };
}

function saveImageEdit(imgElement) {
    const edits = getStoredEdits();
    const imgSrc = imgElement.getAttribute('src');
    const originalSrc = imgElement.dataset.originalSrc || imgSrc;

    // 첫 편집 시 원본 src 저장
    if (!imgElement.dataset.originalSrc) {
        imgElement.dataset.originalSrc = originalSrc;
    }

    // Base64 이미지는 localStorage 용량을 많이 차지하므로 크기만 저장
    // 크롭된 이미지는 저장하지 않고, 크기 조절만 저장
    edits.images[originalSrc] = {
        width: imgElement.style.width,
        height: imgElement.style.height,
        maxWidth: imgElement.style.maxWidth
    };

    try {
        localStorage.setItem(STORAGE_KEY, JSON.stringify(edits));
    } catch (e) {
        if (e.name === 'QuotaExceededError') {
            console.warn('localStorage 용량 초과. 이전 데이터를 삭제합니다.');
            localStorage.removeItem(STORAGE_KEY);
            // 재시도
            edits.images = { [originalSrc]: edits.images[originalSrc] };
            edits.texts = {};
            localStorage.setItem(STORAGE_KEY, JSON.stringify(edits));
        }
    }
}

function saveTextEdit(element) {
    const edits = getStoredEdits();
    const path = getElementPath(element);

    edits.texts[path] = element.innerHTML;
    localStorage.setItem(STORAGE_KEY, JSON.stringify(edits));
}

function getElementPath(element) {
    const path = [];
    let current = element;

    while (current && current !== document.body) {
        let selector = current.tagName.toLowerCase();

        if (current.id) {
            selector += `#${current.id}`;
        } else if (current.className) {
            const classes = Array.from(current.classList)
                .filter(c => !c.startsWith('editable'))
                .join('.');
            if (classes) selector += `.${classes}`;
        }

        // 형제 중 몇 번째인지 추가
        const siblings = Array.from(current.parentNode?.children || []);
        const index = siblings.indexOf(current);
        if (siblings.length > 1) {
            selector += `:nth-child(${index + 1})`;
        }

        path.unshift(selector);
        current = current.parentNode;
    }

    return path.join(' > ');
}

function restoreEdits() {
    const edits = getStoredEdits();

    // 이미지 복원
    Object.keys(edits.images).forEach(originalSrc => {
        const imgData = edits.images[originalSrc];

        // 다양한 방법으로 이미지 찾기
        let img = document.querySelector(`img[data-original-src="${originalSrc}"]`);

        if (!img) {
            // data-original-src가 없으면 src로 찾기
            img = document.querySelector(`img[src="${originalSrc}"]`);
        }

        if (!img) {
            // src 경로의 마지막 부분으로만 찾기
            const filename = originalSrc.split('/').pop();
            const allImages = document.querySelectorAll('img');
            for (const image of allImages) {
                const imgSrc = image.getAttribute('src') || image.src;
                if (imgSrc && imgSrc.includes(filename)) {
                    img = image;
                    break;
                }
            }
        }

        if (img && !img.closest('#editor-controls') && !img.closest('#crop-modal')) {
            img.dataset.originalSrc = originalSrc;
            // Base64 src는 복원하지 않음 (localStorage 용량 문제)
            // 크기만 복원
            if (imgData.width) img.style.width = imgData.width;
            if (imgData.height) img.style.height = imgData.height;
            if (imgData.maxWidth) img.style.maxWidth = imgData.maxWidth;
        }
    });

    // 텍스트 복원
    Object.keys(edits.texts).forEach(path => {
        try {
            const element = document.querySelector(path);
            if (element && !element.closest('#editor-controls') && !element.closest('#crop-modal')) {
                element.innerHTML = edits.texts[path];
            }
        } catch (e) {
            console.warn('텍스트 복원 실패:', path, e);
        }
    });
}
