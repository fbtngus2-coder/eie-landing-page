import { supabase } from './supabaseClient.js'

const STORAGE_BUCKET = 'landing-page-images'
const TABLE_NAME = 'page_content'

let isEditMode = false;
let cropper = null;
let currentImageElement = null;

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
    console.log('EiE Landing Page Loaded');
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

    function setupEditableElements() {
        document.querySelectorAll('h1, h2, h3, p, a.btn, li, span').forEach(el => {
            if (!el.closest('#editor-controls') && !el.closest('#crop-modal')) {
                el.contentEditable = isEditMode;
                el.style.outline = isEditMode ? '1px dashed rgba(140, 0, 43, 0.3)' : '';
            }
        });

        document.querySelectorAll('img').forEach(img => {
            if (!img.closest('#editor-controls') && !img.closest('#crop-modal') && !img.closest('.logo')) {
                if (isEditMode) {
                    img.style.cursor = 'pointer';
                    img.style.outline = '2px dashed rgba(140, 0, 43, 0.5)';
                    img.crossOrigin = 'anonymous'; // CORS 문제 방지
                    img.onclick = () => openImageEditor(img);
                } else {
                    img.style.cursor = '';
                    img.style.outline = '';
                    img.onclick = null;
                }
            }
        });
    }

    function openImageEditor(img) {
        currentImageElement = img;
        cropModal.style.display = 'flex';
        const imgSrc = img.src;
        cropImageTarget.src = imgSrc;

        if (cropper) {
            cropper.destroy();
        }

        cropper = new Cropper(cropImageTarget, {
            aspectRatio: NaN,
            viewMode: 1,
            autoCropArea: 1
        });

        imageSizeSlider.value = 100;
        imageSizeValue.textContent = '100%';
    }

    function closeModal() {
        cropModal.style.display = 'none';
        if (cropper) {
            cropper.destroy();
            cropper = null;
        }
        currentImageElement = null;
    }

    // Image Size Slider
    imageSizeSlider.addEventListener('input', (e) => {
        const size = e.target.value;
        imageSizeValue.textContent = `${size}%`;
    });

    // Apply Crop
    cropApplyBtn.addEventListener('click', async () => {
        if (!cropper) return;

        const canvas = cropper.getCroppedCanvas();
        if (canvas && currentImageElement) {
            try {
                // 이미지를 Blob으로 변환
                const blob = await new Promise(resolve => canvas.toBlob(resolve, 'image/png'));

                // 파일명 생성
                const filename = `image_${Date.now()}.png`;

                // Supabase Storage에 업로드
                const { data, error } = await supabase.storage
                    .from(STORAGE_BUCKET)
                    .upload(filename, blob, {
                        contentType: 'image/png',
                        upsert: true
                    });

                if (error) throw error;

                // Public URL 가져오기
                const { data: { publicUrl } } = supabase.storage
                    .from(STORAGE_BUCKET)
                    .getPublicUrl(filename);

                console.log('✅ 업로드 성공! URL:', publicUrl);

                // 이미지 src 업데이트
                currentImageElement.src = publicUrl;

                // 중요: srcset 속성이 있다면 제거 (반응형 이미지 충돌 방지)
                if (currentImageElement.hasAttribute('srcset')) {
                    console.log('⚠️ srcset 속성 감지됨. 제거합니다.');
                    currentImageElement.removeAttribute('srcset');
                }

                // 크기 적용
                const size = imageSizeSlider.value;
                currentImageElement.style.width = `${size}%`;
                currentImageElement.style.height = 'auto';
                currentImageElement.style.maxWidth = `${size}%`;

                // Flash effect
                currentImageElement.style.outline = '4px solid #00ff00';
                setTimeout(() => {
                    if (currentImageElement) {
                        currentImageElement.style.outline = '';
                    }
                }, 500);

                alert('✅ 이미지가 업로드되었습니다! 💾 저장 버튼을 눌러 변경사항을 저장하세요.');
            } catch (error) {
                console.error('이미지 업로드 실패:', error);
                alert('❌ 이미지 업로드에 실패했습니다: ' + error.message);
            }
        }
        closeModal();
    });

    // 새 이미지 업로드 버튼 기능 복구
    // 버튼 ID가 명확하지 않으므로 텍스트로 찾아서 연결하거나, 모달 내의 특정 버튼을 타겟팅
    const uploadNewImageBtn = Array.from(cropModal.querySelectorAll('button')).find(btn => btn.textContent.includes('새 이미지 업로드') || btn.classList.contains('btn-secondary'));

    if (uploadNewImageBtn) {
        uploadNewImageBtn.onclick = () => imageInput.click();
    }

    // 파일 선택 시 Cropper 이미지 교체
    imageInput.addEventListener('change', (e) => {
        const file = e.target.files[0];
        if (file) {
            const reader = new FileReader();
            reader.onload = (readerEvent) => {
                if (cropper) {
                    cropper.replace(readerEvent.target.result);
                }
                // 입력값 초기화 (동일 파일 재선택 가능하게)
                imageInput.value = '';
            };
            reader.readAsDataURL(file);
        }
    });

    cropCancelBtn.addEventListener('click', () => {
        closeModal();
    });

    // Download HTML
    downloadBtn.addEventListener('click', () => {
        downloadCurrentHTML();
    });

    // Reset Edits
    resetBtn.addEventListener('click', async () => {
        if (confirm('모든 편집 내용을 삭제하시겠습니까?')) {
            try {
                // Supabase에서 모든 데이터 삭제
                const { error } = await supabase
                    .from(TABLE_NAME)
                    .delete()
                    .neq('id', 0); // 모든 행 삭제

                if (error) throw error;

                location.reload();
            } catch (error) {
                console.error('초기화 실패:', error);
                alert('❌ 초기화에 실패했습니다: ' + error.message);
            }
        }
    });

    // Save Edits
    saveBtn.addEventListener('click', async () => {
        try {
            // 텍스트 저장
            const textElements = document.querySelectorAll('[contenteditable="true"]');
            for (const el of textElements) {
                if (!el.closest('#editor-controls') && !el.closest('#crop-modal')) {
                    await saveTextEdit(el);
                }
            }

            // 이미지 크기 저장
            const images = document.querySelectorAll('img');
            for (const img of images) {
                if (!img.closest('#editor-controls') && !img.closest('#crop-modal') && !img.closest('.logo')) {
                    if (img.style.width || img.style.maxWidth) {
                        await saveImageStyle(img);
                    }
                }
            }

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

        } catch (error) {
            console.error('저장 실패:', error);
            alert('❌ 저장에 실패했습니다: ' + error.message);
        }
    });
}

async function saveTextEdit(element) {
    const selector = getUniqueSelector(element);
    const content = element.innerHTML;

    try {
        const { error } = await supabase
            .from(TABLE_NAME)
            .upsert({
                content_type: 'text',
                selector: selector,
                value: content
            }, {
                onConflict: 'selector'
            });

        if (error) throw error;
    } catch (error) {
        console.error('텍스트 저장 실패:', selector, error);
    }
}

async function saveImageStyle(imgElement) {
    const selector = getUniqueSelector(imgElement);
    const styleData = {
        src: imgElement.src,
        width: imgElement.style.width,
        height: imgElement.style.height,
        maxWidth: imgElement.style.maxWidth
    };

    try {
        const { error } = await supabase
            .from(TABLE_NAME)
            .upsert({
                content_type: 'image',
                selector: selector,
                value: JSON.stringify(styleData)
            }, {
                onConflict: 'selector'
            });

        if (error) throw error;
    } catch (error) {
        console.error('이미지 스타일 저장 실패:', selector, error);
    }
}

async function restoreEdits() {
    try {
        console.log('=== 복원 시작 ===');

        // Supabase에서 모든 데이터 가져오기
        const { data, error } = await supabase
            .from(TABLE_NAME)
            .select('*');

        if (error) throw error;

        console.log('불러온 데이터:', data);

        if (!data || data.length === 0) {
            console.log('저장된 데이터가 없습니다.');
            return;
        }

        let restoredTexts = 0;
        let restoredImages = 0;

        for (const item of data) {
            try {
                const element = document.querySelector(item.selector);

                if (!element) {
                    console.warn('요소를 찾을 수 없음:', item.selector);
                    continue;
                }

                if (item.content_type === 'text') {
                    element.innerHTML = item.value;
                    restoredTexts++;
                    console.log('✅ 텍스트 복원:', item.selector);
                } else if (item.content_type === 'image') {
                    const styleData = JSON.parse(item.value);
                    if (styleData.src) {
                        element.src = styleData.src;
                        // 복원 시에도 srcset 제거
                        if (element.hasAttribute('srcset')) element.removeAttribute('srcset');
                    }
                    if (styleData.width) element.style.width = styleData.width;
                    if (styleData.height) element.style.height = styleData.height;
                    if (styleData.maxWidth) element.style.maxWidth = styleData.maxWidth;
                    restoredImages++;
                    console.log('✅ 이미지 복원:', item.selector);
                }
            } catch (err) {
                console.error('복원 실패:', item.selector, err);
            }
        }

        console.log(`=== 복원 완료: 텍스트 ${restoredTexts}개, 이미지 ${restoredImages}개 ===`);

    } catch (error) {
        console.error('데이터 불러오기 실패:', error);
    }
}

function getUniqueSelector(element) {
    if (element.id) {
        return `#${element.id}`;
    }

    const path = [];
    let current = element;

    while (current && current !== document.body) {
        let selector = current.tagName.toLowerCase();

        if (current.className && typeof current.className === 'string') {
            const classes = current.className.trim().split(/\s+/).filter(c => c);
            if (classes.length > 0) {
                selector += '.' + classes.join('.');
            }
        }

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

function downloadCurrentHTML() {
    const html = document.documentElement.outerHTML;
    const blob = new Blob([html], { type: 'text/html' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'eie-landing-page.html';
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
}
