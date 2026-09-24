/**
 * MAQDOOM BROS DESIGNERS PVT LTD - Interactive Application Engine
 * Flagship: Pathergatti Road, Opp. Madina Building, Hyderabad, TG
 * Contact: +91 98490 07869 | Instagram: @maqdoombrothers
 * AI-Era & Geo-Location Integration Engine
 */

document.addEventListener('DOMContentLoaded', () => {
  // Store Constants
  const STORE_PHONE = "919849007869"; // WhatsApp / Calling
  const STORE_HOURS_OPEN = 10.5; // 10:30 AM
  const STORE_HOURS_CLOSE = 23.0; // 11:00 PM

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

  // 1. Live Store Status Indicator
  function updateStoreStatus() {
    if (!storeStatusText) return;
    const now = new Date();
    // UTC to IST offset is +5.5 hours
    const utc = now.getTime() + (now.getTimezoneOffset() * 60000);
    const istTime = new Date(utc + (3600000 * 5.5));
    const currentHour = istTime.getHours() + (istTime.getMinutes() / 60);

    if (currentHour >= STORE_HOURS_OPEN && currentHour < STORE_HOURS_CLOSE) {
      storeStatusText.innerHTML = `<span class="status-dot"></span> Open Now · Closes 11:00 PM`;
    } else {
      storeStatusText.innerHTML = `<span class="status-dot" style="background:#e72e77;box-shadow:0 0 8px #e72e77"></span> Currently Closed · Opens at 10:30 AM`;
    }
  }
  updateStoreStatus();
  setInterval(updateStoreStatus, 60000);

  // 2. Render Catalog Cards with Currency Localization
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

      const whatsappText = encodeURIComponent(
        `Hello Maqdoom Brothers, I am interested in inquiring about "${item.title}" (${item.priceRange}) seen on your website. Please share availability & custom fitting details.`
      );
      const whatsappUrl = `https://wa.me/${STORE_PHONE}?text=${whatsappText}`;

      card.innerHTML = `
        <div class="card-media">
          <img src="${item.image}" alt="${item.title}" loading="lazy" />
          <span class="card-badge">${item.badge || item.categoryLabel}</span>
          <div class="card-quick-actions">
            <button class="btn btn-outline-gold btn-quickview" data-id="${item.id}" style="flex:1;">
              Quick View
            </button>
            <a href="${whatsappUrl}" target="_blank" rel="noopener noreferrer" class="btn btn-whatsapp" style="padding: 10px 14px;" title="Chat on WhatsApp">
              <svg style="width:18px;height:18px;fill:#fff" viewBox="0 0 24 24"><path d="M.057 24l1.687-6.163c-1.041-1.804-1.588-3.849-1.587-5.946.003-6.556 5.338-11.891 11.893-11.891 3.181.001 6.167 1.24 8.413 3.488 2.245 2.248 3.481 5.236 3.48 8.414-.003 6.557-5.338 11.892-11.893 11.892-1.99-.001-3.951-.5-5.688-1.448l-6.305 1.654zm6.597-3.807c1.676.995 3.276 1.591 5.392 1.592 5.448 0 9.886-4.434 9.889-9.885.002-5.462-4.415-9.89-9.881-9.892-5.452 0-9.887 4.434-9.889 9.884-.001 2.225.651 3.891 1.746 5.634l-.999 3.648 3.742-.981zm11.387-5.464c-.074-.124-.272-.198-.57-.347-.297-.149-1.758-.868-2.031-.967-.272-.099-.47-.149-.669.149-.198.297-.768.967-.941 1.165-.173.198-.347.223-.644.074-.297-.149-1.255-.462-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.297-.347.446-.521.151-.172.2-.296.3-.495.099-.198.05-.372-.025-.521-.075-.148-.669-1.611-.916-2.206-.242-.579-.487-.501-.669-.51l-.57-.01c-.198 0-.52.074-.792.372s-1.04 1.016-1.04 2.479 1.065 2.876 1.213 3.074c.149.198 2.095 3.2 5.076 4.487.709.306 1.263.489 1.694.626.712.226 1.36.194 1.872.118.571-.085 1.758-.719 2.006-1.413.248-.695.248-1.29.173-1.414z"/></svg>
            </a>
          </div>
        </div>
        <div class="card-body">
          <span class="card-category">${item.categoryLabel}</span>
          <h3 class="card-title">${item.title}</h3>
          <ul class="card-details-list">
            <li><strong>Fabric:</strong> ${item.fabric}</li>
            <li><strong>Craft:</strong> ${item.work}</li>
          </ul>
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

    // Attach Quick View Click Handlers
    document.querySelectorAll('.btn-quickview').forEach(btn => {
      btn.addEventListener('click', (e) => {
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

    if (modalImage) modalImage.src = item.image;
    if (modalCategory) modalCategory.textContent = item.categoryLabel;
    if (modalTitle) modalTitle.textContent = item.title;
    if (modalPrice) modalPrice.textContent = formattedPrice;
    if (modalDesc) modalDesc.textContent = item.description;
    if (modalFabric) modalFabric.textContent = item.fabric;
    if (modalCraft) modalCraft.textContent = item.work;
    if (modalOccasion) modalOccasion.textContent = item.occasion;

    const whatsappText = encodeURIComponent(
      `Assalamu Alaikum / Greetings Maqdoom Brothers, I would like to inquire about "${item.title}" (${item.priceRange}) for my upcoming wedding event. Can you assist me with custom tailoring & video consultation?`
    );
    if (modalWhatsAppBtn) {
      modalWhatsAppBtn.href = `https://wa.me/${STORE_PHONE}?text=${whatsappText}`;
    }

    quickViewModal.classList.add('open');
    document.body.style.overflow = 'hidden';
  }

  function closeQuickView() {
    if (!quickViewModal) return;
    quickViewModal.classList.remove('open');
    document.body.style.overflow = '';
  }

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

  document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape' && quickViewModal && quickViewModal.classList.contains('open')) {
      closeQuickView();
    }
  });

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

      alert(`Thank you, ${name}! Your consultation request has been prepared. We are redirecting you to our official WhatsApp Concierge (+91 98490 07869) to confirm your time slot.`);
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
      navAiStylistBtn.addEventListener('click', () => {
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

  // Initial Render of All Items
  if (typeof CATALOG_DATA !== 'undefined') {
    renderCatalog(CATALOG_DATA);
  }
});
