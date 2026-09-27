/**
 * MAQDOOM BROS DESIGNERS PVT LTD - Nizam AI Royal Stylist Engine
 * AI-Era Conversational Concierge with RAG Catalog Search & Smart Styling Advisor
 * (Voice-free text & prompt-based intelligent advisor)
 */

class NizamAIStylist {
  constructor(catalogData) {
    this.catalog = catalogData || [];
    this.isOpen = false;
    this.chatHistory = [];
    
    this.initElements();
    this.initEventListeners();
    this.seedInitialGreeting();
  }

  initElements() {
    this.container = document.getElementById('aiStylistModal');
    this.chatBody = document.getElementById('aiChatBody');
    this.inputField = document.getElementById('aiUserInput');
    this.sendBtn = document.getElementById('aiSendBtn');
    this.openBtn = document.getElementById('aiStylistFloatingTrigger');
    this.navBtn = document.getElementById('navAiStylistBtn');
    this.closeBtn = document.getElementById('aiStylistCloseBtn');
    this.quickPills = document.querySelectorAll('.ai-prompt-pill');
  }

  initEventListeners() {
    // Open triggers
    if (this.openBtn) {
      this.openBtn.addEventListener('click', (e) => {
        e.preventDefault();
        this.open();
      });
    }
    if (this.navBtn) {
      this.navBtn.addEventListener('click', (e) => {
        e.preventDefault();
        this.open();
      });
    }
    document.querySelectorAll('[data-open-ai], .ai-trigger').forEach(btn => {
      btn.addEventListener('click', (e) => {
        e.preventDefault();
        this.open();
      });
    });

    // Close triggers
    if (this.closeBtn) {
      this.closeBtn.addEventListener('click', (e) => {
        e.preventDefault();
        this.close();
      });
    }

    // Backdrop click closes modal
    if (this.container) {
      this.container.addEventListener('click', (e) => {
        if (e.target === this.container) {
          this.close();
        }
      });
    }

    // Escape key closes modal
    document.addEventListener('keydown', (e) => {
      if (e.key === 'Escape' && this.isOpen) {
        this.close();
      }
    });

    // Send on button click
    if (this.sendBtn) {
      this.sendBtn.addEventListener('click', () => {
        const text = this.inputField ? this.inputField.value.trim() : '';
        if (text) this.handleUserQuery(text);
      });
    }

    // Send on Enter key
    if (this.inputField) {
      this.inputField.addEventListener('keydown', (e) => {
        if (e.key === 'Enter') {
          const text = this.inputField.value.trim();
          if (text) this.handleUserQuery(text);
        }
      });
    }

    // Quick prompt pills
    if (this.quickPills) {
      this.quickPills.forEach(pill => {
        pill.addEventListener('click', () => {
          const prompt = pill.dataset.prompt || pill.textContent.trim();
          this.handleUserQuery(prompt);
        });
      });
    }
  }

  open() {
    if (!this.container) return;
    this.container.style.display = 'flex';
    this.container.classList.add('ai-modal-open');
    this.isOpen = true;
    this.seedInitialGreeting();
    if (this.inputField) {
      setTimeout(() => this.inputField.focus(), 80);
    }
    document.body.style.overflow = 'hidden';
  }

  close() {
    if (!this.container) return;
    this.container.classList.remove('ai-modal-open');
    this.container.style.display = 'none';
    this.isOpen = false;
    document.body.style.overflow = '';
  }

  seedInitialGreeting() {
    if (!this.chatBody || this.chatBody.children.length > 0) return;
    const greeting = `
      <div class="ai-msg ai-bot-msg">
        <div class="ai-bot-avatar">👑</div>
        <div class="ai-bubble">
          <p><strong>Aadab & Welcome!</strong> I am your <strong>Nizam AI Royal Stylist</strong>, trained on 130 years of Asaf Jahi court tailoring at Maqdoom Brothers (Est. 1895).</p>
          <p>Ask me about matching bride colors, wedding occasions (Baraat, Nikkah, Reception, Sangeet), fabrics, budget ranges, or click any prompt below.</p>
        </div>
      </div>
    `;
    this.chatBody.innerHTML = greeting;
  }

  handleUserQuery(query) {
    if (!query || !this.chatBody) return;
    if (this.inputField) this.inputField.value = '';

    // Render User Bubble
    const userMsgHtml = `
      <div class="ai-msg ai-user-msg">
        <div class="ai-bubble">${this.escapeHtml(query)}</div>
      </div>
    `;
    this.chatBody.insertAdjacentHTML('beforeend', userMsgHtml);
    this.chatBody.scrollTop = this.chatBody.scrollHeight;

    // Show Typing Indicator
    const typingId = 'typingIndicator_' + Date.now();
    const typingHtml = `
      <div id="${typingId}" class="ai-msg ai-bot-msg">
        <div class="ai-bot-avatar">👑</div>
        <div class="ai-bubble ai-typing-bubble">
          <span></span><span></span><span></span>
        </div>
      </div>
    `;
    this.chatBody.insertAdjacentHTML('beforeend', typingHtml);
    this.chatBody.scrollTop = this.chatBody.scrollHeight;

    // Process Query with Intelligent Semantic RAG
    setTimeout(() => {
      const typingEl = document.getElementById(typingId);
      if (typingEl) typingEl.remove();

      const response = this.synthesizeAdviceAndRecommendations(query);
      this.renderBotResponse(response);
    }, 450);
  }

  synthesizeAdviceAndRecommendations(query) {
    const q = query.toLowerCase();
    let rationale = "";
    let matchedItems = [];
    let priorityOccasion = null;

    // 1. Detect Intent / Occasion in prioritized order
    if (q.includes("accessory") || q.includes("accessories") || q.includes("safa") || q.includes("turban") || q.includes("pagdi") || q.includes("kalgi") || q.includes("mojari") || q.includes("jooti") || q.includes("shoe")) {
      rationale = "A royal Hyderabadi groom's coronation look is incomplete without authentic accessories: our hand-tied Chanderi silk and gold tissue Safa crowned with a Kundan Kalgi and Basra pearls, paired with handcrafted deep crimson velvet mojaris.";
      priorityOccasion = "accessories";
    } else if (q.includes("bride in maroon") || q.includes("bride is wearing") || q.includes("maroon") || q.includes("crimson") || q.includes("red")) {
      rationale = "If your bride is wearing deep maroon or ruby crimson, you have two imperial styling paths: coordinate seamlessly with our Royal Maroon Zardozi Sherwani, or create a regal royal contrast with our Grand Asaf Jahi Ivory Sherwani adorned with a deep maroon velvet stole!";
      priorityOccasion = "maroon_match";
    } else if (q.includes("reception") || q.includes("cocktail") || q.includes("evening") || q.includes("bandhgala") || q.includes("achkan") || q.includes("prince coat")) {
      rationale = "For a grand evening reception or cocktail gala, our Nawabi Royal Ivory Achkan with velvet crest embroidery, or our Royal Crimson Brocade Angrakha commands utmost prestige on stage.";
      priorityOccasion = "reception";
    } else if (q.includes("haldi") || q.includes("mehendi") || q.includes("sangeet") || q.includes("kurta") || q.includes("bundi") || q.includes("waistcoat")) {
      rationale = "For pre-wedding celebrations such as Sangeet or Mehendi, we recommend pure mulberry silk kurta sets paired with our Royal Blue raw silk bundi or festive crimson Banarasi gold brocade kurta for effortless elegance.";
      priorityOccasion = "festive";
    } else if (q.includes("baraat") || q.includes("nikkah") || q.includes("wedding") || q.includes("shaadi") || q.includes("groom")) {
      rationale = "For the grand Baraat and Nikkah ceremonies, the authentic Nizam Darbar Khada Sherwani in pure raw silk with Old City hand-zardozi and antique gold resham is the timeless choice worn by generations of nobility.";
      priorityOccasion = "wedding";
    } else if (q.includes("price") || q.includes("cost") || q.includes("budget") || q.includes("under") || q.includes("30,000") || q.includes("30k") || q.includes("cheap")) {
      rationale = "Our ready-to-wear and bespoke wedding collections offer verified transparent pricing: festive silk kurta sets from ₹6,500, royal sherwanis starting from ₹20,000 to ₹35,000, and bespoke haute-couture bridal pieces tailored to your exact budget.";
      priorityOccasion = "budget";
    } else if (q.includes("nri") || q.includes("usa") || q.includes("uk") || q.includes("canada") || q.includes("dubai") || q.includes("abroad") || q.includes("ship") || q.includes("video")) {
      rationale = "We dress NRI grooms worldwide across the USA, UK, Canada, and UAE! We conduct live high-definition video consultations, millimeter digital measurement guidance, and provide insured door-to-door DHL/FedEx courier delivery in 5-7 business days.";
      priorityOccasion = "nri";
    } else {
      rationale = "Based on our 130-year heritage of Asaf Jahi court tailoring, here are our signature handcrafted master creations for you:";
    }

    // 2. Score and Rank Catalog Items (RAG)
    matchedItems = this.catalog.map(item => {
      let score = 0;
      const fullText = (item.title + " " + item.category + " " + item.fabric + " " + item.work + " " + item.color + " " + item.occasion + " " + item.description).toLowerCase();

      // Keyword matching
      const words = q.split(/\s+/).filter(w => w.length > 2);
      words.forEach(word => {
        if (fullText.includes(word)) score += 3;
      });

      // Priority occasion matching
      if (priorityOccasion === "accessories" && item.category === "accessories") score += 20;
      if (priorityOccasion === "maroon_match") {
        if (item.id === "sherwani-02" || item.id === "sherwani-03" || item.id === "sherwani-01") score += 25;
      }
      if (priorityOccasion === "wedding" && item.category === "sherwani") score += 12;
      if (priorityOccasion === "reception" && (item.category === "bandhgala" || item.id === "sherwani-05" || item.category === "indo-western")) score += 15;
      if (priorityOccasion === "festive" && item.category === "kurta-sets") score += 18;
      if (priorityOccasion === "budget") {
        if (item.category === "kurta-sets" || item.id === "indo-01" || item.id === "sherwani-04") score += 15;
      }

      // Color matching
      if (q.includes("maroon") || q.includes("red") || q.includes("crimson")) {
        if (item.color.toLowerCase().includes("maroon") || item.color.toLowerCase().includes("crimson") || item.color.toLowerCase().includes("ruby")) score += 10;
      }
      if (q.includes("ivory") || q.includes("white")) {
        if (item.color.toLowerCase().includes("ivory") || item.color.toLowerCase().includes("white")) score += 10;
      }
      if (q.includes("gold")) {
        if (item.color.toLowerCase().includes("gold")) score += 8;
      }
      if (q.includes("blue")) {
        if (item.color.toLowerCase().includes("blue") || item.color.toLowerCase().includes("sapphire")) score += 12;
      }

      return { item, score };
    })
    .filter(res => res.score > 0)
    .sort((a, b) => b.score - a.score)
    .map(res => res.item)
    .slice(0, 3);

    // If no strong matches, fallback to 2 flagship signature items
    if (matchedItems.length === 0) {
      matchedItems = this.catalog.slice(0, 2);
    }

    return { rationale, items: matchedItems };
  }

  renderBotResponse({ rationale, items }) {
    let itemsHtml = "";
    if (items && items.length > 0) {
      itemsHtml = `
        <div class="ai-recommendations-carousel">
          ${items.map(item => {
            const formattedPrice = window.GeoEngine 
              ? window.GeoEngine.formatCurrencyRange(item.priceRange) 
              : item.priceRange;

            const itemImageUrl = (typeof window !== 'undefined' && window.location && window.location.origin && window.location.origin.startsWith('http') && !window.location.origin.includes('localhost'))
              ? `${window.location.origin}/${(item.image || '').replace(/^\/+/, '')}`
              : `https://maqdoom-brothers-website.vercel.app/${(item.image || '').replace(/^\/+/, '')}`;

            const waText = encodeURIComponent(
              `Hello Maqdoom Brothers, Nizam AI recommended "${item.title}" (${item.priceRange}).\n\n` +
              `📸 Product Image: ${itemImageUrl}\n` +
              `Item Code: ${item.id}\n\n` +
              `I would like to inquire about availability & custom fitting.`
            );

            return `
              <div class="ai-rec-card">
                <img src="${item.image}" alt="${item.title}" class="ai-rec-img" />
                <div class="ai-rec-info">
                  <span class="ai-rec-tag">${item.categoryLabel}</span>
                  <h5 class="ai-rec-title">${item.title}</h5>
                  <div class="ai-rec-price">${formattedPrice}</div>
                  <div class="ai-rec-actions">
                    <a href="https://wa.me/918686684144?text=${waText}" target="_blank" rel="noopener noreferrer" class="btn btn-whatsapp btn-sm">
                      WhatsApp Inquire
                    </a>
                    <button class="btn btn-outline-gold btn-sm" onclick="if(window.nizamAI) window.nizamAI.close(); if(window.openQuickViewById) window.openQuickViewById('${item.id}');">
                      Quick View
                    </button>
                  </div>
                </div>
              </div>
            `;
          }).join('')}
        </div>
      `;
    }

    const botMsgHtml = `
      <div class="ai-msg ai-bot-msg">
        <div class="ai-bot-avatar">👑</div>
        <div class="ai-bubble">
          <p>${rationale}</p>
          ${itemsHtml}
        </div>
      </div>
    `;

    this.chatBody.insertAdjacentHTML('beforeend', botMsgHtml);
    this.chatBody.scrollTop = this.chatBody.scrollHeight;
  }

  escapeHtml(str) {
    if (!str) return '';
    return String(str)
      .replace(/&/g, "&amp;")
      .replace(/</g, "&lt;")
      .replace(/>/g, "&gt;")
      .replace(/"/g, "&quot;")
      .replace(/'/g, "&#039;");
  }
}

// Virtual AI Size & Fit Estimator
class VirtualSizeEstimator {
  static calculate(heightCm, chestInches, fitPreference) {
    let baseSize = Math.round(chestInches);
    if (baseSize % 2 !== 0) baseSize += 1;
    if (baseSize < 34) baseSize = 36;
    if (baseSize > 52) baseSize = 52;

    let lengthGuidance = "Standard Regal Length (approx 42 - 44 inches)";
    if (heightCm > 185) {
      lengthGuidance = "Tall Royal Achkan Cut (approx 46 inches)";
    } else if (heightCm < 168) {
      lengthGuidance = "Tapered Proportional Cut (approx 39 - 41 inches)";
    }

    let cutDescription = "Classic Nizami Fit with tailored chest canvasing and royal drape";
    if (fitPreference === "slim") {
      cutDescription = "Modern Slim-Tapered Silhouette with accentuated waist";
    } else if (fitPreference === "relaxed") {
      cutDescription = "Traditional Roomy Nawabi Cut for ease of movement during wedding rituals";
    }

    return {
      size: `${baseSize} (${baseSize}R)`,
      length: lengthGuidance,
      cut: cutDescription,
      recommendation: "Our master tailors at Pathergatti will verify measurements via video call or in-store trial for millimeter accuracy."
    };
  }
}

window.NizamAIStylist = NizamAIStylist;
window.VirtualSizeEstimator = VirtualSizeEstimator;
