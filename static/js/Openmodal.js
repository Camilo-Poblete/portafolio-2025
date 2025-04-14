 // Variables para controlar el arrastre de la imagen
 let isDragging = false;
 let startX, startY, translateX = 0, translateY = 0;

 // Función para abrir el modal
 function openModal(id) {
     document.getElementById('modal-' + id).classList.remove('hidden');
     document.body.classList.add('modal-open');
     document.body.style.overflow = 'hidden';
     resetZoom(id);
 }

 // Función para cerrar el modal
 function closeModal(id) {
     document.getElementById('modal-' + id).classList.add('hidden');
     document.body.classList.remove('modal-open');
     document.body.style.overflow = 'auto';
 }

 // Control de zoom para la imagen
 function zoomIn(id) {
     const img = document.getElementById('cert-img-' + id);
     const currentScale = img.dataset.scale ? parseFloat(img.dataset.scale) : 1;
     const newScale = currentScale + 0.2;
     img.style.transform = `translate(${translateX}px, ${translateY}px) scale(${newScale})`;
     img.dataset.scale = newScale;
     updateZoomLevel(id, newScale);
 }

 function zoomOut(id) {
     const img = document.getElementById('cert-img-' + id);
     const currentScale = img.dataset.scale ? parseFloat(img.dataset.scale) : 1;
     if (currentScale > 0.5) {
         const newScale = currentScale - 0.2;
         img.style.transform = `translate(${translateX}px, ${translateY}px) scale(${newScale})`;
         img.dataset.scale = newScale;
         updateZoomLevel(id, newScale);
     }
 }

 function resetZoom(id) {
     const img = document.getElementById('cert-img-' + id);
     img.style.transform = 'scale(1)';
     img.dataset.scale = 1;
     translateX = 0;
     translateY = 0;
     updateZoomLevel(id, 1);
 }

 // Actualizar el indicador de nivel de zoom
 function updateZoomLevel(id, scale) {
     document.getElementById('zoom-level-' + id).textContent = Math.round(scale * 100) + '%';
 }
 
 // Funciones para arrastrar la imagen (se añaden al modal específico)
 function setupDrag(id) {
     const img = document.getElementById('cert-img-' + id);
     const container = document.getElementById('img-container-' + id);
     
     img.addEventListener('mousedown', startDrag);
     img.addEventListener('touchstart', startDrag, { passive: false });
     
     function startDrag(e) {
         e.preventDefault();
         isDragging = true;
         startX = e.clientX || e.touches[0].clientX;
         startY = e.clientY || e.touches[0].clientY;
         img.style.cursor = 'grabbing';
         
         document.addEventListener('mousemove', drag);
         document.addEventListener('touchmove', drag, { passive: false });
         document.addEventListener('mouseup', endDrag);
         document.addEventListener('touchend', endDrag);
     }
     
     function drag(e) {
         if (!isDragging) return;
         e.preventDefault();
         
         const x = e.clientX || e.touches[0].clientX;
         const y = e.clientY || e.touches[0].clientY;
         
         translateX += x - startX;
         translateY += y - startY;
         
         startX = x;
         startY = y;
         
         const scale = img.dataset.scale || 1;
         img.style.transform = `translate(${translateX}px, ${translateY}px) scale(${scale})`;
     }
     
     function endDrag() {
         isDragging = false;
         img.style.cursor = 'grab';
         
         document.removeEventListener('mousemove', drag);
         document.removeEventListener('touchmove', drag);
         document.removeEventListener('mouseup', endDrag);
         document.removeEventListener('touchend', endDrag);
     }
 }