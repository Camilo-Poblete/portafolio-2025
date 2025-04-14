document.addEventListener('DOMContentLoaded', function () {
    setupModals();

    if (typeof window.certificacionesIds !== 'undefined') {
        window.certificacionesIds.forEach((id) => {
            setTimeout(() => {
                fitToContainer(id);
            }, 100);
        });
    }
});

function setupModals() {
    if (typeof window.certificacionesIds !== 'undefined') {
        window.certificacionesIds.forEach((id) => {
            setupModalInteraction(id);
        });
    }
}

function setupModalInteraction(modalId) {
    const imgId = `cert-img-${modalId}`;
    const zoomLevelId = `zoom-level-${modalId}`;
    const containerDivId = `img-container-${modalId}`;

    const imgElement = document.getElementById(imgId);
    const zoomLevelElement = document.getElementById(zoomLevelId);
    const containerDiv = document.getElementById(containerDivId);

    if (!imgElement || !containerDiv) return;

    let isDragging = false;
    let lastPosX = 0;
    let lastPosY = 0;
    let translateX = 0;
    let translateY = 0;
    let scale = 1;

    imgElement.addEventListener('mousedown', (e) => {
        e.preventDefault();
        isDragging = true;
        imgElement.style.cursor = 'grabbing';
        lastPosX = e.clientX;
        lastPosY = e.clientY;
        translateX = parseFloat(imgElement.getAttribute('data-translate-x') || 0);
        translateY = parseFloat(imgElement.getAttribute('data-translate-y') || 0);
    });

    document.addEventListener('mousemove', (e) => {
        if (!isDragging) return;
        const deltaX = e.clientX - lastPosX;
        const deltaY = e.clientY - lastPosY;
        lastPosX = e.clientX;
        lastPosY = e.clientY;
        translateX += deltaX;
        translateY += deltaY;
        updateImageTransform(modalId);
    });

    document.addEventListener('mouseup', () => {
        if (!isDragging) return;
        isDragging = false;
        imgElement.style.cursor = 'grab';
        imgElement.setAttribute('data-translate-x', translateX);
        imgElement.setAttribute('data-translate-y', translateY);
    });

    containerDiv.addEventListener('mouseleave', () => {
        if (isDragging) {
            isDragging = false;
            imgElement.style.cursor = 'grab';
        }
    });

    containerDiv.addEventListener('wheel', (e) => {
        e.preventDefault();
        scale = parseFloat(imgElement.getAttribute('data-scale') || 1);
        const delta = e.deltaY > 0 ? -0.1 : 0.1;
        const newScale = Math.max(0.5, Math.min(scale + delta, 3));

        if (newScale !== scale) {
            const rect = imgElement.getBoundingClientRect();
            const mouseX = e.clientX - rect.left;
            const mouseY = e.clientY - rect.top;
            const zoomFactor = newScale / scale;
            translateX = mouseX - (mouseX - translateX) * zoomFactor;
            translateY = mouseY - (mouseY - translateY) * zoomFactor;
            scale = newScale;
            imgElement.setAttribute('data-scale', scale);
            imgElement.setAttribute('data-translate-x', translateX);
            imgElement.setAttribute('data-translate-y', translateY);
            updateImageTransform(modalId);

            if (zoomLevelElement) {
                zoomLevelElement.textContent = `${Math.round(scale * 100)}%`;
            }
        }
    });
}

function fitToContainer(modalId) {
    const imgElement = document.getElementById(`cert-img-${modalId}`);
    const containerDiv = document.getElementById(`img-container-${modalId}`);
    const zoomLevelElement = document.getElementById(`zoom-level-${modalId}`);

    if (!imgElement || !containerDiv) return;

    const containerWidth = containerDiv.clientWidth - 40;
    const containerHeight = containerDiv.clientHeight - 40;
    const imgWidth = imgElement.naturalWidth;
    const imgHeight = imgElement.naturalHeight;

    const scale = Math.min(containerWidth / imgWidth, containerHeight / imgHeight, 1);

    imgElement.setAttribute('data-scale', scale);
    imgElement.setAttribute('data-translate-x', 0);
    imgElement.setAttribute('data-translate-y', 0);
    imgElement.style.transform = `translate(0px, 0px) scale(${scale})`;

    if (zoomLevelElement) {
        zoomLevelElement.textContent = `${Math.round(scale * 100)}%`;
    }
}

function updateImageTransform(modalId) {
    const imgElement = document.getElementById(`cert-img-${modalId}`);
    if (!imgElement) return;
    const scale = parseFloat(imgElement.getAttribute('data-scale') || 1);
    const translateX = parseFloat(imgElement.getAttribute('data-translate-x') || 0);
    const translateY = parseFloat(imgElement.getAttribute('data-translate-y') || 0);
    imgElement.style.transform = `translate(${translateX}px, ${translateY}px) scale(${scale})`;
}

function zoomIn(modalId) {
    const imgElement = document.getElementById(`cert-img-${modalId}`);
    const zoomLevelElement = document.getElementById(`zoom-level-${modalId}`);
    if (!imgElement) return;
    let scale = parseFloat(imgElement.getAttribute('data-scale') || 1);
    scale = Math.min(scale + 0.1, 3);
    imgElement.setAttribute('data-scale', scale);
    updateImageTransform(modalId);
    if (zoomLevelElement) {
        zoomLevelElement.textContent = `${Math.round(scale * 100)}%`;
    }
}

function zoomOut(modalId) {
    const imgElement = document.getElementById(`cert-img-${modalId}`);
    const zoomLevelElement = document.getElementById(`zoom-level-${modalId}`);
    if (!imgElement) return;
    let scale = parseFloat(imgElement.getAttribute('data-scale') || 1);
    scale = Math.max(scale - 0.1, 0.5);
    imgElement.setAttribute('data-scale', scale);
    updateImageTransform(modalId);
    if (zoomLevelElement) {
        zoomLevelElement.textContent = `${Math.round(scale * 100)}%`;
    }
}

function resetZoom(modalId) {
    fitToContainer(modalId);
}

function openModal(id) {
    const modal = document.getElementById(`modal-${id}`);
    if (modal) {
        modal.classList.remove('hidden');
        document.body.classList.add('modal-open');
        document.body.style.overflow = 'hidden';
        resetZoom(id);
    }
}

function closeModal(id) {
    const modal = document.getElementById(`modal-${id}`);
    if (modal) {
        modal.classList.add('hidden');
        document.body.classList.remove('modal-open');
        document.body.style.overflow = 'auto';
    }
}
