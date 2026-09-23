# Maqdoom Bros Designers Pvt Ltd (Est. 1895)
### Royal Hyderabadi Menswear Haute Couture · AI-Era & Geo-Intelligent Web Platform

Official website for **Maqdoom Bros Designers Pvt Ltd**—the historic clothiers to the Nizams of Hyderabad, located on Pathergatti Road opposite the Madina Building.

---

## 🏛️ Store & Business Dossier

* **Enterprise:** Maqdoom Bros Designers Pvt Ltd / Maqdoom Brothers
* **Founded:** 1895 (Over 130 Years of Royal Heritage)
* **Flagship Address:** Shop No. 22-7-267/a11, Pathergatti Road, Opp. Madina Building, Hyderabad, TG – 500002
* **Store Coordinates:** `17.368124, 78.476143`
* **Direct Helpline / WhatsApp:** `+91 98490 07869` / `098490 07869`
* **Operating Hours:** Open Daily: 10:30 AM – 11:00 PM (23:00 hrs) IST
* **Official Instagram:** [@maqdoombrothers](https://www.instagram.com/maqdoombrothers/)
* **WedMeGood Profile:** [Maqdoom Brothers Groom Wear Hyderabad](https://www.wedmegood.com/profile/Maqdoom-Brothers-23209)
* **Bing Maps:** [Maqdoom Bros Designers Pvt Ltd](https://www.bing.com/maps?q=Maqdoom+Bros+Designers+Pvt+Ltd&ss=ypid.YN7BBC08CA6929BC53)

---

## ⚡ Next-Gen AI & Geo Features

1. **Real-Time Geo-Intelligence (`js/geo-engine.js`):**
   * Computes Haversine distance from the Pathergatti flagship.
   * **Local Mode (<60 km):** Displays exact distance (e.g. *"6.7 km from Pathergatti"*), store status ("Open until 11 PM"), and one-tap Bing Maps & Google Maps navigation.
   * **Global NRI Mode:** Automatically detects visitors from the USA, UK, UAE, or Canada, updates currency estimates (USD, GBP, AED), and highlights the *NRI Video Fitting Concierge*.

2. **Nizam AI Royal Stylist (`js/ai-stylist.js`):**
   * Conversational text & prompt-based sartorial advisor trained on 130 years of Asaf Jahi royal tailoring.
   * Employs client-side **RAG (Retrieval-Augmented Generation)** to match wedding occasions, colors (e.g. *"Bride wearing maroon"*), and budgets.
   * Delivers interactive outfit recommendation cards with pre-filled WhatsApp ordering.

3. **Virtual AI Size & Fit Estimator:**
   * Calculates standard menswear sizing (e.g., `40R`), Achkan length, and custom cut recommendations based on height (cm), chest (inches), and silhouette preferences.

4. **Curated Collections & Verified Pricing:**
   * Royal Wedding Sherwanis: ₹10,000 – ₹42,000+
   * Nawabi Bandhgalas & Jodhpuris: ₹12,000 – ₹35,000
   * Indo-Western & Reception Ensembles: ₹14,000 – ₹38,000
   * Festive Kurtas & Nehru Jackets: ₹3,500 – ₹15,000
   * Royal Groom Accessories (Safas, Kalgis, Mojaris): ₹1,500 – ₹8,500

---

## 🚀 Running Locally

### Option A: Direct Browser Preview
Double-click `index.html` to open the website directly in any web browser.

### Option B: Local Node.js Server
```bash
node server.js
```
Then visit: `http://localhost:3000`

---

## ☁️ Deployment (Vercel / Netlify / Cloudflare)

This project is configured with zero-config serverless architecture:
1. Push this folder to a GitHub repository.
2. Import into **Vercel** or **Netlify**.
3. (Optional) In project settings, add your environment variable:
   * `GEMINI_API_KEY` or `OPENAI_API_KEY` to connect the serverless edge endpoint (`api/ai-chat.js`) to live cloud LLMs.
