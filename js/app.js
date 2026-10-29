/**
 * MAQDOOM BROS DESIGNERS PVT LTD - Interactive Application Engine
 * Flagship: Pathergatti Road, Opp. Madina Building, Hyderabad, TG
 * Contact: +91 8686684144 | Instagram: @maqdoombrothers
 * AI-Era & Geo-Location Integration Engine
 */

document.addEventListener('DOMContentLoaded', () => {
  // Store Constants
  const STORE_PHONE = "918686684144"; // WhatsApp / Calling
  const STORE_HOURS_OPEN = 10.5; // 10:30 AM
  const STORE_HOURS_CLOSE = 22.5; // 10:30 PM

  // Elements
  const catalogContainer = document.getElementById('catalogGrid');
  const filterTabs = document.querySelectorAll('.filter-tab');
  const quickViewModal = document.getElementById('quickViewModal');
  const modalCloseBtn = document.getElementById('modalCloseBtn');
  const siteHeader = document.querySelector('.site-header');
  const mobileNavToggle = document.getElementById('mobileNavToggle');
  const navMenu = document.getElementById('navMenu');
  const bookingForm = document.getElementById('bookingForm');
  const storeStatusText = document.getElementById('storeStatusText');
  const navAiStylistBtn = document.getElementById('navAiStylistBtn');
  const sizeEstimatorForm = document.getElementById('sizeEstimatorForm');

  // 1. Live Store Status Indicator (Open Daily 10:30 AM - 10:30 PM IST)
  function updateStoreStatus() {
    if (!storeStatusText) return;
    const now = new Date();
    // UTC to IST offset is +5.5 hours
    const utc = now.getTime() + (now.getTimezoneOffset() * 60000);
    const istTime = new Date(utc + (3600000 * 5.5));
    const currentHour = istTime.getHours() + (istTime.getMinutes() / 60);

    const openHour = 10.5;  // 10:30 AM
    const closeHour = 22.5; // 10:30 PM

    const isOpen = (currentHour >= openHour && currentHour < closeHour);

    if (isOpen) {
      storeStatusText.innerHTML = `<span class="status-dot"></span> Open Now · Closes 10:30 PM`;
    } else {
      storeStatusText.innerHTML = `<span class="status-dot" style="background:#e72e77;box-shadow:0 0 8px #e72e77"></span> Currently Closed · Opens at 10:30 AM`;
    }

    const storeTableStatus = document.getElementById('storeTableStatus');
    if (storeTableStatus) {
      if (isOpen) {
        storeTableStatus.style.color = '#25d366';
        storeTableStatus.textContent = 'Open Now · Closes 10:30 PM IST';
      } else {
        storeTableStatus.style.color = '#e72e77';
        storeTableStatus.textContent = 'Closed Now · Opens at 10:30 AM IST';
      }
    }
  }
  updateStoreStatus();
  setInterval(updateStoreStatus, 60000);

  // 2. Render Catalog Cards with Currency Localization & Full Visibility
  let currentActiveItem = null;

  function renderCatalog(items) {
    if (!catalogContainer) return;
    catalogContainer.innerHTML = '';

    if (items.length === 0) {
      catalogContainer.innerHTML = `
        <div style="grid-column: 1/-1; text-align: center; padding: 40px; color: var(--text-muted);">
          <p>No outfits found in this category.</p>
        </div>
      `;
      return;
    }

    items.forEach(item => {
      const card = document.createElement('div');
      card.className = 'catalog-card';
      card.dataset.category = item.category;

      const formattedPrice = window.GeoEngine 
        ? window.GeoEngine.formatCurrencyRange(item.priceRange) 
        : item.priceRange;

      const fullImgSrc = item.fullImage || item.image;
      const itemImageUrl = (typeof window !== 'undefined' && window.location && window.location.origin && window.location.origin.startsWith('http') && !window.location.origin.includes('localhost'))
        ? `${window.location.origin}/${(fullImgSrc || '').replace(/^\/+/, '')}`
        : `https://maqdoom-brothers-website.vercel.app/${(fullImgSrc || '').replace(/^\/+/, '')}`;

      const whatsappText = encodeURIComponent(
        `Hello Maqdoom Brothers, I am interested in inquiring about "${item.title}" (${item.priceRange}) seen on your website.\n\n` +
        `📸 Product Image: ${itemImageUrl}\n` +
        `Item Code: ${item.id}\n\n` +
        `Please share availability & custom fitting details.`
      );
      const whatsappUrl = `https://wa.me/${STORE_PHONE}?text=${whatsappText}`;

      card.innerHTML = `
        <div class="card-media" data-id="${item.id}" role="button" tabindex="0" title="Click to view details and full-length image for ${item.title}">
          <img src="${item.image}" alt="${item.title}" loading="lazy" />
          <div class="card-media-overlay"></div>
          <span class="card-badge">⚜️ ${item.badge || item.categoryLabel}</span>
          <div class="card-hover-preview">
            <span class="preview-icon">🔍</span>
            <span>View Masterpiece</span>
          </div>
          <div class="card-quick-actions">
            <button type="button" class="btn btn-outline-gold btn-quickview" data-id="${item.id}" style="flex:1;">
              Quick View
            </button>
            <button type="button" class="btn btn-gold btn-trial-open" data-id="${item.id}" style="padding: 10px 12px; font-weight:700; font-size:0.75rem;" title="Try this royal outfit on your photo">
              🪞 Try On
            </button>
            <a href="${whatsappUrl}" target="_blank" rel="noopener noreferrer" class="btn btn-whatsapp" style="padding: 10px 14px;" title="Chat on WhatsApp">
              <svg style="width:18px;height:18px;fill:#fff" viewBox="0 0 24 24"><path d="M.057 24l1.687-6.163c-1.041-1.804-1.588-3.849-1.587-5.946.003-6.556 5.338-11.891 11.893-11.891 3.181.001 6.167 1.24 8.413 3.488 2.245 2.248 3.481 5.236 3.48 8.414-.003 6.557-5.338 11.892-11.893 11.892-1.99-.001-3.951-.5-5.688-1.448l-6.305 1.654zm6.597-3.807c1.676.995 3.276 1.591 5.392 1.592 5.448 0 9.886-4.434 9.889-9.885.002-5.462-4.415-9.89-9.881-9.892-5.452 0-9.887 4.434-9.889 9.884-.001 2.225.651 3.891 1.746 5.634l-.999 3.648 3.742-.981zm11.387-5.464c-.074-.124-.272-.198-.57-.347-.297-.149-1.758-.868-2.031-.967-.272-.099-.47-.149-.669.149-.198.297-.768.967-.941 1.165-.173.198-.347.223-.644.074-.297-.149-1.255-.462-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.297-.347.446-.521.151-.172.2-.296.3-.495.099-.198.05-.372-.025-.521-.075-.148-.669-1.611-.916-2.206-.242-.579-.487-.501-.669-.51l-.57-.01c-.198 0-.52.074-.792.372s-1.04 1.016-1.04 2.479 1.065 2.876 1.213 3.074c.149.198 2.095 3.2 5.076 4.487.709.306 1.263.489 1.694.626.712.226 1.36.194 1.872.118.571-.085 1.758-.719 2.006-1.413.248-.695.248-1.29.173-1.414z"/></svg>
            </a>
          </div>
        </div>
        <div class="card-body">
          <div class="card-eyebrow-row">
            <span class="card-category">${item.categoryLabel}</span>
          </div>
          <h3 class="card-title">${item.title}</h3>
          <div class="card-footer">
            <div class="price-tag">
              <span class="price-label">Price Range</span>
              <span class="price-value">${formattedPrice}</span>
            </div>
            <a href="${whatsappUrl}" target="_blank" rel="noopener noreferrer" class="btn btn-outline-gold btn-card-inquire">
              Inquire
            </a>
          </div>
        </div>
      `;

      catalogContainer.appendChild(card);
    });

    // Attach Click Handlers to Card Media & Quick View button
    document.querySelectorAll('.catalog-card .card-media').forEach(media => {
      media.addEventListener('click', (e) => {
        // Prevent opening if WhatsApp icon or quickview clicked
        if (e.target.closest('.btn-whatsapp') || e.target.closest('.btn-quickview') || e.target.closest('.btn-trial-open')) return;
        const id = media.dataset.id;
        const item = CATALOG_DATA.find(x => x.id === id);
        if (item) openLightbox(item); // 1-tap direct full-resolution head-to-toe lightbox!
      });
      media.addEventListener('keydown', (e) => {
        if (e.key === 'Enter' || e.key === ' ') {
          e.preventDefault();
          const id = media.dataset.id;
          const item = CATALOG_DATA.find(x => x.id === id);
          if (item) openQuickView(item);
        }
      });
    });

    document.querySelectorAll('.btn-quickview').forEach(btn => {
      btn.addEventListener('click', (e) => {
        e.stopPropagation();
        const id = e.currentTarget.dataset.id;
        const item = CATALOG_DATA.find(x => x.id === id);
        if (item) openQuickView(item);
      });
    });
  }

  // 3. Category Filtering
  filterTabs.forEach(tab => {
    tab.addEventListener('click', () => {
      filterTabs.forEach(t => t.classList.remove('active'));
      tab.classList.add('active');
      const cat = tab.dataset.filter;

      if (cat === 'all') {
        renderCatalog(CATALOG_DATA);
      } else {
        const filtered = CATALOG_DATA.filter(item => item.category === cat);
        renderCatalog(filtered);
      }
    });
  });

  // 4. Quick View Modal Operations
  function openQuickView(item) {
    if (!quickViewModal) return;
    currentActiveItem = item;
    const modalImage = document.getElementById('modalImage');
    const modalCategory = document.getElementById('modalCategory');
    const modalTitle = document.getElementById('modalTitle');
    const modalPrice = document.getElementById('modalPrice');
    const modalDesc = document.getElementById('modalDesc');
    const modalFabric = document.getElementById('modalFabric');
    const modalCraft = document.getElementById('modalCraft');
    const modalOccasion = document.getElementById('modalOccasion');
    const modalWhatsAppBtn = document.getElementById('modalWhatsAppBtn');

    const formattedPrice = window.GeoEngine 
      ? window.GeoEngine.formatCurrencyRange(item.priceRange) 
      : item.priceRange;

    if (modalImage) {
      modalImage.src = item.fullImage || item.image;
      modalImage.alt = item.title;
    }
    if (modalCategory) modalCategory.textContent = item.categoryLabel;
    if (modalTitle) modalTitle.textContent = item.title;
    if (modalPrice) modalPrice.textContent = formattedPrice;
    if (modalDesc) modalDesc.textContent = item.description;
    if (modalFabric) modalFabric.textContent = item.fabric;
    if (modalCraft) modalCraft.textContent = item.work;
    if (modalOccasion) modalOccasion.textContent = item.occasion;

    const fullImgSrc = item.fullImage || item.image;
    const itemImageUrl = (typeof window !== 'undefined' && window.location && window.location.origin && window.location.origin.startsWith('http') && !window.location.origin.includes('localhost'))
      ? `${window.location.origin}/${(fullImgSrc || '').replace(/^\/+/, '')}`
      : `https://maqdoom-brothers-website.vercel.app/${(fullImgSrc || '').replace(/^\/+/, '')}`;

    const whatsappText = encodeURIComponent(
      `Assalamu Alaikum / Greetings Maqdoom Brothers, I would like to inquire about "${item.title}" (${item.priceRange}) for my upcoming wedding event.\n\n` +
      `📸 Product Image: ${itemImageUrl}\n` +
      `Item Code: ${item.id}\n` +
      `Fabric: ${item.fabric}\n\n` +
      `Can you assist me with custom tailoring & video consultation?`
    );
    if (modalWhatsAppBtn) {
      modalWhatsAppBtn.href = `https://wa.me/${STORE_PHONE}?text=${whatsappText}`;
    }

    const modalTryOnBtn = document.getElementById('modalTryOnBtn');
    if (modalTryOnBtn) {
      if (['sherwani', 'indo-western', 'bandhgala', 'kurta-sets'].includes(item.category)) {
        modalTryOnBtn.style.display = 'inline-flex';
        modalTryOnBtn.onclick = () => {
          closeQuickView();
          if (window.openRoyalTrial) {
            window.openRoyalTrial(item.id);
          }
        };
      } else {
        modalTryOnBtn.style.display = 'none';
      }
    }

    quickViewModal.style.display = 'flex';
    quickViewModal.classList.add('open');
    document.body.style.overflow = 'hidden';
  }

  function closeQuickView() {
    if (!quickViewModal) return;
    quickViewModal.classList.remove('open');
    quickViewModal.style.display = 'none';
    document.body.style.overflow = '';
  }

  // 4B. Full-Screen Image Lightbox Operations
  const fullImageLightbox = document.getElementById('fullImageLightbox');
  const lightboxImage = document.getElementById('lightboxImage');
  const lightboxCloseBtn = document.getElementById('lightboxCloseBtn');
  const lightboxTitle = document.getElementById('lightboxTitle');
  const lightboxCategory = document.getElementById('lightboxCategory');
  const lightboxPrice = document.getElementById('lightboxPrice');
  const lightboxWhatsAppBtn = document.getElementById('lightboxWhatsAppBtn');
  const lightboxZoomBtn = document.getElementById('lightboxZoomBtn');
  const lightboxContainer = document.querySelector('.lightbox-image-container');

  function openLightbox(item) {
    if (!fullImageLightbox || !item) return;
    currentActiveItem = item;
    const fullImgSrc = item.fullImage || item.image;
    if (lightboxImage) {
      lightboxImage.src = fullImgSrc;
      lightboxImage.alt = item.title;
    }
    if (lightboxTitle) lightboxTitle.textContent = item.title;
    if (lightboxCategory) lightboxCategory.textContent = item.categoryLabel;
    if (lightboxPrice) {
      lightboxPrice.textContent = window.GeoEngine 
        ? window.GeoEngine.formatCurrencyRange(item.priceRange) 
        : item.priceRange;
    }

    const itemImageUrl = (typeof window !== 'undefined' && window.location && window.location.origin && window.location.origin.startsWith('http') && !window.location.origin.includes('localhost'))
      ? `${window.location.origin}/${fullImgSrc.replace(/^\/+/, '')}`
      : `https://maqdoom-brothers-website.vercel.app/${fullImgSrc.replace(/^\/+/, '')}`;

    const whatsappText = encodeURIComponent(
      `Assalamu Alaikum Maqdoom Brothers, I am viewing the full-length look of "${item.title}" (${item.priceRange}) on your website.\n\n` +
      `📸 Full Look: ${itemImageUrl}\n` +
      `Item Code: ${item.id}\n\n` +
      `Please provide bespoke stitching details and appointment availability.`
    );
    if (lightboxWhatsAppBtn) {
      lightboxWhatsAppBtn.href = `https://wa.me/${STORE_PHONE}?text=${whatsappText}`;
    }

    if (lightboxContainer) lightboxContainer.classList.remove('is-zoomed');
    if (lightboxZoomBtn) lightboxZoomBtn.textContent = '🔍 Zoom 100%';
    fullImageLightbox.style.display = 'flex';
    void fullImageLightbox.offsetWidth;
    fullImageLightbox.classList.add('open');
    document.body.style.overflow = 'hidden';
  }

  function closeLightbox() {
    if (!fullImageLightbox) return;
    fullImageLightbox.classList.remove('open');
    setTimeout(() => {
      fullImageLightbox.style.display = 'none';
      if (!quickViewModal || !quickViewModal.classList.contains('open')) {
        document.body.style.overflow = '';
      }
    }, 250);
  }

  // Wire Quick View image click and Full View button to Lightbox
  const modalImageWrap = document.getElementById('modalImageWrap');
  if (modalImageWrap) {
    modalImageWrap.addEventListener('click', () => {
      if (currentActiveItem) openLightbox(currentActiveItem);
    });
  }
  const modalFullViewBtn = document.getElementById('modalFullViewBtn');
  if (modalFullViewBtn) {
    modalFullViewBtn.addEventListener('click', () => {
      if (currentActiveItem) openLightbox(currentActiveItem);
    });
  }

  if (lightboxCloseBtn) {
    lightboxCloseBtn.addEventListener('click', closeLightbox);
  }
  if (fullImageLightbox) {
    fullImageLightbox.addEventListener('click', (e) => {
      if (e.target === fullImageLightbox) closeLightbox();
    });
  }
  if (lightboxZoomBtn && lightboxContainer) {
    lightboxZoomBtn.addEventListener('click', () => {
      lightboxContainer.classList.toggle('is-zoomed');
      lightboxZoomBtn.textContent = lightboxContainer.classList.contains('is-zoomed') ? 'Reset View' : '🔍 Zoom 100%';
    });
  }

  document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape') {
      if (fullImageLightbox && fullImageLightbox.classList.contains('open')) {
        closeLightbox();
      } else if (quickViewModal && quickViewModal.classList.contains('open')) {
        closeQuickView();
      }
    }
  });

  window.openQuickViewById = function(itemId) {
    if (typeof CATALOG_DATA !== 'undefined') {
      const item = CATALOG_DATA.find(i => i.id === itemId);
      if (item) openQuickView(item);
    }
  };

  window.openLightboxById = function(itemId) {
    if (typeof CATALOG_DATA !== 'undefined') {
      const item = CATALOG_DATA.find(i => i.id === itemId);
      if (item) openLightbox(item);
    }
  };

  if (modalCloseBtn) {
    modalCloseBtn.addEventListener('click', closeQuickView);
  }

  if (quickViewModal) {
    quickViewModal.addEventListener('click', (e) => {
      if (e.target === quickViewModal) {
        closeQuickView();
      }
    });
  }

  // 5. Booking Form Submission -> Dispatches to WhatsApp Concierge
  if (bookingForm) {
    bookingForm.addEventListener('submit', (e) => {
      e.preventDefault();
      const name = document.getElementById('bookName').value.trim();
      const phone = document.getElementById('bookPhone').value.trim();
      const date = document.getElementById('bookDate').value;
      const service = document.getElementById('bookService').value;
      const notes = document.getElementById('bookNotes').value.trim();

      const bookingMsg = encodeURIComponent(
        `*New Bespoke Consultation Request - Maqdoom Brothers*\n` +
        `👤 *Client Name:* ${name}\n` +
        `📞 *Contact:* ${phone}\n` +
        `📅 *Preferred Date:* ${date || 'Flexible'}\n` +
        `👔 *Service:* ${service}\n` +
        `📝 *Requirement Notes:* ${notes || 'Looking for groom wedding attire'}`
      );

      const bookingWhatsAppUrl = `https://wa.me/${STORE_PHONE}?text=${bookingMsg}`;
      window.open(bookingWhatsAppUrl, '_blank');

      alert(`Thank you, ${name}! Your consultation request has been prepared. We are redirecting you to our official WhatsApp Concierge (+91 8686684144) to confirm your time slot.`);
      bookingForm.reset();
    });
  }

  // 6. Virtual AI Size & Fit Estimator
  if (sizeEstimatorForm && typeof VirtualSizeEstimator !== 'undefined') {
    sizeEstimatorForm.addEventListener('submit', (e) => {
      e.preventDefault();
      const height = parseFloat(document.getElementById('estHeight').value) || 178;
      const chest = parseFloat(document.getElementById('estChest').value) || 40;
      const fit = document.getElementById('estFit').value;

      const res = VirtualSizeEstimator.calculate(height, chest, fit);
      const resSize = document.getElementById('estResultSize');
      const resCut = document.getElementById('estResultCut');
      const resDesc = document.getElementById('estResultDesc');
      const fitWaBtn = document.getElementById('estWhatsAppFitBtn');

      if (resSize) resSize.textContent = res.size;
      if (resCut) resCut.textContent = res.cut;
      if (resDesc) resDesc.textContent = res.length + ". " + res.recommendation;

      const fitWaMsg = encodeURIComponent(
        `Hello Maqdoom Brothers, I used the Virtual Size Estimator on your website:\n` +
        `📐 Calculated Size: ${res.size}\n` +
        `✂️ Preferred Cut: ${res.cut}\n` +
        `📏 Height: ${height}cm, Chest: ${chest}in\n` +
        `Please advise on custom master tailoring and trial availability.`
      );
      if (fitWaBtn) {
        fitWaBtn.href = `https://wa.me/${STORE_PHONE}?text=${fitWaMsg}`;
      }
    });
  }

  // 7. Initialize Nizam AI Royal Stylist
  if (typeof NizamAIStylist !== 'undefined' && typeof CATALOG_DATA !== 'undefined') {
    window.nizamAI = new NizamAIStylist(CATALOG_DATA);

    if (navAiStylistBtn) {
      navAiStylistBtn.addEventListener('click', (e) => {
        e.preventDefault();
        window.nizamAI.open();
      });
    }

    const floatingTrigger = document.getElementById('aiStylistFloatingTrigger');
    if (floatingTrigger) {
      floatingTrigger.addEventListener('click', (e) => {
        e.preventDefault();
        window.nizamAI.open();
      });
    }
  }

  // 8. Initialize Geo-Intelligence Engine
  if (window.GeoEngine) {
    window.GeoEngine.init();

    // Callback when Currency or Location changes
    window.onGeoOrCurrencyUpdate = () => {
      // Re-render active catalog tab with localized currency
      const activeTab = document.querySelector('.filter-tab.active');
      const cat = activeTab ? activeTab.dataset.filter : 'all';
      if (cat === 'all') {
        renderCatalog(CATALOG_DATA);
      } else {
        renderCatalog(CATALOG_DATA.filter(item => item.category === cat));
      }
    };
  }

  // 9. Header Scroll Effect
  window.addEventListener('scroll', () => {
    if (window.scrollY > 40) {
      siteHeader.classList.add('scrolled');
    } else {
      siteHeader.classList.remove('scrolled');
    }
  });

  // 10. Mobile Navigation Toggle
  if (mobileNavToggle && navMenu) {
    mobileNavToggle.addEventListener('click', () => {
      navMenu.classList.toggle('mobile-open');
    });

    navMenu.querySelectorAll('.nav-link').forEach(link => {
      link.addEventListener('click', () => {
        navMenu.classList.remove('mobile-open');
      });
    });
  }


  // =========================================================================
  // 11. ROYAL INTELLIGENT VECTOR & SEMANTIC SEARCH CONTROLLER
  // =========================================================================
  let vectorSearchEngine = null;
  if (typeof RoyalVectorSearchEngine !== 'undefined' && typeof CATALOG_DATA !== 'undefined') {
    vectorSearchEngine = new RoyalVectorSearchEngine(CATALOG_DATA);
    window.vectorSearchEngine = vectorSearchEngine;
  }

  const royalSearchModal = document.getElementById('royalSearchModal');
  const royalSearchInput = document.getElementById('royalSearchInput');
  const royalSearchCloseBtn = document.getElementById('royalSearchCloseBtn');
  const royalSearchClearBtn = document.getElementById('royalSearchClearBtn');
  const searchResultsGrid = document.getElementById('searchResultsGrid');
  const searchResultCount = document.getElementById('searchResultCount');
  const relatedWordsList = document.getElementById('relatedWordsList');
  const searchDefaultSuggestions = document.getElementById('searchDefaultSuggestions');
  const applySearchToPageBtn = document.getElementById('applySearchToPageBtn');
  const catalogSearchFilterBanner = document.getElementById('catalogSearchFilterBanner');
  const catalogSearchQueryDisplay = document.getElementById('catalogSearchQueryDisplay');
  const catalogSearchResultCount = document.getElementById('catalogSearchResultCount');
  const catalogClearSearchBtn = document.getElementById('catalogClearSearchBtn');

  // Triggers
  const topSearchTriggerBtn = document.getElementById('topSearchTriggerBtn');
  const mobileSearchTriggerBtn = document.getElementById('mobileSearchTriggerBtn');
  const conciergeSearchBtn = document.getElementById('conciergeSearchBtn');
  const headerSearchIconBtn = document.getElementById('headerSearchIconBtn');

  let currentSearchMode = 'hybrid';
  let currentSearchCategory = 'all';
  let currentSearchResults = [];
  let searchDebounceTimer = null;

  function openRoyalSearch(initialQuery = '') {
    if (!royalSearchModal) return;
    royalSearchModal.style.display = 'flex';
    requestAnimationFrame(() => {
      royalSearchModal.classList.add('active');
    });
    document.body.style.overflow = 'hidden';

    if (royalSearchInput) {
      if (initialQuery) {
        royalSearchInput.value = initialQuery;
      }
      setTimeout(() => {
        royalSearchInput.focus();
        if (initialQuery) {
          royalSearchInput.select();
        }
      }, 50);
    }
    executeSearch(royalSearchInput ? royalSearchInput.value : '');
  }

  function closeRoyalSearch() {
    if (!royalSearchModal) return;
    royalSearchModal.classList.remove('active');
    setTimeout(() => {
      royalSearchModal.style.display = 'none';
      document.body.style.overflow = '';
    }, 200);
  }

  // Bind All Search Triggers
  [topSearchTriggerBtn, mobileSearchTriggerBtn, conciergeSearchBtn, headerSearchIconBtn].forEach(btn => {
    if (btn) {
      btn.addEventListener('click', (e) => {
        e.preventDefault();
        openRoyalSearch();
      });
    }
  });

  // Close triggers
  if (royalSearchCloseBtn) {
    royalSearchCloseBtn.addEventListener('click', closeRoyalSearch);
  }
  if (royalSearchModal) {
    royalSearchModal.addEventListener('click', (e) => {
      if (e.target === royalSearchModal) {
        closeRoyalSearch();
      }
    });
  }

  // Clear button inside search field
  if (royalSearchClearBtn) {
    royalSearchClearBtn.addEventListener('click', () => {
      if (royalSearchInput) {
        royalSearchInput.value = '';
        royalSearchClearBtn.style.display = 'none';
        royalSearchInput.focus();
        executeSearch('');
      }
    });
  }

  // Mode Selector (Hybrid vs Pure Vector)
  document.querySelectorAll('.search-mode-btn').forEach(btn => {
    btn.addEventListener('click', () => {
      document.querySelectorAll('.search-mode-btn').forEach(b => b.classList.remove('active'));
      btn.classList.add('active');
      currentSearchMode = btn.dataset.mode || 'hybrid';
      executeSearch(royalSearchInput ? royalSearchInput.value : '');
    });
  });

  // Category Filter Tabs inside Search Modal
  document.querySelectorAll('.search-cat-tab').forEach(tab => {
    tab.addEventListener('click', () => {
      document.querySelectorAll('.search-cat-tab').forEach(t => t.classList.remove('active'));
      tab.classList.add('active');
      currentSearchCategory = tab.dataset.cat || 'all';
      executeSearch(royalSearchInput ? royalSearchInput.value : '');
    });
  });

  // Suggestions clicks
  document.querySelectorAll('.sugg-chip').forEach(chip => {
    chip.addEventListener('click', () => {
      const q = chip.dataset.query || chip.textContent.trim();
      if (royalSearchInput) {
        royalSearchInput.value = q;
        if (royalSearchClearBtn) royalSearchClearBtn.style.display = 'inline-block';
        executeSearch(q);
      }
    });
  });

  // Execute Search Function
  function executeSearch(query) {
    const q = (query || '').trim();

    // Toggle clear button
    if (royalSearchClearBtn) {
      royalSearchClearBtn.style.display = q ? 'inline-block' : 'none';
    }

    if (!vectorSearchEngine) return;

    const searchOutput = vectorSearchEngine.search(q, {
      mode: currentSearchMode,
      categoryFilter: currentSearchCategory
    });

    currentSearchResults = searchOutput.results.map(r => r.item);

    // Update Related Words Chips (Knowledge Graph Expansion)
    if (relatedWordsList) {
      relatedWordsList.innerHTML = '';
      if (searchOutput.relatedWords && searchOutput.relatedWords.length > 0) {
        searchOutput.relatedWords.forEach(word => {
          const chip = document.createElement('button');
          chip.type = 'button';
          chip.className = 'related-chip';
          chip.innerHTML = `✨ ${word}`;
          chip.addEventListener('click', () => {
            if (royalSearchInput) {
              royalSearchInput.value = word;
              if (royalSearchClearBtn) royalSearchClearBtn.style.display = 'inline-block';
              royalSearchInput.focus();
              executeSearch(word);
            }
          });
          relatedWordsList.appendChild(chip);
        });
      }
    }

    // Update Result Count Text
    if (searchResultCount) {
      if (q) {
        searchResultCount.innerHTML = `Found <strong>${searchOutput.total}</strong> Masterpiece${searchOutput.total === 1 ? '' : 's'} for "${q}" · Sorted by ${currentSearchMode === 'vector' ? 'Cosine Vector Similarity' : 'Hybrid Vector & Semantic Relevance'}`;
      } else {
        searchResultCount.innerHTML = `Showing <strong>${searchOutput.total}</strong> Masterpieces · Ready for Keyword & Vector Search`;
      }
    }

    // Toggle Default Suggestions when search is empty
    if (searchDefaultSuggestions) {
      searchDefaultSuggestions.style.display = (!q && currentSearchCategory === 'all') ? 'flex' : 'none';
    }

    // Render Result Items in Modal Grid
    if (searchResultsGrid) {
      searchResultsGrid.innerHTML = '';

      if (searchOutput.results.length === 0) {
        searchResultsGrid.innerHTML = `
          <div style="text-align: center; padding: 40px 20px; color: var(--text-muted); background: rgba(0,0,0,0.25); border-radius: 12px; border: 1px dashed rgba(212,175,55,0.3);">
            <div style="font-size: 2.2rem; margin-bottom: 12px;">⚜️</div>
            <h4 style="font-family: var(--font-serif); color: var(--pearl-white); margin-bottom: 8px;">No Direct Semantic Match Found</h4>
            <p style="font-size: 0.85rem; max-width: 480px; margin: 0 auto 16px;">
              Our master tailors can hand-craft bespoke garments in any custom silhouette, color, or embroidery theme.
            </p>
            <div style="display: flex; gap: 10px; justify-content: center; flex-wrap: wrap;">
              <button type="button" class="btn btn-outline-gold btn-sm" onclick="document.getElementById('royalSearchInput').value='Zardozi Sherwani'; window.vectorSearchEngine && window.vectorSearchEngine.search && document.getElementById('royalSearchInput').dispatchEvent(new Event('input'));">
                Explore Zardozi Sherwanis
              </button>
              <a href="https://wa.me/${STORE_PHONE}?text=Hello%20Maqdoom%20Brothers%2C%20I%20am%20looking%20for%20a%20custom%20groom%20outfit%20with%20specific%20requirements." target="_blank" rel="noopener noreferrer" class="btn btn-whatsapp btn-sm">
                Custom WhatsApp Consultation
              </a>
            </div>
          </div>
        `;
        return;
      }

      searchOutput.results.forEach(res => {
        const item = res.item;
        const formattedPrice = window.GeoEngine 
          ? window.GeoEngine.formatCurrencyRange(item.priceRange) 
          : item.priceRange;

        const fullImgSrc = item.fullImage || item.image;
        const itemImageUrl = (typeof window !== 'undefined' && window.location && window.location.origin && window.location.origin.startsWith('http') && !window.location.origin.includes('localhost'))
          ? `${window.location.origin}/${(fullImgSrc || '').replace(/^\/+/, '')}`
          : `https://maqdoom-brothers-website.vercel.app/${(fullImgSrc || '').replace(/^\/+/, '')}`;

        const whatsappText = encodeURIComponent(
          `Hello Maqdoom Brothers, I found "${item.title}" (${item.priceRange}) using the Royal Vector Search on your website.\n\n` +
          `📸 Product Image: ${itemImageUrl}\n` +
          `Item Code: ${item.id}\n\n` +
          `Please share availability & bespoke tailoring details.`
        );
        const whatsappUrl = `https://wa.me/${STORE_PHONE}?text=${whatsappText}`;

        const card = document.createElement('div');
        card.className = 'search-item-card';
        card.innerHTML = `
          <div class="search-item-thumb" data-id="${item.id}" role="button" tabindex="0" title="Click to view full head-to-toe image">
            <img src="${item.image}" alt="${item.title}" loading="lazy" />
          </div>
          <div class="search-item-info">
            <div class="search-item-header-row">
              <span class="search-item-cat">${item.categoryLabel} · ${item.badge || 'Haute Couture'}</span>
              <span class="search-vector-badge" title="Semantic Vector Match Score">
                ⚡ ${res.similarityPercent}% Vector Match
              </span>
            </div>
            <h4 class="search-item-title">${item.title}</h4>
            <div class="search-item-meta">
              <span><strong>🧵 Fabric:</strong> ${item.fabric}</span>
              <span><strong>✨ Work:</strong> ${item.work}</span>
            </div>
            <div class="search-item-tags">
              <span class="search-tag-chip">🎨 ${item.color}</span>
              <span class="search-tag-chip">👑 ${item.occasion}</span>
              <span class="search-tag-chip" style="color:var(--gold-light);border-color:rgba(212,175,55,0.4)">⚜️ ${res.matchReason}</span>
            </div>
            <div class="search-item-actions">
              <div class="search-item-price">${formattedPrice}</div>
              <div class="search-item-btns">
                <button type="button" class="btn btn-outline-gold btn-sm btn-search-quickview" data-id="${item.id}">
                  Quick View 🔍
                </button>
                <a href="${whatsappUrl}" target="_blank" rel="noopener noreferrer" class="btn btn-whatsapp btn-sm" title="Chat on WhatsApp">
                  Inquire 💬
                </a>
              </div>
            </div>
          </div>
        `;

        // Card clicks
        const thumb = card.querySelector('.search-item-thumb');
        if (thumb) {
          thumb.addEventListener('click', () => {
            closeRoyalSearch();
            openQuickView(item);
          });
        }
        const qvBtn = card.querySelector('.btn-search-quickview');
        if (qvBtn) {
          qvBtn.addEventListener('click', (e) => {
            e.stopPropagation();
            closeRoyalSearch();
            openQuickView(item);
          });
        }

        searchResultsGrid.appendChild(card);
      });
    }
  }

  // Real-time debounced search input handler
  if (royalSearchInput) {
    royalSearchInput.addEventListener('input', (e) => {
      clearTimeout(searchDebounceTimer);
      searchDebounceTimer = setTimeout(() => {
        executeSearch(e.target.value);
      }, 70); // lightning-fast 70ms debounce
    });

    // Enter key applies results to page catalog
    royalSearchInput.addEventListener('keydown', (e) => {
      if (e.key === 'Enter') {
        e.preventDefault();
        applySearchResultsToPage();
      }
    });
  }

  // Apply search results to the main Collections Catalog Grid
  function applySearchResultsToPage() {
    const q = royalSearchInput ? royalSearchInput.value.trim() : '';
    if (!q && currentSearchResults.length === 0) {
      closeRoyalSearch();
      return;
    }

    closeRoyalSearch();

    // Render filtered items in main catalog
    renderCatalog(currentSearchResults);

    // Show active search banner in Collections section
    if (catalogSearchFilterBanner && catalogSearchQueryDisplay && catalogSearchResultCount) {
      catalogSearchQueryDisplay.textContent = q ? `"${q}"` : 'Vector Filtered Masterpieces';
      catalogSearchResultCount.textContent = currentSearchResults.length;
      catalogSearchFilterBanner.style.display = 'flex';
    }

    // Smooth scroll to collections
    const collectionsSection = document.getElementById('collections');
    if (collectionsSection) {
      collectionsSection.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }
  }

  if (applySearchToPageBtn) {
    applySearchToPageBtn.addEventListener('click', applySearchResultsToPage);
  }

  // Clear Search button on collections page
  if (catalogClearSearchBtn) {
    catalogClearSearchBtn.addEventListener('click', () => {
      if (catalogSearchFilterBanner) {
        catalogSearchFilterBanner.style.display = 'none';
      }
      if (royalSearchInput) {
        royalSearchInput.value = '';
      }
      // Reset filter tabs to All
      filterTabs.forEach(t => t.classList.remove('active'));
      const allTab = document.querySelector('.filter-tab[data-filter="all"]');
      if (allTab) allTab.classList.add('active');
      renderCatalog(CATALOG_DATA);
    });
  }

  // Global Keyboard Shortcuts
  document.addEventListener('keydown', (e) => {
    // Escape key closes search modal
    if (e.key === 'Escape') {
      if (royalSearchModal && royalSearchModal.classList.contains('active')) {
        closeRoyalSearch();
      }
    }

    // Slash key (/) opens search if user is not in an input or textarea
    if (e.key === '/' && !['INPUT', 'TEXTAREA', 'SELECT'].includes(document.activeElement.tagName)) {
      e.preventDefault();
      openRoyalSearch();
    }

    // Ctrl+K or Cmd+K opens search
    if ((e.ctrlKey || e.metaKey) && (e.key === 'k' || e.key === 'K')) {
      e.preventDefault();
      openRoyalSearch();
    }
  });

  // Expose search API globally for debugging or external triggers
  window.openRoyalSearch = openRoyalSearch;
  window.closeRoyalSearch = closeRoyalSearch;

  // Initial Render of All Items
  if (typeof CATALOG_DATA !== 'undefined') {
    renderCatalog(CATALOG_DATA);
  }
});
