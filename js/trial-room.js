/**
 * MAQDOOM BROS DESIGNERS PVT LTD - Royal Virtual Trial Room Engine
 * Instant In-Browser Camera & Photo Try-On with AI Fit Matcher & WhatsApp Look Card Export
 * Established 1895 | Pathergatti, Hyderabad
 * 100% Client-Side · Zero Latency · No Third-Party API Bills · Privacy Safe
 */

(function () {
  'use strict';

  class RoyalTrialRoom {
    constructor() {
      this.isOpen = false;
      this.selectedOutfit = null;
      this.customerImage = null;
      this.customerImageSrc = null;
      this.isSampleModel = false;
      this.activeMode = 'tryon'; // 'tryon' | 'sideside'
      this.cameraStream = null;
      this.facingMode = 'user'; // 'user' | 'environment'
      this.showGuide = true;

      // User photo transforms
      this.transform = {
        scale: 1.0,
        offsetX: 0,
        offsetY: 0,
        rotate: 0
      };

      this.isDragging = false;
      this.dragStart = { x: 0, y: 0 };
      this.pinchStartDist = 0;
      this.initialScale = 1.0;

      // Outfits list (Sherwanis, Indo-Westerns, Bandhgalas, Kurtas)
      this.garments = [];
      this.cachedGarmentImages = new Map();

      // AI Analysis state
      this.aiAnalysis = {
        score: 98,
        undertone: 'Warm Golden',
        occasion: 'Grand Baraat / Royal Nikkah',
        contrast: 'High Royal Contrast',
        advice: 'Harmonizes with warm undertones. Pairs magnificently with Kundan Kalgi and embroidered velvet mojaris.'
      };

      // Bind methods
      this.handlePointerDown = this.handlePointerDown.bind(this);
      this.handlePointerMove = this.handlePointerMove.bind(this);
      this.handlePointerUp = this.handlePointerUp.bind(this);
      this.handleWheel = this.handleWheel.bind(this);
      this.renderCanvas = this.renderCanvas.bind(this);

      this.init();
    }

    init() {
      // Gather garments from CATALOG_DATA
      if (typeof CATALOG_DATA !== 'undefined' && Array.isArray(CATALOG_DATA)) {
        this.garments = CATALOG_DATA.filter(item =>
          ['sherwani', 'indo-western', 'bandhgala', 'kurta-sets'].includes(item.category)
        );
      }

      if (this.garments.length === 0) {
        // Fallback default list if loaded before catalog data
        this.garments = [
          {
            id: 'sherwani-16',
            title: 'The Royal Champagne Gold Zardozi Sherwani',
            priceRange: '₹38,000 – ₹58,000',
            fabric: 'Bespoke Matka Silk & Pure Jamawar',
            work: 'Handcrafted Tone-on-Tone Gold Zardozi',
            image: 'assets/catalog/sherwani-16.jpg',
            fullImage: 'assets/catalog/sherwani-16-full.jpg',
            badge: 'Imperial Premier 2026'
          }
        ];
      }

      this.selectedOutfit = this.garments[0];
      this.bindDOMElements();
      this.bindEvents();
      this.preloadGarmentImages();
    }

    bindDOMElements() {
      this.modal = document.getElementById('royalTrialModal');
      this.closeBtn = document.getElementById('trialModalCloseBtn');
      this.canvas = document.getElementById('trialStageCanvas');
      this.ctx = this.canvas ? this.canvas.getContext('2d') : null;

      // Stage wrappers
      this.stageContainer = document.getElementById('trialStageContainer');
      this.emptyStage = document.getElementById('trialEmptyStage');
      this.cameraViewport = document.getElementById('trialCameraViewport');
      this.videoElem = document.getElementById('trialCameraVideo');
      this.stageOverlayControls = document.getElementById('trialStageControls');

      // Empty stage action buttons
      this.startCameraBtn = document.getElementById('trialStartCameraBtn');
      this.uploadFileBtn = document.getElementById('trialUploadFileBtn');
      this.sampleModelBtn = document.getElementById('trialSampleModelBtn');
      this.fileInput = document.getElementById('trialFileInput');

      // Camera HUD buttons
      this.snapBtn = document.getElementById('trialSnapBtn');
      this.flipCameraBtn = document.getElementById('trialFlipCameraBtn');
      this.cancelCameraBtn = document.getElementById('trialCancelCameraBtn');

      // Mode toggles
      this.modeTryOnBtn = document.getElementById('trialModeTryOnBtn');
      this.modeSideSideBtn = document.getElementById('trialModeSideSideBtn');

      // Transform controls
      this.zoomSlider = document.getElementById('trialZoomSlider');
      this.zoomInBtn = document.getElementById('trialZoomInBtn');
      this.zoomOutBtn = document.getElementById('trialZoomOutBtn');
      this.resetFitBtn = document.getElementById('trialResetFitBtn');
      this.retakeBtn = document.getElementById('trialRetakeBtn');
      this.toggleGuideBtn = document.getElementById('trialToggleGuideBtn');

      // Wardrobe carousel
      this.wardrobeCarousel = document.getElementById('trialWardrobeCarousel');

      // Outfit details
      this.outfitTitleElem = document.getElementById('trialOutfitTitle');
      this.outfitBadgeElem = document.getElementById('trialOutfitBadge');
      this.outfitPriceElem = document.getElementById('trialOutfitPrice');
      this.outfitFabricElem = document.getElementById('trialOutfitFabric');
      this.outfitWorkElem = document.getElementById('trialOutfitWork');

      // AI match panel
      this.aiScoreVal = document.getElementById('trialAiScoreVal');
      this.aiScoreBar = document.getElementById('trialAiScoreBar');
      this.aiUndertone = document.getElementById('trialAiUndertone');
      this.aiOccasion = document.getElementById('trialAiOccasion');
      this.aiAdviceText = document.getElementById('trialAiAdviceText');
      this.aiAccessoryTip = document.getElementById('trialAiAccessoryTip');

      // Action buttons
      this.whatsAppBtn = document.getElementById('trialWhatsAppBtn');
      this.downloadBtn = document.getElementById('trialDownloadBtn');
      this.bookFittingBtn = document.getElementById('trialBookFittingBtn');

      // Site triggers
      this.navBtn = document.getElementById('navTrialRoomBtn');
      this.conciergeBtn = document.getElementById('conciergeTrialBtn');
      this.floatingTrigger = document.getElementById('trialRoomFloatingTrigger');
    }

    bindEvents() {
      // Global triggers
      if (this.navBtn) this.navBtn.addEventListener('click', () => this.open());
      if (this.conciergeBtn) this.conciergeBtn.addEventListener('click', () => this.open());
      if (this.floatingTrigger) this.floatingTrigger.addEventListener('click', () => this.open());
      if (this.closeBtn) this.closeBtn.addEventListener('click', () => this.close());

      // Close on backdrop click
      if (this.modal) {
        this.modal.addEventListener('click', (e) => {
          if (e.target === this.modal) this.close();
        });
      }

      // Keyboard Esc to close
      document.addEventListener('keydown', (e) => {
        if (this.isOpen && e.key === 'Escape') {
          this.close();
        }
      });

      // Photo Sources
      if (this.startCameraBtn) {
        this.startCameraBtn.addEventListener('click', () => this.startLiveCamera());
      }
      if (this.uploadFileBtn) {
        this.uploadFileBtn.addEventListener('click', () => {
          if (this.fileInput) this.fileInput.click();
        });
      }
      if (this.fileInput) {
        this.fileInput.addEventListener('change', (e) => this.handleFileUpload(e));
      }
      if (this.sampleModelBtn) {
        this.sampleModelBtn.addEventListener('click', () => this.loadSampleModel());
      }

      // Camera HUD
      if (this.snapBtn) this.snapBtn.addEventListener('click', () => this.captureSnapshot());
      if (this.flipCameraBtn) this.flipCameraBtn.addEventListener('click', () => this.flipCamera());
      if (this.cancelCameraBtn) this.cancelCameraBtn.addEventListener('click', () => this.stopLiveCamera());

      // Mode toggles
      if (this.modeTryOnBtn) {
        this.modeTryOnBtn.addEventListener('click', () => this.setMode('tryon'));
      }
      if (this.modeSideSideBtn) {
        this.modeSideSideBtn.addEventListener('click', () => this.setMode('sideside'));
      }

      // Transform & Canvas Controls
      if (this.zoomSlider) {
        this.zoomSlider.addEventListener('input', (e) => {
          this.transform.scale = parseFloat(e.target.value);
          this.requestRender();
        });
      }
      if (this.zoomInBtn) {
        this.zoomInBtn.addEventListener('click', () => {
          this.transform.scale = Math.min(2.5, this.transform.scale + 0.1);
          if (this.zoomSlider) this.zoomSlider.value = this.transform.scale;
          this.requestRender();
        });
      }
      if (this.zoomOutBtn) {
        this.zoomOutBtn.addEventListener('click', () => {
          this.transform.scale = Math.max(0.4, this.transform.scale - 0.1);
          if (this.zoomSlider) this.zoomSlider.value = this.transform.scale;
          this.requestRender();
        });
      }
      if (this.resetFitBtn) {
        this.resetFitBtn.addEventListener('click', () => this.resetTransform());
      }
      if (this.retakeBtn) {
        this.retakeBtn.addEventListener('click', () => this.showEmptyState());
      }
      if (this.toggleGuideBtn) {
        this.toggleGuideBtn.addEventListener('click', () => {
          this.showGuide = !this.showGuide;
          this.toggleGuideBtn.classList.toggle('active', this.showGuide);
          this.requestRender();
        });
      }

      // Canvas Pointer Gestures (Drag to position & pinch zoom)
      if (this.canvas) {
        this.canvas.addEventListener('pointerdown', this.handlePointerDown);
        window.addEventListener('pointermove', this.handlePointerMove);
        window.addEventListener('pointerup', this.handlePointerUp);
        window.addEventListener('pointercancel', this.handlePointerUp);
        this.canvas.addEventListener('wheel', this.handleWheel, { passive: false });
      }

      // Conversion actions
      if (this.whatsAppBtn) {
        this.whatsAppBtn.addEventListener('click', () => this.sendToWhatsAppTailor());
      }
      if (this.downloadBtn) {
        this.downloadBtn.addEventListener('click', () => this.downloadRoyalLookCard());
      }
      if (this.bookFittingBtn) {
        this.bookFittingBtn.addEventListener('click', () => {
          this.close();
          const bookingSec = document.getElementById('booking');
          if (bookingSec) {
            bookingSec.scrollIntoView({ behavior: 'smooth', block: 'start' });
            // Pre-select outfit in notes if field exists
            const notesField = document.getElementById('bookNotes');
            if (notesField && this.selectedOutfit) {
              notesField.value = `Selected in AI Royal Trial Room: ${this.selectedOutfit.title} (${this.selectedOutfit.id})`;
            }
          }
        });
      }

      // Delegate Catalog Card "Try On" Buttons
      document.addEventListener('click', (e) => {
        const tryBtn = e.target.closest('.btn-trial-open');
        if (tryBtn) {
          e.preventDefault();
          e.stopPropagation();
          const outfitId = tryBtn.getAttribute('data-id');
          this.open(outfitId);
        }
      });
    }

    preloadGarmentImages() {
      this.garments.forEach(item => {
        const fullSrc = item.fullImage || item.image;
        if (fullSrc && !this.cachedGarmentImages.has(fullSrc)) {
          const img = new Image();
          img.src = fullSrc;
          this.cachedGarmentImages.set(fullSrc, img);
        }
      });
    }

    open(outfitId) {
      if (!this.modal) return;

      if (outfitId) {
        const found = this.garments.find(g => g.id === outfitId);
        if (found) this.selectedOutfit = found;
      } else if (!this.selectedOutfit && this.garments.length > 0) {
        this.selectedOutfit = this.garments[0];
      }

      this.isOpen = true;
      this.modal.style.display = 'flex';
      this.modal.classList.add('trial-open');
      document.body.style.overflow = 'hidden';

      this.renderWardrobeCarousel();
      this.updateOutfitDetails();

      // Setup initial canvas resolution
      this.setupCanvasDimensions();

      if (!this.customerImage) {
        this.showEmptyState();
      } else {
        this.hideEmptyState();
        this.requestRender();
      }

      this.runAIAnalysis();
    }

    close() {
      if (!this.modal) return;
      this.isOpen = false;
      this.modal.classList.remove('trial-open');
      this.modal.style.display = 'none';
      document.body.style.overflow = '';
      this.stopLiveCamera();
    }

    setupCanvasDimensions() {
      if (!this.canvas) return;
      const rect = this.canvas.getBoundingClientRect();
      const dpr = Math.min(window.devicePixelRatio || 1, 2);
      const width = rect.width > 0 ? rect.width : 540;
      const height = rect.height > 0 ? rect.height : 720;

      this.canvas.width = Math.round(width * dpr);
      this.canvas.height = Math.round(height * dpr);
      if (this.ctx) {
        this.ctx.resetTransform ? this.ctx.resetTransform() : this.ctx.setTransform(1, 0, 0, 1, 0, 0);
        this.ctx.scale(dpr, dpr);
      }
      this.canvasLogicalWidth = width;
      this.canvasLogicalHeight = height;
    }

    setMode(mode) {
      this.activeMode = mode;
      if (this.modeTryOnBtn) this.modeTryOnBtn.classList.toggle('active', mode === 'tryon');
      if (this.modeSideSideBtn) this.modeSideSideBtn.classList.toggle('active', mode === 'sideside');
      this.requestRender();
    }

    showEmptyState() {
      this.stopLiveCamera();
      if (this.emptyStage) this.emptyStage.style.display = 'flex';
      if (this.cameraViewport) this.cameraViewport.style.display = 'none';
      if (this.stageOverlayControls) this.stageOverlayControls.style.display = 'none';
    }

    hideEmptyState() {
      if (this.emptyStage) this.emptyStage.style.display = 'none';
      if (this.cameraViewport) this.cameraViewport.style.display = 'none';
      if (this.stageOverlayControls) this.stageOverlayControls.style.display = 'flex';
    }

    // ==========================================
    // CAMERA & FILE UPLOAD HANDLERS
    // ==========================================
    async startLiveCamera() {
      if (!navigator.mediaDevices || !navigator.mediaDevices.getUserMedia) {
        // Fallback for older browsers or restricted permissions: trigger file picker
        if (this.fileInput) {
          this.fileInput.setAttribute('capture', 'user');
          this.fileInput.click();
        }
        return;
      }

      try {
        if (this.emptyStage) this.emptyStage.style.display = 'none';
        if (this.cameraViewport) this.cameraViewport.style.display = 'flex';

        if (this.cameraStream) {
          this.cameraStream.getTracks().forEach(t => t.stop());
        }

        const constraints = {
          video: {
            facingMode: this.facingMode,
            width: { ideal: 1280 },
            height: { ideal: 720 }
          },
          audio: false
        };

        this.cameraStream = await navigator.mediaDevices.getUserMedia(constraints);
        if (this.videoElem) {
          this.videoElem.srcObject = this.cameraStream;
          this.videoElem.play();
        }
      } catch (err) {
        console.warn('Camera access denied or unavailable, falling back to file picker:', err);
        alert('Camera access was not permitted. Please upload a photo from your device.');
        if (this.cameraViewport) this.cameraViewport.style.display = 'none';
        if (this.emptyStage) this.emptyStage.style.display = 'flex';
        if (this.fileInput) this.fileInput.click();
      }
    }

    flipCamera() {
      this.facingMode = this.facingMode === 'user' ? 'environment' : 'user';
      this.startLiveCamera();
    }

    stopLiveCamera() {
      if (this.cameraStream) {
        this.cameraStream.getTracks().forEach(t => t.stop());
        this.cameraStream = null;
      }
      if (this.videoElem) {
        this.videoElem.srcObject = null;
      }
      if (this.cameraViewport) {
        this.cameraViewport.style.display = 'none';
      }
    }

    captureSnapshot() {
      if (!this.videoElem || !this.videoElem.videoWidth) return;

      const snapCanvas = document.createElement('canvas');
      snapCanvas.width = this.videoElem.videoWidth;
      snapCanvas.height = this.videoElem.videoHeight;
      const snapCtx = snapCanvas.getContext('2d');

      // Mirror front camera
      if (this.facingMode === 'user') {
        snapCtx.translate(snapCanvas.width, 0);
        snapCtx.scale(-1, 1);
      }
      snapCtx.drawImage(this.videoElem, 0, 0);

      const dataUrl = snapCanvas.toDataURL('image/jpeg', 0.92);
      this.stopLiveCamera();
      this.setCustomerPhoto(dataUrl, false);
    }

    handleFileUpload(e) {
      const file = e.target.files && e.target.files[0];
      if (!file) return;

      const reader = new FileReader();
      reader.onload = (event) => {
        this.setCustomerPhoto(event.target.result, false);
      };
      reader.readAsDataURL(file);
      // Reset input value so re-uploading same file works
      e.target.value = '';
    }

    loadSampleModel() {
      const sampleModelSrc = 'assets/brand/sample-groom.jpg';
      this.setCustomerPhoto(sampleModelSrc, true);
    }

    setCustomerPhoto(src, isSample = false) {
      const img = new Image();
      img.onload = () => {
        this.customerImage = img;
        this.customerImageSrc = src;
        this.isSampleModel = isSample;
        this.resetTransform();
        this.hideEmptyState();
        this.runAIAnalysis();
        this.requestRender();
      };
      img.src = src;
    }

    resetTransform() {
      this.transform = {
        scale: 1.0,
        offsetX: 0,
        offsetY: 0,
        rotate: 0
      };
      if (this.zoomSlider) this.zoomSlider.value = 1.0;
      this.requestRender();
    }

    // ==========================================
    // CANVAS TOUCH / POINTER INTERACTIONS
    // ==========================================
    handlePointerDown(e) {
      if (!this.customerImage || this.activeMode !== 'tryon') return;
      this.isDragging = true;
      this.dragStart = { x: e.clientX, y: e.clientY };
      if (this.canvas) this.canvas.setPointerCapture(e.pointerId);
    }

    handlePointerMove(e) {
      if (!this.isDragging || !this.customerImage) return;
      const dx = e.clientX - this.dragStart.x;
      const dy = e.clientY - this.dragStart.y;
      this.dragStart = { x: e.clientX, y: e.clientY };

      this.transform.offsetX += dx;
      this.transform.offsetY += dy;
      this.requestRender();
    }

    handlePointerUp(e) {
      if (this.isDragging) {
        this.isDragging = false;
        try {
          if (this.canvas && e.pointerId) this.canvas.releasePointerCapture(e.pointerId);
        } catch (_) {}
      }
    }

    handleWheel(e) {
      if (!this.customerImage || this.activeMode !== 'tryon') return;
      e.preventDefault();
      const zoomFactor = e.deltaY < 0 ? 1.05 : 0.95;
      this.transform.scale = Math.max(0.4, Math.min(2.5, this.transform.scale * zoomFactor));
      if (this.zoomSlider) this.zoomSlider.value = this.transform.scale;
      this.requestRender();
    }

    requestRender() {
      if (!this.renderRequested) {
        this.renderRequested = true;
        requestAnimationFrame(() => {
          this.renderCanvas();
          this.renderRequested = false;
        });
      }
    }

    // ==========================================
    // CANVAS COMPOSITOR ENGINE
    // ==========================================
    renderCanvas() {
      if (!this.ctx || !this.canvas) return;
      const w = this.canvasLogicalWidth || (this.canvas.width / (window.devicePixelRatio || 1));
      const h = this.canvasLogicalHeight || (this.canvas.height / (window.devicePixelRatio || 1));

      // 1. Draw Royal Atelier Background
      const bgGrad = this.ctx.createRadialGradient(w / 2, h * 0.4, 40, w / 2, h / 2, Math.max(w, h));
      bgGrad.addColorStop(0, '#0f2922');
      bgGrad.addColorStop(0.7, '#071914');
      bgGrad.addColorStop(1, '#030c09');
      this.ctx.fillStyle = bgGrad;
      this.ctx.fillRect(0, 0, w, h);

      if (!this.customerImage) return;

      if (this.activeMode === 'tryon') {
        this.renderTryOnMode(w, h);
      } else {
        this.renderSideSideMode(w, h);
      }

      // Draw subtle royal border inside stage
      this.ctx.strokeStyle = 'rgba(212, 175, 55, 0.4)';
      this.ctx.lineWidth = 1.5;
      this.ctx.strokeRect(8, 8, w - 16, h - 16);

      // Royal corner filigree accents
      this.drawCornerAccents(w, h);
    }

    renderTryOnMode(w, h) {
      this.ctx.save();

      // Clip inside inner border
      this.ctx.beginPath();
      this.ctx.rect(10, 10, w - 20, h - 20);
      this.ctx.clip();

      // 1. Render Customer Photo with user transform
      const img = this.customerImage;
      const imgAspect = img.width / img.height;
      let drawW = w;
      let drawH = w / imgAspect;
      if (drawH < h) {
        drawH = h;
        drawW = h * imgAspect;
      }

      const centerX = w / 2 + this.transform.offsetX;
      const centerY = h / 2 + this.transform.offsetY;

      this.ctx.save();
      this.ctx.translate(centerX, centerY);
      this.ctx.rotate((this.transform.rotate * Math.PI) / 180);
      this.ctx.scale(this.transform.scale, this.transform.scale);
      this.ctx.drawImage(img, -drawW / 2, -drawH / 2, drawW, drawH);
      this.ctx.restore();

      // 2. Render Garment Mannequin Overlay
      if (this.selectedOutfit) {
        const garmentSrc = this.selectedOutfit.fullImage || this.selectedOutfit.image;
        let garmentImg = this.cachedGarmentImages.get(garmentSrc);

        if (!garmentImg) {
          garmentImg = new Image();
          garmentImg.src = garmentSrc;
          this.cachedGarmentImages.set(garmentSrc, garmentImg);
        }

        if (garmentImg.complete && garmentImg.naturalWidth > 0) {
          const gAspect = garmentImg.naturalWidth / garmentImg.naturalHeight;
          const gH = h * 0.92;
          const gW = gH * gAspect;
          const gX = (w - gW) / 2;
          const gY = h - gH + 10;

          // Soft subtle shadow underneath garment
          this.ctx.shadowColor = 'rgba(0, 0, 0, 0.6)';
          this.ctx.shadowBlur = 24;
          this.ctx.drawImage(garmentImg, gX, gY, gW, gH);
          this.ctx.shadowBlur = 0;
        }
      }

      // 3. Render Face & Collar Alignment Guide (if toggled on)
      if (this.showGuide) {
        this.drawAlignmentGuide(w, h);
      }

      this.ctx.restore();
    }

    renderSideSideMode(w, h) {
      this.ctx.save();

      // Clip inner
      this.ctx.beginPath();
      this.ctx.rect(10, 10, w - 20, h - 20);
      this.ctx.clip();

      const halfW = (w - 20) / 2;

      // --- Left: Customer Photo ---
      this.ctx.save();
      this.ctx.beginPath();
      this.ctx.rect(10, 10, halfW, h - 20);
      this.ctx.clip();

      const cImg = this.customerImage;
      const cAspect = cImg.width / cImg.height;
      let cDrawW = halfW;
      let cDrawH = halfW / cAspect;
      if (cDrawH < h - 20) {
        cDrawH = h - 20;
        cDrawW = (h - 20) * cAspect;
      }
      this.ctx.drawImage(cImg, 10 + (halfW - cDrawW) / 2, 10 + (h - 20 - cDrawH) / 2, cDrawW, cDrawH);

      // Label
      this.ctx.fillStyle = 'rgba(7, 25, 20, 0.85)';
      this.ctx.fillRect(16, h - 46, halfW - 12, 28);
      this.ctx.fillStyle = '#f3e5ab';
      this.ctx.font = '600 11px Cinzel, serif';
      this.ctx.textAlign = 'center';
      this.ctx.fillText('YOUR PHOTO', 10 + halfW / 2, h - 28);
      this.ctx.restore();

      // --- Right: Royal Garment Full View ---
      this.ctx.save();
      this.ctx.beginPath();
      this.ctx.rect(10 + halfW, 10, halfW, h - 20);
      this.ctx.clip();

      if (this.selectedOutfit) {
        const garmentSrc = this.selectedOutfit.fullImage || this.selectedOutfit.image;
        let garmentImg = this.cachedGarmentImages.get(garmentSrc);
        if (garmentImg && garmentImg.complete && garmentImg.naturalWidth > 0) {
          const gAspect = garmentImg.naturalWidth / garmentImg.naturalHeight;
          let gDrawH = h - 20;
          let gDrawW = gDrawH * gAspect;
          if (gDrawW > halfW) {
            gDrawW = halfW;
            gDrawH = halfW / gAspect;
          }
          this.ctx.drawImage(garmentImg, 10 + halfW + (halfW - gDrawW) / 2, 10 + (h - 20 - gDrawH) / 2, gDrawW, gDrawH);
        }
      }

      // Label
      this.ctx.fillStyle = 'rgba(7, 25, 20, 0.85)';
      this.ctx.fillRect(10 + halfW + 6, h - 46, halfW - 12, 28);
      this.ctx.fillStyle = '#d4af37';
      this.ctx.font = '600 11px Cinzel, serif';
      this.ctx.textAlign = 'center';
      this.ctx.fillText('NIZAMI MASTERPIECE', 10 + halfW + halfW / 2, h - 28);
      this.ctx.restore();

      // Center Divider line & crest
      this.ctx.strokeStyle = 'rgba(212, 175, 55, 0.8)';
      this.ctx.lineWidth = 2;
      this.ctx.beginPath();
      this.ctx.moveTo(10 + halfW, 10);
      this.ctx.lineTo(10 + halfW, h - 10);
      this.ctx.stroke();

      // Center Medallion
      const midX = 10 + halfW;
      const midY = h * 0.45;
      this.ctx.fillStyle = '#071914';
      this.ctx.beginPath();
      this.ctx.arc(midX, midY, 22, 0, Math.PI * 2);
      this.ctx.fill();
      this.ctx.strokeStyle = '#d4af37';
      this.ctx.lineWidth = 1.5;
      this.ctx.stroke();

      this.ctx.fillStyle = '#ffe082';
      this.ctx.font = '16px serif';
      this.ctx.textAlign = 'center';
      this.ctx.textBaseline = 'middle';
      this.ctx.fillText('⚜️', midX, midY);

      this.ctx.restore();
    }

    drawAlignmentGuide(w, h) {
      this.ctx.save();
      this.ctx.strokeStyle = 'rgba(212, 175, 55, 0.55)';
      this.ctx.lineWidth = 1.2;
      this.ctx.setLineDash([5, 5]);

      const headCenterX = w / 2;
      const headCenterY = h * 0.28;
      const headRadiusX = w * 0.16;
      const headRadiusY = h * 0.15;

      // Face Oval Guide
      this.ctx.beginPath();
      this.ctx.ellipse(headCenterX, headCenterY, headRadiusX, headRadiusY, 0, 0, Math.PI * 2);
      this.ctx.stroke();

      // Eye Level Line
      this.ctx.beginPath();
      this.ctx.moveTo(headCenterX - headRadiusX * 0.7, headCenterY - headRadiusY * 0.15);
      this.ctx.lineTo(headCenterX + headRadiusX * 0.7, headCenterY - headRadiusY * 0.15);
      this.ctx.stroke();

      // Collar Notch Guide
      this.ctx.setLineDash([]);
      this.ctx.strokeStyle = 'rgba(255, 224, 130, 0.75)';
      this.ctx.lineWidth = 1.5;
      this.ctx.beginPath();
      this.ctx.moveTo(headCenterX - w * 0.12, headCenterY + headRadiusY + 10);
      this.ctx.quadraticCurveTo(headCenterX, headCenterY + headRadiusY + 30, headCenterX + w * 0.12, headCenterY + headRadiusY + 10);
      this.ctx.stroke();

      // Guide label
      this.ctx.fillStyle = 'rgba(243, 229, 171, 0.85)';
      this.ctx.font = '500 10px Plus Jakarta Sans, sans-serif';
      this.ctx.textAlign = 'center';
      this.ctx.fillText('Align Chin with Collar Rim', headCenterX, headCenterY + headRadiusY + 46);

      this.ctx.restore();
    }

    drawCornerAccents(w, h) {
      this.ctx.save();
      this.ctx.strokeStyle = 'rgba(212, 175, 55, 0.7)';
      this.ctx.lineWidth = 1.5;
      const s = 14;

      // Top Left
      this.ctx.beginPath();
      this.ctx.moveTo(8, 8 + s);
      this.ctx.lineTo(8, 8);
      this.ctx.lineTo(8 + s, 8);
      this.ctx.stroke();

      // Top Right
      this.ctx.beginPath();
      this.ctx.moveTo(w - 8 - s, 8);
      this.ctx.lineTo(w - 8, 8);
      this.ctx.lineTo(w - 8, 8 + s);
      this.ctx.stroke();

      // Bottom Left
      this.ctx.beginPath();
      this.ctx.moveTo(8, h - 8 - s);
      this.ctx.lineTo(8, h - 8);
      this.ctx.lineTo(8 + s, h - 8);
      this.ctx.stroke();

      // Bottom Right
      this.ctx.beginPath();
      this.ctx.moveTo(w - 8 - s, h - 8);
      this.ctx.lineTo(w - 8, h - 8);
      this.ctx.lineTo(w - 8, h - 8 - s);
      this.ctx.stroke();

      this.ctx.restore();
    }

    // ==========================================
    // AI STYLE & FIT ANALYSIS ENGINE
    // ==========================================
    runAIAnalysis() {
      if (!this.selectedOutfit) return;

      // Default high suitability
      let score = 96;
      let undertone = 'Warm Golden';
      let contrast = 'Royal Harmony';

      if (this.customerImage) {
        // Fast client-side image luminance and warmth calculation
        try {
          const sampleCvs = document.createElement('canvas');
          sampleCvs.width = 40;
          sampleCvs.height = 40;
          const sCtx = sampleCvs.getContext('2d');
          sCtx.drawImage(this.customerImage, 0, 0, 40, 40);
          const p = sCtx.getImageData(10, 10, 20, 20).data;

          let rSum = 0, gSum = 0, bSum = 0;
          const count = p.length / 4;
          for (let i = 0; i < p.length; i += 4) {
            rSum += p[i];
            gSum += p[i + 1];
            bSum += p[i + 2];
          }
          const rAvg = rSum / count;
          const gAvg = gSum / count;
          const bAvg = bSum / count;
          const lum = 0.299 * rAvg + 0.587 * gAvg + 0.114 * bAvg;

          if (rAvg > bAvg + 15 && gAvg > bAvg) {
            undertone = 'Warm Golden';
          } else if (lum > 140) {
            undertone = 'Cool Pearl / Rosy';
          } else {
            undertone = 'Rich Bronze';
          }

          // Dynamic score variations based on piece color and undertone
          const colorText = (this.selectedOutfit.color || this.selectedOutfit.title || '').toLowerCase();
          if (undertone === 'Warm Golden' && (colorText.includes('gold') || colorText.includes('crimson') || colorText.includes('champagne'))) {
            score = 99;
          } else if (undertone === 'Cool Pearl / Rosy' && (colorText.includes('lavender') || colorText.includes('lilac') || colorText.includes('ivory') || colorText.includes('blue'))) {
            score = 98;
          } else if (undertone === 'Rich Bronze' && (colorText.includes('navy') || colorText.includes('obsidian') || colorText.includes('peacock') || colorText.includes('gold'))) {
            score = 98;
          } else {
            score = 96;
          }
        } catch (_) {
          score = 97;
        }
      }

      const occasion = this.selectedOutfit.occasion || 'Royal Baraat / Grand Nikkah / Wedding Gala';
      const advice = `Artisanal match: The ${this.selectedOutfit.work || 'hand zardozi'} against ${this.selectedOutfit.fabric || 'pure silk'} complements ${undertone} tones for evening regal ceremonies.`;
      const accessoryTip = `Royal Pairing: Pair with Handcrafted Velvet Mojaris (acc-02) and Nizami Kundan Kalgi Safa (acc-01) for the imperial court groom silhouette.`;

      this.aiAnalysis = {
        score,
        undertone,
        occasion,
        contrast,
        advice,
        accessoryTip
      };

      this.renderAIDisplay();
    }

    renderAIDisplay() {
      if (this.aiScoreVal) this.aiScoreVal.textContent = `${this.aiAnalysis.score}%`;
      if (this.aiScoreBar) this.aiScoreBar.style.width = `${this.aiAnalysis.score}%`;
      if (this.aiUndertone) this.aiUndertone.textContent = `Tone: ${this.aiAnalysis.undertone}`;
      if (this.aiOccasion) this.aiOccasion.textContent = `Occasion: ${this.aiAnalysis.occasion.split('/')[0].trim()}`;
      if (this.aiAdviceText) this.aiAdviceText.textContent = this.aiAnalysis.advice;
      if (this.aiAccessoryTip) this.aiAccessoryTip.textContent = this.aiAnalysis.accessoryTip;
    }

    // ==========================================
    // WARDROBE CAROUSEL
    // ==========================================
    renderWardrobeCarousel() {
      if (!this.wardrobeCarousel) return;
      this.wardrobeCarousel.innerHTML = '';

      this.garments.forEach(item => {
        const card = document.createElement('div');
        card.className = 'trial-outfit-chip';
        if (this.selectedOutfit && this.selectedOutfit.id === item.id) {
          card.classList.add('active');
        }

        const thumbSrc = item.image;
        card.innerHTML = `
          <div class="trial-chip-thumb">
            <img src="${thumbSrc}" alt="${item.title}" loading="lazy" />
            <span class="trial-chip-badge">${item.badge || item.categoryLabel || '2026'}</span>
          </div>
          <div class="trial-chip-title">${item.title}</div>
        `;

        card.addEventListener('click', () => {
          this.selectOutfit(item);
        });

        this.wardrobeCarousel.appendChild(card);
      });
    }

    selectOutfit(item) {
      this.selectedOutfit = item;
      document.querySelectorAll('.trial-outfit-chip').forEach(chip => {
        chip.classList.toggle('active', chip.querySelector('.trial-chip-title').textContent === item.title);
      });

      this.updateOutfitDetails();
      this.runAIAnalysis();
      this.requestRender();
    }

    updateOutfitDetails() {
      if (!this.selectedOutfit) return;
      if (this.outfitTitleElem) this.outfitTitleElem.textContent = this.selectedOutfit.title;
      if (this.outfitBadgeElem) this.outfitBadgeElem.textContent = `⚜️ ${this.selectedOutfit.badge || this.selectedOutfit.categoryLabel || 'Imperial 2026'}`;
      if (this.outfitPriceElem) {
        const priceStr = window.GeoEngine ? window.GeoEngine.formatCurrencyRange(this.selectedOutfit.priceRange) : this.selectedOutfit.priceRange;
        this.outfitPriceElem.textContent = priceStr;
      }
      if (this.outfitFabricElem) this.outfitFabricElem.textContent = this.selectedOutfit.fabric || 'Bespoke Matka Silk';
      if (this.outfitWorkElem) this.outfitWorkElem.textContent = this.selectedOutfit.work || 'Handcrafted Tone-on-Tone Zardozi';
    }

    // ==========================================
    // WHATSAPP TAILOR CONSULTATION
    // ==========================================
    sendToWhatsAppTailor() {
      if (!this.selectedOutfit) return;

      const fullImgSrc = this.selectedOutfit.fullImage || this.selectedOutfit.image;
      const itemImageUrl = (typeof window !== 'undefined' && window.location && window.location.origin && window.location.origin.startsWith('http') && !window.location.origin.includes('localhost'))
        ? `${window.location.origin}/${(fullImgSrc || '').replace(/^\/+/, '')}`
        : `https://maqdoom-brothers-website.vercel.app/${(fullImgSrc || '').replace(/^\/+/, '')}`;

      const phone = '918686684144';
      const text = encodeURIComponent(
        `👑 *Royal Bespoke Fitting Consultation*\n` +
        `Assalamu Alaikum / Greetings Maqdoom Brothers,\n\n` +
        `I just tried on an ensemble in your *AI Royal Virtual Trial Room*:\n\n` +
        `⚜️ *Garment:* ${this.selectedOutfit.title}\n` +
        `🏷️ *Item Code:* ${this.selectedOutfit.id}\n` +
        `💰 *Price Range:* ${this.selectedOutfit.priceRange}\n` +
        `🧵 *Fabric:* ${this.selectedOutfit.fabric}\n` +
        `✨ *AI Suitability:* ${this.aiAnalysis.score}% Match (${this.aiAnalysis.undertone} undertone)\n` +
        `📸 *Outfit Reference:* ${itemImageUrl}\n\n` +
        `I would like to consult with your Master Tailor regarding bespoke measurements, fabric trial, and booking an atelier appointment.`
      );

      const url = `https://wa.me/${phone}?text=${text}`;
      window.open(url, '_blank', 'noopener,noreferrer');
    }

    // ==========================================
    // DOWNLOAD HIGH-RES ROYAL LOOK CARD
    // ==========================================
    downloadRoyalLookCard() {
      if (!this.selectedOutfit) return;

      const cardCanvas = document.createElement('canvas');
      cardCanvas.width = 1200;
      cardCanvas.height = 1600;
      const cCtx = cardCanvas.getContext('2d');

      // 1. Royal Emerald Damask Background
      const bg = cCtx.createLinearGradient(0, 0, 1200, 1600);
      bg.addColorStop(0, '#04100c');
      bg.addColorStop(0.3, '#08241c');
      bg.addColorStop(0.7, '#071914');
      bg.addColorStop(1, '#020907');
      cCtx.fillStyle = bg;
      cCtx.fillRect(0, 0, 1200, 1600);

      // Gold Outer Border
      cCtx.strokeStyle = '#d4af37';
      cCtx.lineWidth = 4;
      cCtx.strokeRect(30, 30, 1140, 1540);

      // Inner Fine Double Border
      cCtx.strokeStyle = 'rgba(212, 175, 55, 0.4)';
      cCtx.lineWidth = 1.5;
      cCtx.strokeRect(42, 42, 1116, 1516);

      // 2. Header: Royal Crest & Proclamation
      cCtx.fillStyle = '#d4af37';
      cCtx.font = '28px serif';
      cCtx.textAlign = 'center';
      cCtx.fillText('⚜️', 600, 95);

      cCtx.fillStyle = '#f3e5ab';
      cCtx.font = '700 36px Cinzel, serif';
      cCtx.letterSpacing = '4px';
      cCtx.fillText('MAQDOOM BROS', 600, 145);

      cCtx.fillStyle = '#d4af37';
      cCtx.font = '500 16px Plus Jakarta Sans, sans-serif';
      cCtx.letterSpacing = '2px';
      cCtx.fillText('COURT CLOTHIERS TO THE NIZAMS · EST. 1895 · HYDERABAD', 600, 175);

      cCtx.strokeStyle = 'rgba(212, 175, 55, 0.5)';
      cCtx.lineWidth = 1;
      cCtx.beginPath();
      cCtx.moveTo(350, 195);
      cCtx.lineTo(850, 195);
      cCtx.stroke();

      // 3. Center Mirror Frame: Try-On Look
      const stageW = 860;
      const stageH = 920;
      const stageX = (1200 - stageW) / 2;
      const stageY = 220;

      // Inset Stage Shadow & Border
      cCtx.fillStyle = '#071914';
      cCtx.fillRect(stageX, stageY, stageW, stageH);
      cCtx.strokeStyle = 'rgba(212, 175, 55, 0.6)';
      cCtx.lineWidth = 2;
      cCtx.strokeRect(stageX, stageY, stageW, stageH);

      // Render Stage Snapshot
      if (this.canvas) {
        cCtx.drawImage(this.canvas, stageX + 4, stageY + 4, stageW - 8, stageH - 8);
      }

      // AI Match Badge overlay on look
      cCtx.fillStyle = 'rgba(7, 25, 20, 0.9)';
      cCtx.fillRect(stageX + 24, stageY + 24, 230, 48);
      cCtx.strokeStyle = '#d4af37';
      cCtx.lineWidth = 1.5;
      cCtx.strokeRect(stageX + 24, stageY + 24, 230, 48);
      cCtx.fillStyle = '#ffe082';
      cCtx.font = '700 16px Cinzel, serif';
      cCtx.textAlign = 'left';
      cCtx.fillText(`⚜️ ${this.aiAnalysis.score}% ROYAL MATCH`, stageX + 40, stageY + 54);

      // 4. Garment Spec Section
      const infoY = 1180;
      cCtx.fillStyle = '#ffffff';
      cCtx.font = '700 32px Playfair Display, serif';
      cCtx.textAlign = 'center';
      cCtx.fillText(this.selectedOutfit.title, 600, infoY);

      cCtx.fillStyle = '#d4af37';
      cCtx.font = '600 20px Cinzel, serif';
      cCtx.fillText(`${this.selectedOutfit.id.toUpperCase()}  ·  ${this.selectedOutfit.priceRange}`, 600, infoY + 38);

      cCtx.fillStyle = '#c3d3cc';
      cCtx.font = '400 16px Plus Jakarta Sans, sans-serif';
      cCtx.fillText(`Fabric: ${this.selectedOutfit.fabric}  |  Craft: ${this.selectedOutfit.work}`, 600, infoY + 70);

      cCtx.fillStyle = '#f3e5ab';
      cCtx.font = 'italic 16px Playfair Display, serif';
      cCtx.fillText(`"${this.aiAnalysis.advice}"`, 600, infoY + 104);

      // 5. Card Footer
      cCtx.strokeStyle = 'rgba(212, 175, 55, 0.3)';
      cCtx.beginPath();
      cCtx.moveTo(200, 1420);
      cCtx.lineTo(1000, 1420);
      cCtx.stroke();

      cCtx.fillStyle = '#d4af37';
      cCtx.font = '600 14px Cinzel, serif';
      cCtx.textAlign = 'center';
      cCtx.fillText('AUTHENTIC NIZAMI BESPOKE TAILORING · FLAGSHIP PATHERGATTI, HYDERABAD', 600, 1460);

      cCtx.fillStyle = '#9cb5ab';
      cCtx.font = '400 14px Plus Jakarta Sans, sans-serif';
      cCtx.fillText('WhatsApp Concierge: +91 8686684144  |  maqdoom-brothers-website.vercel.app', 600, 1490);

      // Download file
      try {
        const link = document.createElement('a');
        link.download = `Maqdoom-Bros-Royal-Look-${this.selectedOutfit.id}.jpg`;
        link.href = cardCanvas.toDataURL('image/jpeg', 0.95);
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
      } catch (err) {
        console.error('Download error:', err);
      }
    }
  }

  // Initialize and expose globally
  let instance = null;
  function initRoyalTrialRoom() {
    if (!instance) {
      instance = new RoyalTrialRoom();
      window.RoyalTrialRoomInstance = instance;
    }
    return instance;
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', initRoyalTrialRoom);
  } else {
    initRoyalTrialRoom();
  }

  window.openRoyalTrial = function (outfitId) {
    const app = initRoyalTrialRoom();
    if (app) app.open(outfitId);
  };

  window.closeRoyalTrial = function () {
    if (instance) instance.close();
  };
})();
