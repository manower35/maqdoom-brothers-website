/**
 * MAQDOOM BROS DESIGNERS PVT LTD - Geo-Intelligence Engine
 * Flagship Coordinates: 17.368124, 78.476143 (Pathergatti Road, Hyderabad)
 * Detects visitor location, computes exact distance, and customizes local/global experience.
 */

const FLAGSHIP_COORDS = {
  lat: 17.368124,
  lng: 78.476143,
  name: "Maqdoom Bros Designers Pvt Ltd",
  address: "22-7-267/a11, Pathergatti Road, Opp. Madina Building, Hyderabad, TG",
  phone: "+91 98490 07869"
};

// Approximate exchange rates relative to INR (base)
const CURRENCY_RATES = {
  INR: { symbol: "₹", rate: 1, label: "INR (₹)" },
  USD: { symbol: "$", rate: 0.012, label: "USD ($)" },
  GBP: { symbol: "£", rate: 0.0094, label: "GBP (£)" },
  AED: { symbol: "AED ", rate: 0.044, label: "AED (د.إ)" },
  EUR: { symbol: "€", rate: 0.011, label: "EUR (€)" },
  CAD: { symbol: "CA$", rate: 0.016, label: "CAD ($)" }
};

let currentCurrency = "INR";
let userLocationData = {
  mode: "detecting", // 'local' | 'domestic' | 'nri'
  city: "Hyderabad",
  country: "India",
  countryCode: "IN",
  distanceKm: null,
  isNearStore: false
};

// Calculate Haversine distance in kilometers
function calculateHaversineDistance(lat1, lon1, lat2, lon2) {
  const R = 6371; // Radius of earth in km
  const dLat = (lat2 - lat1) * Math.PI / 180;
  const dLon = (lon2 - lon1) * Math.PI / 180;
  const a = 
    Math.sin(dLat/2) * Math.sin(dLat/2) +
    Math.cos(lat1 * Math.PI / 180) * Math.cos(lat2 * Math.PI / 180) * 
    Math.sin(dLon/2) * Math.sin(dLon/2);
  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1-a));
  return Math.round((R * c) * 10) / 10;
}

// Convert INR price text (e.g., "₹28,000 – ₹42,000") to target currency
function formatCurrencyRange(inrString, targetCurrency = currentCurrency) {
  if (targetCurrency === "INR") return inrString;
  const rateInfo = CURRENCY_RATES[targetCurrency] || CURRENCY_RATES.USD;
  
  // Extract numbers from string
  return inrString.replace(/₹\s*([0-9,]+)/g, (match, p1) => {
    const numeric = parseInt(p1.replace(/,/g, ''), 10);
    const converted = Math.round(numeric * rateInfo.rate);
    return `${rateInfo.symbol}${converted.toLocaleString()}`;
  });
}

// Update Geo-Banner UI based on location detection
function updateGeoBannerUI() {
  const geoBanner = document.getElementById('geoIntelligenceBanner');
  if (!geoBanner) return;

  const { mode, city, country, distanceKm } = userLocationData;

  if (mode === 'local') {
    const distText = distanceKm !== null ? `${distanceKm} km away` : 'nearby';
    geoBanner.innerHTML = `
      <div class="geo-banner-inner local-pulse">
        <div class="geo-icon">📍</div>
        <div class="geo-text">
          <strong>Hyderabad Resident / Visitor Detected:</strong> You are approximately <strong>${distText}</strong> from our Pathergatti Flagship (Opp. Madina Building).
          <span class="geo-highlight">Open today until 11:00 PM · Valet assistance available.</span>
        </div>
        <div class="geo-actions">
          <a href="https://www.bing.com/maps?q=Maqdoom+Bros+Designers+Pvt+Ltd&ss=ypid.YN7BBC08CA6929BC53" target="_blank" class="btn btn-gold btn-sm">
            Live Directions
          </a>
          <a href="tel:09849007869" class="btn btn-outline-gold btn-sm">
            Call Store (098490 07869)
          </a>
        </div>
      </div>
    `;
  } else if (mode === 'nri') {
    geoBanner.innerHTML = `
      <div class="geo-banner-inner nri-pulse">
        <div class="geo-icon">✈️</div>
        <div class="geo-text">
          <strong>International Groom Concierge (${city ? `${city}, ` : ''}${country}):</strong> 
          We dress grooms across the globe with live video fittings, curated fabric samples, and insured 5–7 day DHL/FedEx worldwide delivery.
          <span class="geo-highlight">Prices shown in ${currentCurrency} (${CURRENCY_RATES[currentCurrency]?.symbol || '$'}).</span>
        </div>
        <div class="geo-actions">
          <a href="https://wa.me/919849007869?text=Hello%20Maqdoom%20Brothers%2C%20I%20am%20contacting%20from%20${encodeURIComponent(country)}%20for%20an%20international%20wedding%20video%20fitting." target="_blank" class="btn btn-gold btn-sm">
            Book NRI Video Fitting
          </a>
          <button id="geoCurrencyBtn" class="btn btn-outline-gold btn-sm">
            Change Currency
          </button>
        </div>
      </div>
    `;
  } else {
    // Domestic India (outside Hyderabad)
    geoBanner.innerHTML = `
      <div class="geo-banner-inner domestic-pulse">
        <div class="geo-icon">🇮🇳</div>
        <div class="geo-text">
          <strong>Welcome from ${city}, India:</strong> Experience authentic Old City Hyderabadi royal craftsmanship delivered directly to your doorstep with guaranteed wedding date delivery.
        </div>
        <div class="geo-actions">
          <a href="#booking" class="btn btn-gold btn-sm">Book Trial Fit</a>
          <a href="https://wa.me/919849007869?text=Hello%20Maqdoom%20Brothers%2C%20inquiring%20from%20${encodeURIComponent(city)}%20about%20express%20wedding%20stitching." target="_blank" class="btn btn-outline-gold btn-sm">
            WhatsApp Concierge
          </a>
        </div>
      </div>
    `;
  }
}

// Detect Location using Browser Geolocation first, then fallback to fast IP-API
async function initializeGeoIntelligence() {
  // Check if browser geolocation is supported
  if (navigator.geolocation) {
    navigator.geolocation.getCurrentPosition(
      (pos) => {
        const { latitude, longitude } = pos.coords;
        const dist = calculateHaversineDistance(latitude, longitude, FLAGSHIP_COORDS.lat, FLAGSHIP_COORDS.lng);
        userLocationData.distanceKm = dist;

        if (dist <= 60) {
          userLocationData.mode = 'local';
          userLocationData.isNearStore = true;
          userLocationData.city = "Hyderabad";
        } else {
          // If within India coordinates approx (lat 8-37, lon 68-97)
          if (latitude >= 8 && latitude <= 37 && longitude >= 68 && longitude <= 97) {
            userLocationData.mode = 'domestic';
          } else {
            userLocationData.mode = 'nri';
            currentCurrency = "USD";
          }
        }
        updateGeoBannerUI();
        notifyCurrencyOrLocationChange();
      },
      () => {
        // Fallback to IP geolocation
        fallbackIpGeo();
      },
      { timeout: 5000, maximumAge: 600000 }
    );
  } else {
    fallbackIpGeo();
  }
}

// Fallback IP Geolocation
async function fallbackIpGeo() {
  try {
    const res = await fetch('https://ipapi.co/json/');
    if (res.ok) {
      const data = await res.json();
      userLocationData.city = data.city || "Hyderabad";
      userLocationData.country = data.country_name || "India";
      userLocationData.countryCode = data.country_code || "IN";

      if (data.latitude && data.longitude) {
        userLocationData.distanceKm = calculateHaversineDistance(
          data.latitude,
          data.longitude,
          FLAGSHIP_COORDS.lat,
          FLAGSHIP_COORDS.lng
        );
      }

      if (data.country_code === "IN") {
        if (data.region === "Telangana" || (userLocationData.distanceKm && userLocationData.distanceKm < 75)) {
          userLocationData.mode = 'local';
        } else {
          userLocationData.mode = 'domestic';
        }
      } else {
        userLocationData.mode = 'nri';
        // Auto-select currency
        if (data.country_code === "US") currentCurrency = "USD";
        else if (data.country_code === "GB") currentCurrency = "GBP";
        else if (data.country_code === "AE") currentCurrency = "AED";
        else if (data.country_code === "CA") currentCurrency = "CAD";
        else currentCurrency = "USD";
      }
    } else {
      userLocationData.mode = 'local'; // default to local pride
    }
  } catch (err) {
    userLocationData.mode = 'local';
  }
  updateGeoBannerUI();
  notifyCurrencyOrLocationChange();
}

function setCurrency(code) {
  if (CURRENCY_RATES[code]) {
    currentCurrency = code;
    notifyCurrencyOrLocationChange();
    updateGeoBannerUI();
  }
}

function notifyCurrencyOrLocationChange() {
  // Re-render prices across catalog if app.js is active
  if (window.onGeoOrCurrencyUpdate) {
    window.onGeoOrCurrencyUpdate(currentCurrency, userLocationData);
  }
}

// Attach to window
window.GeoEngine = {
  calculateHaversineDistance,
  formatCurrencyRange,
  setCurrency,
  getUserLocation: () => userLocationData,
  getCurrentCurrency: () => currentCurrency,
  init: initializeGeoIntelligence
};
