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
    this.closeBtn = document.getElementById('aiStylistCloseBtn');
    this.quickPills = document.querySelectorAll('.ai-prompt-pill');
  }

  initEventListeners() {
    if (this.openBtn) {
      this.openBtn.addEventListener('click', () => this.open());
    }
    if (this.closeBtn) {
      this.closeBtn.addEventListener('click', () => this.close());
    }
    if (this.sendBtn) {
      this.sendBtn.addEventListener('click', () => {
        const text = this.inputField.value.trim();
        if (text) this.handleUserQuery(text);
      });
    }
    if (this.inputField) {
      this.inputField.addEventListener('keydown', (e) => {
        if (e.key === 'Enter') {
          const text = this.inputField.value.trim();
          if (text) this.handleUserQuery(text);
        }
      });
    }

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
    this.container.classList.add('ai-modal-open');
    this.isOpen = true;
    if (this.inputField) this.inputField.focus();
    document.body.style.overflow = 'hidden';
  }

  close() {
    if (!this.container) return;
    this.container.classList.remove('ai-modal-open');
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
    this.inputField.value = '';

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
    }, 600);
  }

  synthesizeAdviceAndRecommendations(query) {
    const q = query.toLowerCase();
    let rationale = "";
    let matchedItems = [];
    let priorityOccasion = null;

    // 1. Detect Intent / Occasion
    if (q.includes("reception") || q.includes("cocktail") || q.includes("evening")) {
      rationale = "For a grand evening reception or cocktail gala, an obsidian velvet Prince coat, an Angrakha tuxedo-fusion, or a navy Jodhpuri Bandhgala commands utmost prestige.";
      priorityOccasion = "reception";
    } else if (q.includes("baraat") || q.includes("nikkah") || q.includes("main wedding") || q.includes("shaadi") || q.includes("groom")) {
      rationale = "For the grand Baraat and Nikkah ceremonies, the authentic Nizami Khada Sherwani in pure raw silk with Old City hand-zardozi and antique gold resham is the timeless choice worn by generations of royalty.";
      priorityOccasion = "wedding";
    } else if (q.includes("haldi") || q.includes("mehendi") || q.includes("sangeet") || q.includes("day")) {
      rationale = "For lively Day events such as Sangeet or Mehendi, we recommend flowing mulberry silk kurtas paired with hand-loomed Banarasi brocade bundis or asymmetric draped jackets for effortless movement.";
      priorityOccasion = "festive";
    } else if (q.includes("accessory") || q.includes("safa") || q.includes("turban") || q.includes("pagdi") || q.includes("mojari") || q.includes("shoe")) {
      rationale = "A royal groom's ensemble is complete only with coronation accessories: hand-tied Chanderi safa crowned with a Kundan Kalgi, Basra-style pearl mala, and genuine velvet zardozi mojaris.";
      priorityOccasion = "accessories";
    } else if (q.includes("price") || q.includes("cost") || q.includes("how much") || q.includes("budget") || q.includes("cheap") || q.includes("under")) {
      rationale = "As verified on WedMeGood, our ready-to-wear wedding sherwanis start from ₹10,000 to ₹40,000+, luxury kurtas from ₹3,500, and bespoke hand-zardozi royal bridal pieces are tailored to your budget.";
    } else if (q.includes("nri") || q.includes("usa") || q.includes("uk") || q.includes("chicago") || q.includes("dubai") || q.includes("abroad") || q.includes("ship")) {
      rationale = "We cater extensively to global grooms in the USA, UK, and UAE! We conduct live high-definition video consultations, digital measurement calibrations, and deliver worldwide via DHL/FedEx Express in 5-7 business days.";
    } else {
      rationale = "Based on our 130-year heritage of Asaf Jahi court tailoring, here are our recommended royal master creations for you:";
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

      // Category matching
      if (priorityOccasion === "wedding" && item.category === "sherwani") score += 10;
      if (priorityOccasion === "reception" && (item.category === "bandhgala" || item.category === "indo-western")) score += 10;
      if (priorityOccasion === "festive" && item.category === "kurta-sets") score += 10;
      if (priorityOccasion === "accessories" && item.category === "accessories") score += 10;

      // Color matching
      if (q.includes("red") || q.includes("maroon") || q.includes("ruby")) {
        if (item.color.toLowerCase().includes("crimson") || item.color.toLowerCase().includes("ruby")) score += 8;
      }
      if (q.includes("emerald") || q.includes("green")) {
        if (item.color.toLowerCase().includes("emerald") || item.color.toLowerCase().includes("green")) score += 8;
      }
      if (q.includes("ivory") || q.includes("white") || q.includes("gold")) {
        if (item.color.toLowerCase().includes("ivory") || item.color.toLowerCase().includes("gold")) score += 8;
      }
      if (q.includes("black") || q.includes("navy") || q.includes("blue")) {
        if (item.color.toLowerCase().includes("black") || item.color.toLowerCase().includes("navy")) score += 8;
      }

      return { item, score };
    })
    .filter(res => res.score > 0)
    .sort((a, b) => b.score - a.score)
    .map(res => res.item)
    .slice(0, 3);

    // If no strong matches, fallback to 2 popular signature items
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

            const waText = encodeURIComponent(
              `Hello Maqdoom Brothers, Nizam AI recommended "${item.title}" (${item.priceRange}). I would like to inquire about availability & custom fitting.`
            );

            return `
              <div class="ai-rec-card">
                <img src="${item.image}" alt="${item.title}" class="ai-rec-img" />
                <div class="ai-rec-info">
                  <span class="ai-rec-tag">${item.categoryLabel}</span>
                  <h5 class="ai-rec-title">${item.title}</h5>
                  <div class="ai-rec-price">${formattedPrice}</div>
                  <div class="ai-rec-actions">
                    <a href="https://wa.me/918686684144?text=${waText}" target="_blank" class="btn btn-whatsapp btn-sm">
                      WhatsApp Inquire
                    </a>
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
    // Standard menswear sizing 36, 38, 40, 42, 44, 46
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
