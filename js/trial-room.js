/**
 * MAQDOOM BROS DESIGNERS PVT LTD - Royal Virtual Trial Room Engine
 * AI Auto-Fit & Realistic Royal Wear Synthesis strictly using Website Catalog Images
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
      this.activeMode = 'wear'; // 'wear' (AI Royal Wear) | 'sideside' | 'tryon'
      this.cameraStream = null;
      this.facingMode = 'user'; // 'user' | 'environment'
      this.showGuide = false;

      // User photo transforms (auto-calculated on upload & adjustable)
      this.transform = {
        scale: 1.0,
        offsetX: 0,
        offsetY: 0,
        rotate: 0,
        neckTuck: 0 // fine-tune neck vertical tuck into collar
      };

      // Raw image face detection cache
      this.detectedFace = {
        cx: 0.5,
        cy: 0.35,
        radiusX: 0.18,
        radiusY: 0.22,
        detected: false,
        undertone: 'Warm Golden',
        luminance: 140
      };

      this.isDragging = false;
      this.dragStart = { x: 0, y: 0 };
      this.pinchStartDist = 0;
      this.initialScale = 1.0;

      // Outfits list strictly from website CATALOG_DATA
      this.garments = [];
      this.bestFitId = null;
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
      // Gather garments strictly from website CATALOG_DATA
      if (typeof CATALOG_DATA !== 'undefined' && Array.isArray(CATALOG_DATA)) {
        this.garments = CATALOG_DATA.filter(item =>
          ['sherwani', 'indo-western', 'bandhgala', 'kurta-sets'].includes(item.category)
        );
      }

      if (this.garments.length === 0) {
        // Fallback default list strictly pointing to authentic website assets
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
      this.processingBadge = document.getElementById('trialAiProcessingBadge');

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
      this.modeWearBtn = document.getElementById('trialModeWearBtn') || document.getElementById('trialModeTryOnBtn');
      this.modeSideSideBtn = document.getElementById('trialModeSideSideBtn');
      this.modeTryOnBtn = document.getElementById('trialModeTryOnBtn');

      // Transform controls
      this.autoFitBtn = document.getElementById('trialAutoFitBtn');
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
      if (this.modeWearBtn) {
        this.modeWearBtn.addEventListener('click', () => this.setMode('wear'));
      }
      if (this.modeSideSideBtn) {
        this.modeSideSideBtn.addEventListener('click', () => this.setMode('sideside'));
      }
      if (this.modeTryOnBtn && this.modeTryOnBtn !== this.modeWearBtn) {
        this.modeTryOnBtn.addEventListener('click', () => this.setMode('tryon'));
      }

      // Auto-Fit / Regenerate Button
      if (this.autoFitBtn) {
        this.autoFitBtn.addEventListener('click', () => this.recalculateAutoFit(true));
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
          this.transform.scale = Math.min(2.5, this.transform.scale + 0.08);
          if (this.zoomSlider) this.zoomSlider.value = this.transform.scale;
          this.requestRender();
        });
      }
      if (this.zoomOutBtn) {
        this.zoomOutBtn.addEventListener('click', () => {
          this.transform.scale = Math.max(0.4, this.transform.scale - 0.08);
          if (this.zoomSlider) this.zoomSlider.value = this.transform.scale;
          this.requestRender();
        });
      }
      if (this.resetFitBtn) {
        this.resetFitBtn.addEventListener('click', () => this.recalculateAutoFit(false));
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
            const notesField = document.getElementById('bookNotes');
            if (notesField && this.selectedOutfit) {
              notesField.value = `Selected in AI Royal Virtual Trial Room: ${this.selectedOutfit.title} (${this.selectedOutfit.id})`;
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
          img.onload = () => {
            if (this.selectedOutfit && (this.selectedOutfit.fullImage === fullSrc || this.selectedOutfit.image === fullSrc)) {
              this.requestRender();
            }
          };
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
      if (this.modeWearBtn) this.modeWearBtn.classList.toggle('active', mode === 'wear');
      if (this.modeSideSideBtn) this.modeSideSideBtn.classList.toggle('active', mode === 'sideside');
      if (this.modeTryOnBtn && this.modeTryOnBtn !== this.modeWearBtn) {
        this.modeTryOnBtn.classList.toggle('active', mode === 'tryon');
      }
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
      e.target.value = '';
    }

    loadSampleModel() {
      const sampleModelSrc = 'assets/brand/sample-groom.jpg';
      this.setCustomerPhoto(sampleModelSrc, true);
    }

    /**
     * Called whenever ANY raw image is uploaded or snapped
     * Automatically analyzes raw image and regenerates the best fit with website garments
     */
    setCustomerPhoto(src, isSample = false) {
      if (this.processingBadge) {
        this.processingBadge.style.display = 'flex';
      }

      const img = new Image();
      img.onload = () => {
        this.customerImage = img;
        this.customerImageSrc = src;
        this.isSampleModel = isSample;

        // Run AI raw image analysis, best-fit garment selection & auto-alignment
        this.analyzeRawImageAndAutoFit();

        this.hideEmptyState();
        this.activeMode = 'wear';
        if (this.modeWearBtn) this.modeWearBtn.classList.add('active');
        if (this.modeSideSideBtn) this.modeSideSideBtn.classList.remove('active');

        // Smooth reveal transition
        setTimeout(() => {
          if (this.processingBadge) {
            this.processingBadge.style.display = 'none';
          }
          this.renderWardrobeCarousel();
          this.updateOutfitDetails();
          this.runAIAnalysis();
          this.requestRender();
        }, 300);
      };
      img.src = src;
    }

    // ==========================================
    // AI RAW IMAGE ANALYSIS & AUTO-FIT ENGINE
    // ==========================================
    analyzeRawImageAndAutoFit() {
      if (!this.customerImage) return;

      const img = this.customerImage;
      const w = this.canvasLogicalWidth || 540;
      const h = this.canvasLogicalHeight || 720;

      // Create an offscreen analysis canvas
      const aCanvas = document.createElement('canvas');
      const sampleW = 120;
      const sampleH = Math.round(120 * (img.height / img.width));
      aCanvas.width = sampleW;
      aCanvas.height = sampleH;
      const aCtx = aCanvas.getContext('2d');
      aCtx.drawImage(img, 0, 0, sampleW, sampleH);

      let skinPoints = 0;
      let sumX = 0;
      let sumY = 0;
      let minX = sampleW, maxX = 0;
      let minY = sampleH, maxY = 0;
      let rSum = 0, gSum = 0, bSum = 0;

      try {
        const pData = aCtx.getImageData(0, 0, sampleW, sampleH).data;
        // Search upper 65% of image for face
        const searchH = Math.floor(sampleH * 0.65);

        for (let y = 0; y < searchH; y++) {
          for (let x = 0; x < sampleW; x++) {
            const idx = (y * sampleW + x) * 4;
            const r = pData[idx];
            const g = pData[idx + 1];
            const b = pData[idx + 2];
            const sum = r + g + b;

            if (sum > 0) {
              const nr = r / sum;
              const ng = g / sum;
              // Skin color chromaticity filter
              if (r > 60 && g > 40 && b > 20 && r > g && r > b && (r - g) > 10 && nr >= 0.35 && nr <= 0.60 && ng >= 0.25 && ng <= 0.40) {
                skinPoints++;
                sumX += x;
                sumY += y;
                rSum += r;
                gSum += g;
                bSum += b;
                if (x < minX) minX = x;
                if (x > maxX) maxX = x;
                if (y < minY) minY = y;
                if (y > maxY) maxY = y;
              }
            }
          }
        }
      } catch (err) {
        console.warn('Pixel access error on analysis:', err);
      }

      // Determine Face Center and Dimensions
      let cx = 0.5;
      let cy = 0.32;
      let boxW = 0.30;
      let boxH = 0.30;
      let undertone = 'Warm Golden';
      let lum = 140;

      if (skinPoints > 40) {
        cx = (sumX / skinPoints) / sampleW;
        cy = (sumY / skinPoints) / sampleH;
        boxW = Math.max(0.15, (maxX - minX) / sampleW);
        boxH = Math.max(0.15, (maxY - minY) / sampleH);

        const rAvg = rSum / skinPoints;
        const gAvg = gSum / skinPoints;
        const bAvg = bSum / skinPoints;
        lum = 0.299 * rAvg + 0.587 * gAvg + 0.114 * bAvg;

        if (rAvg > bAvg + 18 && gAvg > bAvg) {
          undertone = 'Warm Golden';
        } else if (lum > 145) {
          undertone = 'Cool Pearl / Rosy';
        } else {
          undertone = 'Rich Royal Bronze';
        }

        this.detectedFace = {
          cx,
          cy,
          radiusX: boxW * 0.55,
          radiusY: boxH * 0.60,
          detected: true,
          undertone,
          luminance: lum
        };
      } else {
        // Fallback default for portrait orientation
        this.detectedFace = {
          cx: 0.5,
          cy: 0.30,
          radiusX: 0.18,
          radiusY: 0.22,
          detected: false,
          undertone: 'Warm Golden',
          luminance: 140
        };
      }

      // Automatically Match Best Website Garment for this skin tone
      this.matchBestWebsiteOutfit(undertone);

      // Auto-Fit Face to the Royal Collar
      this.calculateAutoFitTransform();
    }

    matchBestWebsiteOutfit(undertone) {
      if (!this.garments || this.garments.length === 0) return;

      // Ranking table mapped strictly to website items
      let targetId = 'sherwani-16'; // default: Champagne Gold
      if (undertone === 'Warm Golden') {
        // Rich golds, crimsons, and champagne
        const warmPref = ['sherwani-16', 'sherwani-21', 'sherwani-18', 'kurta-04'];
        targetId = warmPref.find(id => this.garments.some(g => g.id === id)) || this.garments[0].id;
      } else if (undertone === 'Cool Pearl / Rosy') {
        // Blush rose, lavender lilac, ivory slate
        const coolPref = ['sherwani-13', 'sherwani-20', 'sherwani-22', 'sherwani-17'];
        targetId = coolPref.find(id => this.garments.some(g => g.id === id)) || this.garments[0].id;
      } else {
        // Rich Bronze: Deep obsidian, royal navy, darbar olive
        const bronzePref = ['sherwani-24', 'sherwani-19', 'sherwani-23', 'sherwani-15'];
        targetId = bronzePref.find(id => this.garments.some(g => g.id === id)) || this.garments[0].id;
      }

      this.bestFitId = targetId;
      const matched = this.garments.find(g => g.id === targetId);
      if (matched) {
        this.selectedOutfit = matched;
      }
    }

    calculateAutoFitTransform() {
      this.transform = {
        scale: 1.0,
        offsetX: 0,
        offsetY: 0,
        rotate: 0,
        neckTuck: 0
      };

      if (this.zoomSlider) {
        this.zoomSlider.value = 1.0;
      }
    }

    recalculateAutoFit(announce = true) {
      if (!this.customerImage) return;

      if (this.processingBadge && announce) {
        this.processingBadge.style.display = 'flex';
        const txt = this.processingBadge.querySelector('span:last-child');
        if (txt) txt.textContent = '✨ AI Auto-Fitting to Royal Collar...';
      }

      this.calculateAutoFitTransform();
      this.runAIAnalysis();

      setTimeout(() => {
        if (this.processingBadge) {
          this.processingBadge.style.display = 'none';
        }
        this.requestRender();
      }, 250);
    }

    // ==========================================
    // CANVAS TOUCH / POINTER INTERACTIONS
    // ==========================================
    handlePointerDown(e) {
      if (!this.customerImage) return;
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
      if (!this.customerImage) return;
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
      const bgGrad = this.ctx.createRadialGradient(w / 2, h * 0.35, 40, w / 2, h / 2, Math.max(w, h));
      bgGrad.addColorStop(0, '#0f2922');
      bgGrad.addColorStop(0.7, '#071914');
      bgGrad.addColorStop(1, '#030c09');
      this.ctx.fillStyle = bgGrad;
      this.ctx.fillRect(0, 0, w, h);

      if (!this.customerImage) return;

      if (this.activeMode === 'wear') {
        this.renderWearMode(w, h);
      } else if (this.activeMode === 'sideside') {
        this.renderSideSideMode(w, h);
      } else {
        this.renderTryOnOverlayMode(w, h);
      }

      // Draw subtle royal gold stage border
      this.ctx.strokeStyle = 'rgba(212, 175, 55, 0.45)';
      this.ctx.lineWidth = 1.5;
      this.ctx.strokeRect(8, 8, w - 16, h - 16);

      // Royal corner filigree accents
      this.drawCornerAccents(w, h);
    }

    /**
     * PRIMARY MODE: AI Royal Wear Look
     * Seamlessly fits customer's real face and neck wearing the website's authentic garment
     */
    renderWearMode(w, h) {
      this.ctx.save();
      this.ctx.beginPath();
      this.ctx.rect(10, 10, w - 20, h - 20);
      this.ctx.clip();

      const img = this.customerImage;

      // 0. Base Royal Atelier Background
      const bgGrad = this.ctx.createLinearGradient(0, 0, 0, h);
      bgGrad.addColorStop(0, '#0a211a');
      bgGrad.addColorStop(0.35, '#061712');
      bgGrad.addColorStop(1, '#020906');
      this.ctx.fillStyle = bgGrad;
      this.ctx.fillRect(0, 0, w, h);

      // 1. Prepare Garment Image
      let garmentImg = null;
      if (this.selectedOutfit) {
        const garmentSrc = this.selectedOutfit.fullImage || this.selectedOutfit.image;
        garmentImg = this.cachedGarmentImages.get(garmentSrc);
        if (!garmentImg) {
          garmentImg = new Image();
          garmentImg.onload = () => this.requestRender();
          garmentImg.src = garmentSrc;
          this.cachedGarmentImages.set(garmentSrc, garmentImg);
        }
      }

      // Garment positioning & collar geometry
      let gW = w;
      let gH = h;
      let gX = 0;
      let gY = 0;
      const gAspect = (garmentImg && garmentImg.naturalWidth && garmentImg.naturalHeight)
        ? (garmentImg.naturalWidth / garmentImg.naturalHeight)
        : (1024 / 1536);
      gH = h * 0.94;
      gW = gH * gAspect;
      gX = (w - gW) / 2;
      gY = h - gH + 10;

      const collarX = w / 2;
      const collarY = gY + gH * 0.235;
      const collarW = gW * 0.26;
      const collarDepth = 26;

      // 2. Draw Customer Face & Neck (Positioned to fit into the collar)
      if (img && img.complete && img.naturalWidth > 0) {
        this.ctx.save();
        const detectedFaceH = (this.detectedFace && this.detectedFace.radiusY ? this.detectedFace.radiusY * 2 : 0.44) * img.height;
        const desiredFaceH = h * 0.23;
        const baseScale = desiredFaceH / Math.max(80, detectedFaceH);
        const finalScale = baseScale * this.transform.scale;

        const drawW = img.width * finalScale;
        const drawH = img.height * finalScale;

        const faceNormX = this.detectedFace ? this.detectedFace.cx : 0.5;
        const chinNormY = this.detectedFace ? (this.detectedFace.cy + this.detectedFace.radiusY * 0.85) : 0.55;

        const faceCenterX = collarX + this.transform.offsetX;
        const chinY = collarY + 8 + this.transform.offsetY; // Chin sits right above the collar dip, neck tucks in

        const drawLeft = faceCenterX - (faceNormX * drawW);
        const drawTop = chinY - (chinNormY * drawH);

        // Offscreen buffer for feathered face mask
        const headCanvas = document.createElement('canvas');
        headCanvas.width = Math.round(w);
        headCanvas.height = Math.round(h);
        const hCtx = headCanvas.getContext('2d');

        hCtx.save();
        if (this.transform.rotate !== 0) {
          hCtx.translate(faceCenterX, chinY - (this.detectedFace.radiusY * drawH));
          hCtx.rotate((this.transform.rotate * Math.PI) / 180);
          hCtx.translate(-faceCenterX, -(chinY - (this.detectedFace.radiusY * drawH)));
        }
        hCtx.drawImage(img, drawLeft, drawTop, drawW, drawH);
        hCtx.restore();

        // Create organic radial/elliptical feather around customer's head & neck
        const maskCanvas = document.createElement('canvas');
        maskCanvas.width = Math.round(w);
        maskCanvas.height = Math.round(h);
        const mCtx = maskCanvas.getContext('2d');

        const headRadiusX = (this.detectedFace.radiusX * drawW) * 1.35;
        const headRadiusY = (this.detectedFace.radiusY * drawH) * 1.5;
        const headCenterY = chinY - (this.detectedFace.radiusY * drawH);

        const fGrad = mCtx.createRadialGradient(
          faceCenterX, headCenterY, headRadiusX * 0.65,
          faceCenterX, headCenterY, Math.max(headRadiusX, headRadiusY) * 1.15
        );
        fGrad.addColorStop(0, 'rgba(0, 0, 0, 1)');
        fGrad.addColorStop(0.75, 'rgba(0, 0, 0, 0.95)');
        fGrad.addColorStop(1, 'rgba(0, 0, 0, 0)');

        mCtx.fillStyle = fGrad;
        mCtx.beginPath();
        mCtx.ellipse(faceCenterX, headCenterY, headRadiusX * 1.1, headRadiusY * 1.25, 0, 0, Math.PI * 2);
        mCtx.fill();

        // Apply feather mask
        hCtx.globalCompositeOperation = 'destination-in';
        hCtx.drawImage(maskCanvas, 0, 0);

        // Render customer head onto main canvas
        this.ctx.drawImage(headCanvas, 0, 0);
        this.ctx.restore();
      }

      // 3. Draw Website Royal Garment Body (With Collar Cutout for Head)
      if (garmentImg && garmentImg.complete && garmentImg.naturalWidth > 0) {
        this.ctx.save();

        // Collar clipping path:
        // Keeps the full royal garment body, lapels, shoulders and mandarin collar rim,
        // but completely removes the mannequin head above the collar dip.
        this.ctx.beginPath();
        this.ctx.moveTo(gX - 10, h + 10);
        this.ctx.lineTo(gX + gW + 10, h + 10);
        this.ctx.lineTo(gX + gW + 10, collarY - 35);
        this.ctx.lineTo(collarX + collarW / 2, collarY - 18);
        this.ctx.quadraticCurveTo(collarX, collarY + collarDepth, collarX - collarW / 2, collarY - 18);
        this.ctx.lineTo(gX - 10, collarY - 35);
        this.ctx.closePath();
        this.ctx.clip();

        this.ctx.drawImage(garmentImg, gX, gY, gW, gH);
        this.ctx.restore();
      }

      // 4. Subtle Mandarin Collar Ambient Shadow
      this.ctx.save();
      const collarShadowGrad = this.ctx.createRadialGradient(
        collarX, collarY + 4, 4,
        collarX, collarY + 4, collarW * 0.55
      );
      collarShadowGrad.addColorStop(0, 'rgba(0, 0, 0, 0.45)');
      collarShadowGrad.addColorStop(0.7, 'rgba(0, 0, 0, 0.20)');
      collarShadowGrad.addColorStop(1, 'rgba(0, 0, 0, 0)');
      this.ctx.fillStyle = collarShadowGrad;
      this.ctx.beginPath();
      this.ctx.ellipse(collarX, collarY + 6, collarW * 0.48, 12, 0, 0, Math.PI * 2);
      this.ctx.fill();
      this.ctx.restore();

      // 5. Lighting & Color Temperature Harmonizer
      this.ctx.save();
      this.ctx.globalCompositeOperation = 'overlay';
      this.ctx.fillStyle = 'rgba(212, 175, 55, 0.04)';
      this.ctx.fillRect(0, 0, w, h);
      this.ctx.restore();

      // 6. Watermark Badge: Authentic Website Piece
      if (this.selectedOutfit) {
        this.ctx.fillStyle = 'rgba(7, 25, 20, 0.90)';
        this.ctx.fillRect(16, 16, 220, 32);
        this.ctx.strokeStyle = '#d4af37';
        this.ctx.lineWidth = 1;
        this.ctx.strokeRect(16, 16, 220, 32);
        this.ctx.fillStyle = '#ffe082';
        this.ctx.font = '700 11px Cinzel, serif';
        this.ctx.fillText(`⚜️ MAQDOOM BROS ATELIER`, 26, 30);
        this.ctx.fillStyle = '#ffffff';
        this.ctx.font = '600 10px Plus Jakarta Sans, sans-serif';
        const titleTrim = this.selectedOutfit.title.length > 28 ? this.selectedOutfit.title.slice(0, 26) + '...' : this.selectedOutfit.title;
        this.ctx.fillText(titleTrim, 26, 43);
      }

      this.ctx.restore();
    }

    renderSideSideMode(w, h) {
      this.ctx.save();
      this.ctx.beginPath();
      this.ctx.rect(10, 10, w - 20, h - 20);
      this.ctx.clip();

      const halfW = (w - 20) / 2;

      // --- Left: Customer Raw Photo ---
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
      this.ctx.fillStyle = 'rgba(7, 25, 20, 0.9)';
      this.ctx.fillRect(16, h - 46, halfW - 12, 28);
      this.ctx.fillStyle = '#f3e5ab';
      this.ctx.font = '700 11px Cinzel, serif';
      this.ctx.textAlign = 'center';
      this.ctx.fillText(`RAW IMAGE (${this.detectedFace.undertone})`, 10 + halfW / 2, h - 28);
      this.ctx.restore();

      // --- Right: Website Royal Garment Full View ---
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
      this.ctx.fillStyle = 'rgba(7, 25, 20, 0.9)';
      this.ctx.fillRect(10 + halfW + 6, h - 46, halfW - 12, 28);
      this.ctx.fillStyle = '#d4af37';
      this.ctx.font = '700 11px Cinzel, serif';
      this.ctx.textAlign = 'center';
      this.ctx.fillText('WEBSITE ROYAL GARMENT', 10 + halfW + halfW / 2, h - 28);
      this.ctx.restore();

      // Center Divider line & crest
      this.ctx.strokeStyle = 'rgba(212, 175, 55, 0.8)';
      this.ctx.lineWidth = 2;
      this.ctx.beginPath();
      this.ctx.moveTo(10 + halfW, 10);
      this.ctx.lineTo(10 + halfW, h - 10);
      this.ctx.stroke();

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

    renderTryOnOverlayMode(w, h) {
      this.ctx.save();
      this.ctx.beginPath();
      this.ctx.rect(10, 10, w - 20, h - 20);
      this.ctx.clip();

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

      if (this.selectedOutfit) {
        const garmentSrc = this.selectedOutfit.fullImage || this.selectedOutfit.image;
        let garmentImg = this.cachedGarmentImages.get(garmentSrc);
        if (garmentImg && garmentImg.complete && garmentImg.naturalWidth > 0) {
          const gAspect = garmentImg.naturalWidth / garmentImg.naturalHeight;
          const gH = h * 0.92;
          const gW = gH * gAspect;
          const gX = (w - gW) / 2;
          const gY = h - gH + 10;

          this.ctx.save();
          this.ctx.globalAlpha = 0.85;
          this.ctx.drawImage(garmentImg, gX, gY, gW, gH);
          this.ctx.restore();
        }
      }

      if (this.showGuide) {
        this.drawAlignmentGuide(w, h);
      }

      this.ctx.restore();
    }

    drawAlignmentGuide(w, h) {
      this.ctx.save();
      this.ctx.strokeStyle = 'rgba(212, 175, 55, 0.65)';
      this.ctx.lineWidth = 1.2;
      this.ctx.setLineDash([5, 5]);

      const headCenterX = w / 2;
      const headCenterY = h * 0.20;
      const headRadiusX = w * 0.16;
      const headRadiusY = h * 0.15;

      this.ctx.beginPath();
      this.ctx.ellipse(headCenterX, headCenterY, headRadiusX, headRadiusY, 0, 0, Math.PI * 2);
      this.ctx.stroke();

      this.ctx.setLineDash([]);
      this.ctx.strokeStyle = 'rgba(255, 224, 130, 0.8)';
      this.ctx.lineWidth = 1.5;
      this.ctx.beginPath();
      this.ctx.moveTo(headCenterX - w * 0.13, headCenterY + headRadiusY + 14);
      this.ctx.quadraticCurveTo(headCenterX, headCenterY + headRadiusY + 30, headCenterX + w * 0.13, headCenterY + headRadiusY + 14);
      this.ctx.stroke();

      this.ctx.fillStyle = '#ffe082';
      this.ctx.font = '600 11px Cinzel, serif';
      this.ctx.textAlign = 'center';
      this.ctx.fillText('Mandarin Collar Fit Line', headCenterX, headCenterY + headRadiusY + 46);

      this.ctx.restore();
    }

    drawCornerAccents(w, h) {
      this.ctx.save();
      this.ctx.strokeStyle = 'rgba(212, 175, 55, 0.7)';
      this.ctx.lineWidth = 1.5;
      const s = 14;

      this.ctx.beginPath();
      this.ctx.moveTo(8, 8 + s);
      this.ctx.lineTo(8, 8);
      this.ctx.lineTo(8 + s, 8);
      this.ctx.stroke();

      this.ctx.beginPath();
      this.ctx.moveTo(w - 8 - s, 8);
      this.ctx.lineTo(w - 8, 8);
      this.ctx.lineTo(w - 8, 8 + s);
      this.ctx.stroke();

      this.ctx.beginPath();
      this.ctx.moveTo(8, h - 8 - s);
      this.ctx.lineTo(8, h - 8);
      this.ctx.lineTo(8 + s, h - 8);
      this.ctx.stroke();

      this.ctx.beginPath();
      this.ctx.moveTo(w - 8 - s, h - 8);
      this.ctx.lineTo(w - 8, h - 8);
      this.ctx.lineTo(w - 8, h - 8 - s);
      this.ctx.stroke();

      this.ctx.restore();
    }

    // ==========================================
    // AI STYLE & FIT ANALYSIS DISPLAY
    // ==========================================
    runAIAnalysis() {
      if (!this.selectedOutfit) return;

      const undertone = this.detectedFace.undertone || 'Warm Golden';
      let score = 98;

      if (this.bestFitId && this.selectedOutfit.id === this.bestFitId) {
        score = 99;
      } else {
        const colorText = (this.selectedOutfit.color || this.selectedOutfit.title || '').toLowerCase();
        if (undertone === 'Warm Golden' && (colorText.includes('gold') || colorText.includes('crimson') || colorText.includes('champagne'))) {
          score = 99;
        } else if (undertone === 'Cool Pearl / Rosy' && (colorText.includes('lavender') || colorText.includes('blush') || colorText.includes('ivory') || colorText.includes('blue'))) {
          score = 98;
        } else if (undertone === 'Rich Royal Bronze' && (colorText.includes('navy') || colorText.includes('olive') || colorText.includes('obsidian') || colorText.includes('darbar'))) {
          score = 98;
        } else {
          score = 96;
        }
      }

      const occasion = this.selectedOutfit.occasion || 'Royal Baraat / Grand Nikkah / Wedding Gala';
      const isBestFit = this.bestFitId && this.selectedOutfit.id === this.bestFitId;
      const advice = isBestFit
        ? `🌟 AI Best Fit Match: Handcrafted ${this.selectedOutfit.work || 'zardozi'} harmonizes naturally with your ${undertone} tones for an imperial wedding entrance.`
        : `Artisanal fit: The ${this.selectedOutfit.work || 'zardozi embroidery'} against pure silk complements ${undertone} tones for evening ceremonies.`;
      const accessoryTip = `Royal Pairing: Pair with Handcrafted Velvet Mojaris (acc-02) and Safa with Kundan Kalgi (acc-01) for the complete Nizami court look.`;

      this.aiAnalysis = {
        score,
        undertone,
        occasion,
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
    // WARDROBE CAROUSEL (WEBSITE GARMENTS ONLY)
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

        const isBestFit = this.bestFitId && item.id === this.bestFitId;
        const thumbSrc = item.image;

        card.innerHTML = `
          <div class="trial-chip-thumb">
            <img src="${thumbSrc}" alt="${item.title}" loading="lazy" />
            <span class="trial-chip-badge">${item.badge || item.categoryLabel || '2026'}</span>
            ${isBestFit ? '<span class="trial-chip-bestfit">👑 Best Fit</span>' : ''}
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
      if (!item) return;
      if (typeof item === 'string') {
        const found = this.garments.find(g => g.id === item);
        if (found) item = found;
      }
      this.selectedOutfit = item;
      const gSrc = item.fullImage || item.image;
      if (gSrc && !this.cachedGarmentImages.has(gSrc)) {
        const gImg = new Image();
        gImg.onload = () => this.requestRender();
        gImg.src = gSrc;
        this.cachedGarmentImages.set(gSrc, gImg);
      }
      document.querySelectorAll('.trial-outfit-chip').forEach(chip => {
        const titleElem = chip.querySelector('.trial-chip-title');
        chip.classList.toggle('active', titleElem && titleElem.textContent === item.title);
      });

      this.updateOutfitDetails();
      this.runAIAnalysis();
      this.requestRender();
    }

    updateOutfitDetails() {
      if (!this.selectedOutfit) return;
      if (this.outfitTitleElem) this.outfitTitleElem.textContent = this.selectedOutfit.title;
      if (this.outfitBadgeElem) {
        const isBest = this.bestFitId && this.selectedOutfit.id === this.bestFitId;
        this.outfitBadgeElem.textContent = isBest ? '👑 AI #1 Best Fit Match' : `⚜️ ${this.selectedOutfit.badge || this.selectedOutfit.categoryLabel || 'Imperial 2026'}`;
      }
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
        `I just generated my try-on look in your *AI Royal Virtual Trial Room*:\n\n` +
        `⚜️ *Garment (Website Catalog):* ${this.selectedOutfit.title}\n` +
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
      cCtx.fillText('MAQDOOM BROS', 600, 145);

      cCtx.fillStyle = '#d4af37';
      cCtx.font = '500 16px Plus Jakarta Sans, sans-serif';
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
      cCtx.fillRect(stageX + 24, stageY + 24, 250, 48);
      cCtx.strokeStyle = '#d4af37';
      cCtx.lineWidth = 1.5;
      cCtx.strokeRect(stageX + 24, stageY + 24, 250, 48);
      cCtx.fillStyle = '#ffe082';
      cCtx.font = '700 15px Cinzel, serif';
      cCtx.textAlign = 'left';
      cCtx.fillText(`👑 ${this.aiAnalysis.score}% ROYAL BEST FIT`, stageX + 40, stageY + 54);

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
