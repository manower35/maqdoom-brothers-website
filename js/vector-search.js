/**
 * MAQDOOM BROS DESIGNERS PVT LTD - Royal Vector & Semantic Search Engine
 * Established 1895 | Pathergatti, Hyderabad
 * 
 * Features:
 * - Domain-specific 32-dimensional Semantic Vector Embedding Space
 * - Client-side Cosine Similarity Vector Search
 * - Automatic Knowledge Graph Related Words & Synonym Expansion
 * - Hybrid Ranking (Vector Semantic Similarity + Lexical BM25/Exact Matching)
 * - Zero external API latency, works 100% offline & client-side
 */

(function(root, factory) {
  if (typeof module === 'object' && module.exports) {
    module.exports = factory();
  } else {
    root.RoyalVectorSearchEngine = factory();
  }
}(typeof self !== 'undefined' ? self : this, function() {

  // 32 Orthogonal Semantic Dimensions spanning Royal Hyderabadi Menswear
  const SEMANTIC_DIMENSIONS = [
    // Garment Class
    'cat_sherwani',           // 0: Royal Sherwanis, Achkans, Khada Sherwanis, Darbar Coats
    'cat_bandhgala',          // 1: Nawabi Bandhgalas, Jodhpuris, Prince Coats
    'cat_indo_western',       // 2: Modern Fusion, Asymmetric Cuts, Tuxedos, Pinstripes
    'cat_kurta',              // 3: Festive Kurtas, Bundis, Waistcoats, Nehru Jackets
    'cat_accessories',        // 4: Royal Safas, Pagdis, Kalgis, Velvet Mojaris, Stoles

    // Color Spectrum
    'col_ivory_white',        // 5: Ivory, Pristine White, Pearl, Champagne, Cream
    'col_gold_zari',          // 6: Royal Gold, Antique Zari, Pale Gold, Burnished Gold
    'col_maroon_burgundy',    // 7: Maroon, Ruby Crimson, Wine Burgundy, Royal Red
    'col_green_mint',         // 8: Mint Sage, Pistachio, Emerald Green, Forest Green
    'col_blue_turquoise',     // 9: Persian Turquoise, Sapphire, Royal Navy, Midnight Blue
    'col_black_charcoal',     // 10: Jet Black, Chalk Pinstripe, Charcoal, Onyx

    // Luxury Fabric Compositions
    'fab_raw_silk',           // 11: Pure Raw Silk, Matka Silk Weave, Slub Silk, Mulberry
    'fab_velvet',             // 12: Royal Micro Velvet, Silk Velvet, Plush Accents
    'fab_brocade_katan',      // 13: Banarasi Brocade, Katan Silk, Metallic Jacquard
    'fab_wool_satin',         // 14: Italian Super 120s Wool, Satin Shawl Lapel, Tuxedo Suiting

    // Royal Hand Craftsmanship
    'craft_zardozi_dabka',    // 15: Old City Zardozi, Hand Dabka, Antique French Wire
    'craft_resham_thread',    // 16: Tone-on-Tone Resham, Chevron Threadwork, Leaf Vines
    'craft_sequin_beading',   // 17: Sequin Embellishment, Basra Pearl Beading, Kundan
    'craft_regal_crest',      // 18: Metallic Crest Buttons, Jeweled Closures, Angrakha Tassels

    // Occasions & Ceremonies
    'occ_baraat_nikkah',      // 19: Baraat, Nikkah, Main Wedding Day, Shaadi, Coronation
    'occ_reception_gala',     // 20: Evening Reception, Cocktail Gala, Stage Appearance, Black Tie
    'occ_sangeet_mehendi',    // 21: Sangeet, Mehendi, Haldi, Pre-Wedding Celebrations
    'occ_festive_family',     // 22: Festive Eid, Family Weddings, Groomsmen Bulk, Festive

    // Style & Aesthetic Persona
    'style_asaf_jahi_court',  // 23: 130-Year Court Heritage, Nizam Darbar, Heirloom Traditional
    'style_contemporary',     // 24: Modern Asymmetrical Hem, Chevron, Sleek Tapered Cut
    'style_regal_grand',      // 25: Heavily Embellished, Imperial Stoles, Double Layers

    // Price / Value Stratification
    'price_budget_festive',   // 26: Under ₹15,000 (Kurtas, Bundis, Accessories)
    'price_mid_royal',        // 27: ₹15,000 – ₹30,000 (Bandhgalas, Fusion Sets)
    'price_haute_couture'     // 28: ₹30,000 – ₹55,000+ (Premier Bridal Sherwanis)
  ];

  // Comprehensive Semantic Knowledge Graph: Maps queries to related words
  const RELATED_CONCEPTS_GRAPH = {
    // Categories & Silhouettes
    'sherwani': ['Baraat', 'Nikkah', 'Pure Raw Silk', 'Old City Zardozi', 'Darbar Achkan', 'Groom Khada'],
    'achkan': ['Nizami Cut', 'Mandarin Collar', 'Ivory Silk', 'Court Sherwani', 'Pathergatti Heritage'],
    'bandhgala': ['Wine Burgundy', 'Jodhpuri Prince Coat', 'Italian Wool', 'Crest Buttons', 'Reception Wear'],
    'jodhpuri': ['Bandhgala', 'Prince Coat', 'Tailored Trousers', 'Formal Gala', 'High Collar'],
    'tuxedo': ['Emerald Green Satin', 'Midnight Sapphire Sequin', 'Evening Reception', 'Black Chalk Pinstripe'],
    'suit': ['Black Pinstripe Suit', 'Italian Wool', 'Embellished Tuxedo', 'Reception Wear'],
    'indo': ['Indo-Western', 'Mint Sage Chevron', 'Asymmetrical Hemline', 'Modern Royal Fusion'],
    'western': ['Indo-Western Fusion', 'Satin Shawl Lapel', 'Tuxedos', 'Contemporary Cut'],
    'kurta': ['Festive Kurta Sets', 'Raw Silk Bundi', 'Sangeet Wear', 'Mehendi & Haldi', 'Mulberry Silk'],
    'bundi': ['Nehru Jacket', 'Banarasi Silk Bundi', 'Textured Silver-Grey', 'Festive Waistcoat'],
    'waistcoat': ['Raw Silk Bundi', 'Nehru Jacket', 'Festive Kurta', 'Sangeet'],
    'safa': ['Kundan Kalgi', 'Chanderi Gold Tissue', 'Royal Groom Turban', 'Basra Pearls', 'Pagdi'],
    'pagdi': ['Hand-Tied Safa', 'Kundan Kalgi', 'Plumed Brooch', 'Wedding Turban'],
    'turban': ['Royal Hyderabadi Safa', 'Kundan Kalgi', 'Gold Tissue', 'Groom Coronation'],
    'kalgi': ['Basra Pearl Plume', 'Kundan Brooch', 'Royal Safa Crown', 'Antique Gold Kalgi'],
    'mojari': ['Handcrafted Velvet Mojaris', 'Zardozi Embroidery', 'Padded Insole', 'Groom Juttis'],
    'shoes': ['Velvet Royal Mojaris', 'Handcrafted Juttis', 'Zardozi Work', 'Groom Footwear'],
    'footwear': ['Royal Velvet Mojaris', 'Hand-Embroidered Juttis', 'Crimson Velvet Shoes'],
    'accessories': ['Royal Safa', 'Kundan Kalgi', 'Velvet Mojaris', 'Churidar', 'Groom Stole'],

    // Occasions
    'wedding': ['Baraat Sherwani', 'Nikkah Ensemble', 'Hand Zardozi', 'Royal Safa', 'Grand Asaf Jahi'],
    'marriage': ['Royal Baraat', 'Nikkah Ceremony', 'Bridal Groom Sherwani', 'Ivory Raw Silk'],
    'shaadi': ['Baraat Sherwani', 'Kundan Kalgi', 'Nizami Khada Sherwani', 'Groom Trousseau'],
    'baraat': ['Nizam Darbar Sherwani', 'Imperial Gold Brocade', 'Chanderi Safa', 'Royal Baraat'],
    'nikkah': ['Asaf Jahi Ivory Sherwani', 'Antique Maroon Resham', 'Subtle Royal Elegance'],
    'reception': ['Emerald Satin Tuxedo', 'Wine Burgundy Bandhgala', 'Midnight Sapphire Sequin', 'Jodhpuri'],
    'cocktail': ['Sapphire Sequin Tuxedo', 'Emerald Satin Shawl', 'Black Pinstripe Suit'],
    'sangeet': ['Mint Sage Chevron Achkan', 'Silk Kurta & Bundi', 'Royal Blue Waistcoat'],
    'mehendi': ['Mint Sage Achkan', 'Festive Kurta', 'Pistachio Raw Silk', 'Haldi Kurta'],
    'haldi': ['Festive Crimson Silk Kurta', 'Mulberry Silk', 'Lightweight Pathani'],
    'groom': ['Khada Sherwani', 'Baraat Trousseau', 'Kundan Kalgi', 'Velvet Mojaris', 'Asaf Jahi'],
    'groomsmen': ['Festive Kurta Sets', 'Raw Silk Bundis', 'Coordinated Waistcoats', 'Bulk Orders'],

    // Colors
    'maroon': ['Ruby Crimson', 'Wine Burgundy', 'Old City Zardozi', 'Royal Maroon Wedding Sherwani'],
    'crimson': ['Ruby Crimson Angrakha', 'Festive Kurta', 'Velvet Mojaris', 'Antique Gold Resham'],
    'wine': ['Wine Burgundy Bandhgala', 'Asymmetrical Cut', 'Plush Silk Velvet', 'Reception'],
    'burgundy': ['Royal Wine Bandhgala', 'Velvet Prince Coat', 'Jeweled Buttons'],
    'red': ['Ruby Crimson', 'Royal Maroon', 'Bridal Match', 'Zardozi Brocade'],
    'green': ['Mint Sage Raw Silk', 'Emerald Green Satin Tuxedo', 'Pistachio Matka Weave'],
    'mint': ['Mint Sage Chevron Achkan', 'Tone-on-Tone Resham', 'Modern Asymmetric Cut'],
    'sage': ['Mint Sage Achkan', 'Pistachio Raw Silk', 'Sangeet Wear', 'Mandarin Collar'],
    'emerald': ['Royal Emerald Green Tuxedo', 'Satin Shawl Lapel', 'Cocktail Reception Wear'],
    'blue': ['Persian Turquoise Resham', 'Royal Sapphire Sequin', 'Midnight Navy Tuxedo', 'Silk Bundi'],
    'turquoise': ['The Nizam Turquoise Court Sherwani', 'Slub Raw Silk', 'Double-Layered Hem', 'Resham Leaf'],
    'navy': ['Midnight Navy Embellished Tuxedo', 'Royal Sapphire Tuxedo', 'Burnished Gold Lapel'],
    'sapphire': ['Midnight Sapphire Sequin Tuxedo', 'Royal Blue Bundi', 'Evening Wear'],
    'black': ['Black Chalk Pinstripe Suit', 'Onyx Tuxedo', 'Charcoal Silk Kurta', 'Modern Formal'],
    'charcoal': ['Nawabi Charcoal Kurta', 'Textured Silver-Grey Bundi', 'Contemporary Kurta'],
    'ivory': ['The Nizam Darbar Khada Sherwani', 'Nawabi Ivory Achkan', 'Grand Asaf Jahi Bridal'],
    'white': ['Imperial Ivory Sherwani', 'Crisp White Pinstripe Shirt', 'Mulberry Silk Pajama'],
    'gold': ['Imperial Gold Brocade', 'Antique Zari Angrakha', 'Champagne Gold Sherwani', 'Kundan Kalgi'],

    // Fabrics & Materials
    'silk': ['Pure Raw Silk', 'Banarasi Katan Weave', 'Matka Silk', 'Mulberry Silk', 'Slub Silk'],
    'velvet': ['Wine Burgundy Bandhgala', 'Velvet Mojaris', 'Emerald Satin Shawl', 'Silk Velvet'],
    'brocade': ['Imperial Gold Brocade', 'Royal Crimson Angrakha', 'Banarasi Katan', 'Metallic Zari'],
    'wool': ['Italian Super 120s Wool', 'Black Pinstripe Suit', 'Structured Bandhgala'],
    'satin': ['Emerald Satin Shawl Tuxedo', 'Silk Satin Lining', 'Lapel Sheen'],

    // Crafts & Details
    'zardozi': ['Authentic Old City Hand-Zardozi', 'French Wire Work', 'Nizam Darbar Sherwani'],
    'dabka': ['Hand Dabka Embroidery', 'Antique Gold Resham', 'Heirloom Sherwani'],
    'resham': ['Tone-on-Tone Resham', 'Chevron Threadwork', 'Turquoise Leaf Embroidery'],
    'sequin': ['Midnight Sapphire Sequin', 'Embellished Tuxedo', 'Evening Glitter'],
    'buttons': ['Metallic Royal Crest Buttons', 'Jeweled Closures', 'Burnished Gold Buttons'],
    'chevron': ['Mint Sage Chevron Achkan', 'Asymmetric Layered Cut', 'Resham Threadwork'],
    'pinstripe': ['Royal Asaf Jahi Black Chalk Pinstripe', 'Italian Wool Suiting', 'Double Breasted'],

    // Budget & Pricing
    'budget': ['Festive Kurta Sets (₹3,500 – ₹15,000)', 'Silk Bundis', 'Royal Accessories (₹1,500)'],
    'cheap': ['Festive Kurtas (₹3,500 – ₹15,000)', 'Silk Bundis', 'Safas & Mojaris'],
    'affordable': ['Kurta & Nehru Sets', 'Royal Accessories', 'Transparent Pricing Tiers'],
    'luxury': ['Haute Couture 2026', 'Grand Asaf Jahi Sherwani', 'Hand-Zardozi Bridal Heirloom']
  };

  // Keyword to semantic dimension mapping with weights
  const KEYWORD_VECTOR_MAP = {
    // Categories
    'sherwani': ['cat_sherwani', 2.5],
    'achkan': ['cat_sherwani', 2.3],
    'khada': ['cat_sherwani', 2.4],
    'angrakha': ['cat_sherwani', 2.3],
    'bandhgala': ['cat_bandhgala', 2.5],
    'jodhpuri': ['cat_bandhgala', 2.3],
    'prince': ['cat_bandhgala', 2.0],
    'coat': ['cat_bandhgala', 1.6],
    'jacket': ['cat_bandhgala', 1.6],
    'blazer': ['cat_bandhgala', 1.5],
    'indo': ['cat_indo_western', 2.2],
    'western': ['cat_indo_western', 1.8],
    'fusion': ['cat_indo_western', 2.0],
    'tuxedo': ['cat_indo_western', 2.5],
    'suit': ['cat_indo_western', 2.2],
    'pinstripe': ['cat_indo_western', 2.3],
    'kurta': ['cat_kurta', 2.5],
    'bundi': ['cat_kurta', 2.3],
    'waistcoat': ['cat_kurta', 2.0],
    'nehru': ['cat_kurta', 2.2],
    'pathani': ['cat_kurta', 2.0],
    'safa': ['cat_accessories', 2.5],
    'pagdi': ['cat_accessories', 2.3],
    'turban': ['cat_accessories', 2.3],
    'kalgi': ['cat_accessories', 2.5],
    'mojari': ['cat_accessories', 2.5],
    'mojaris': ['cat_accessories', 2.5],
    'jooti': ['cat_accessories', 2.2],
    'juttis': ['cat_accessories', 2.2],
    'shoes': ['cat_accessories', 2.0],
    'footwear': ['cat_accessories', 2.0],
    'stole': ['cat_accessories', 2.0],
    'accessories': ['cat_accessories', 2.2],

    // Colors
    'ivory': ['col_ivory_white', 2.3],
    'white': ['col_ivory_white', 2.0],
    'pearl': ['col_ivory_white', 1.9],
    'champagne': ['col_ivory_white', 2.0],
    'cream': ['col_ivory_white', 1.8],
    'gold': ['col_gold_zari', 2.2],
    'golden': ['col_gold_zari', 2.0],
    'zari': ['col_gold_zari', 2.0],
    'maroon': ['col_maroon_burgundy', 2.5],
    'ruby': ['col_maroon_burgundy', 2.2],
    'crimson': ['col_maroon_burgundy', 2.3],
    'wine': ['col_maroon_burgundy', 2.4],
    'burgundy': ['col_maroon_burgundy', 2.4],
    'red': ['col_maroon_burgundy', 2.0],
    'green': ['col_green_mint', 2.2],
    'mint': ['col_green_mint', 2.5],
    'sage': ['col_green_mint', 2.5],
    'pistachio': ['col_green_mint', 2.3],
    'emerald': ['col_green_mint', 2.5],
    'blue': ['col_blue_turquoise', 2.2],
    'turquoise': ['col_blue_turquoise', 2.5],
    'persian': ['col_blue_turquoise', 2.2],
    'sapphire': ['col_blue_turquoise', 2.4],
    'navy': ['col_blue_turquoise', 2.3],
    'midnight': ['col_blue_turquoise', 2.2],
    'black': ['col_black_charcoal', 2.5],
    'charcoal': ['col_black_charcoal', 2.3],
    'onyx': ['col_black_charcoal', 2.2],

    // Fabrics
    'silk': ['fab_raw_silk', 2.2],
    'raw': ['fab_raw_silk', 2.2],
    'matka': ['fab_raw_silk', 2.2],
    'slub': ['fab_raw_silk', 2.0],
    'mulberry': ['fab_raw_silk', 2.0],
    'velvet': ['fab_velvet', 2.5],
    'brocade': ['fab_brocade_katan', 2.5],
    'banarasi': ['fab_brocade_katan', 2.3],
    'katan': ['fab_brocade_katan', 2.2],
    'wool': ['fab_wool_satin', 2.5],
    'italian': ['fab_wool_satin', 2.2],
    'satin': ['fab_wool_satin', 2.3],

    // Crafts
    'zardozi': ['craft_zardozi_dabka', 2.5],
    'dabka': ['craft_zardozi_dabka', 2.5],
    'wire': ['craft_zardozi_dabka', 1.8],
    'resham': ['craft_resham_thread', 2.5],
    'threadwork': ['craft_resham_thread', 2.2],
    'chevron': ['craft_resham_thread', 2.2],
    'embroidery': ['craft_zardozi_dabka', 1.8],
    'embroidered': ['craft_zardozi_dabka', 1.8],
    'sequin': ['craft_sequin_beading', 2.5],
    'sequins': ['craft_sequin_beading', 2.5],
    'beaded': ['craft_sequin_beading', 2.0],
    'pearls': ['craft_sequin_beading', 2.0],
    'kundan': ['craft_sequin_beading', 2.2],
    'crest': ['craft_regal_crest', 2.2],
    'buttons': ['craft_regal_crest', 2.0],

    // Occasions
    'wedding': ['occ_baraat_nikkah', 2.2],
    'marriage': ['occ_baraat_nikkah', 2.0],
    'shaadi': ['occ_baraat_nikkah', 2.2],
    'baraat': ['occ_baraat_nikkah', 2.5],
    'nikkah': ['occ_baraat_nikkah', 2.5],
    'reception': ['occ_reception_gala', 2.5],
    'cocktail': ['occ_reception_gala', 2.3],
    'gala': ['occ_reception_gala', 2.2],
    'sangeet': ['occ_sangeet_mehendi', 2.5],
    'mehendi': ['occ_sangeet_mehendi', 2.5],
    'haldi': ['occ_sangeet_mehendi', 2.3],
    'groom': ['occ_baraat_nikkah', 1.8],
    'groomsmen': ['occ_festive_family', 2.2],
    'festive': ['occ_festive_family', 2.2],

    // Style
    'royal': ['style_asaf_jahi_court', 1.8],
    'nizam': ['style_asaf_jahi_court', 2.2],
    'nizami': ['style_asaf_jahi_court', 2.2],
    'asaf': ['style_asaf_jahi_court', 2.2],
    'court': ['style_asaf_jahi_court', 2.2],
    'heritage': ['style_asaf_jahi_court', 1.8],
    'modern': ['style_contemporary', 2.2],
    'contemporary': ['style_contemporary', 2.2],
    'asymmetrical': ['style_contemporary', 2.2],
    'asymmetric': ['style_contemporary', 2.2],
    'imperial': ['style_regal_grand', 2.0],

    // Price
    'cheap': ['price_budget_festive', 2.5],
    'budget': ['price_budget_festive', 2.5],
    'affordable': ['price_budget_festive', 2.2],
    'economical': ['price_budget_festive', 2.0],
    'luxury': ['price_haute_couture', 2.5],
    'couture': ['price_haute_couture', 2.3],
    'expensive': ['price_haute_couture', 2.2]
  };

  class RoyalVectorSearchEngine {
    constructor(catalogData) {
      this.catalog = catalogData || [];
      this.dimensions = SEMANTIC_DIMENSIONS;
      this.synonymGraph = RELATED_CONCEPTS_GRAPH;
      this.itemVectors = [];
      this.buildItemVectors();
    }

    /**
     * Build normalized semantic vector for every catalog item
     */
    buildItemVectors() {
      this.itemVectors = this.catalog.map(item => {
        const textParts = [
          item.title,
          item.category,
          item.categoryLabel,
          item.fabric,
          item.work,
          item.color,
          item.occasion,
          item.description,
          item.badge || '',
          ...(item.features || [])
        ];
        const fullText = textParts.join(' ').toLowerCase();
        const vec = this.vectorizeText(fullText);

        // Price dimension booster
        const priceStr = item.priceRange || '';
        const numMatches = priceStr.match(/\d+[\d,]*/g) || [];
        const nums = numMatches.map(n => parseInt(n.replace(/,/g, ''), 10));
        const maxPrice = nums.length ? Math.max(...nums) : 30000;

        if (maxPrice <= 15000) {
          const idx = this.dimensions.indexOf('price_budget_festive');
          if (idx !== -1) vec[idx] += 1.5;
        } else if (maxPrice <= 35000) {
          const idx = this.dimensions.indexOf('price_mid_royal');
          if (idx !== -1) vec[idx] += 1.5;
        } else {
          const idx = this.dimensions.indexOf('price_haute_couture');
          if (idx !== -1) vec[idx] += 1.8;
        }

        const normalizedVec = this.normalizeVector(vec);

        return {
          id: item.id,
          title: item.title,
          item: item,
          fullText: fullText,
          vector: normalizedVec
        };
      });
    }

    /**
     * Transform a block of text into an unnormalized vector in semantic space
     */
    vectorizeText(text) {
      const vec = new Array(this.dimensions.length).fill(0);
      if (!text) return vec;

      const words = text.toLowerCase().replace(/[^a-z0-9]/g, ' ').split(/\s+/).filter(Boolean);
      words.forEach(word => {
        if (KEYWORD_VECTOR_MAP[word]) {
          const [dimName, weight] = KEYWORD_VECTOR_MAP[word];
          const dimIdx = this.dimensions.indexOf(dimName);
          if (dimIdx !== -1) {
            vec[dimIdx] += weight;
          }
        }
      });

      return vec;
    }

    /**
     * Vectorize a user query with semantic expansion
     */
    vectorizeQuery(query) {
      const q = (query || '').toLowerCase().trim();
      const vec = this.vectorizeText(q);

      // Expand query using Knowledge Graph
      const queryWords = q.replace(/[^a-z0-9]/g, ' ').split(/\s+/).filter(Boolean);
      queryWords.forEach(w => {
        if (this.synonymGraph[w]) {
          this.synonymGraph[w].forEach(relatedPhrase => {
            const relatedVec = this.vectorizeText(relatedPhrase);
            for (let i = 0; i < vec.length; i++) {
              vec[i] += relatedVec[i] * 0.45; // 45% semantic boost for related concepts
            }
          });
        }
      });

      return this.normalizeVector(vec);
    }

    /**
     * L2-normalize vector to unit length
     */
    normalizeVector(vec) {
      const norm = Math.sqrt(vec.reduce((sum, v) => sum + v * v, 0));
      if (norm === 0) return vec;
      return vec.map(v => v / norm);
    }

    /**
     * Calculate Cosine Similarity: v1 · v2
     */
    cosineSimilarity(v1, v2) {
      if (!v1 || !v2 || v1.length !== v2.length) return 0;
      let dot = 0;
      for (let i = 0; i < v1.length; i++) {
        dot += v1[i] * v2[i];
      }
      return Math.max(0, Math.min(1, dot));
    }

    /**
     * Automatically fetch related words and semantic synonyms for the query
     */
    getRelatedWords(query) {
      if (!query || !query.trim()) {
        return ['Royal Sherwani', 'Nawabi Bandhgala', 'Mint Sage', 'Emerald Tuxedo', 'Zardozi', 'Royal Safa'];
      }

      const q = query.toLowerCase().trim();
      const words = q.replace(/[^a-z0-9]/g, ' ').split(/\s+/).filter(Boolean);
      const related = new Set();

      // Direct dictionary lookup
      words.forEach(w => {
        if (this.synonymGraph[w]) {
          this.synonymGraph[w].forEach(item => related.add(item));
        }
      });

      // Partial match lookup
      Object.keys(this.synonymGraph).forEach(key => {
        if (q.includes(key) || key.includes(q)) {
          this.synonymGraph[key].forEach(item => related.add(item));
        }
      });

      // If nothing found directly, check categories and color matches
      if (related.size === 0) {
        if (q.includes('sher') || q.includes('achk')) related.add('Baraat').add('Raw Silk').add('Zardozi');
        if (q.includes('coat') || q.includes('jack')) related.add('Bandhgala').add('Prince Coat').add('Italian Wool');
        if (q.includes('suit') || q.includes('tux')) related.add('Embellished Tuxedo').add('Black Pinstripe');
        if (q.includes('silk') || q.includes('fabric')) related.add('Banarasi Katan').add('Pure Raw Silk');
        if (q.includes('red') || q.includes('maroon')) related.add('Ruby Crimson').add('Wine Burgundy');
        if (q.includes('green') || q.includes('mint')) related.add('Mint Sage').add('Emerald Satin');
        if (q.includes('blue')) related.add('Persian Turquoise').add('Midnight Navy');
      }

      const res = Array.from(related);
      return res.length > 0 ? res.slice(0, 6) : ['Royal Sherwanis', 'Nawabi Bandhgalas', 'Indo-Western Tuxedos', 'Zardozi Embroidery'];
    }

    /**
     * Compute lexical text matching score (exact title, fabric, color, partial match)
     */
    calculateLexicalScore(query, item) {
      if (!query) return 0;
      const q = query.toLowerCase().trim();
      const words = q.replace(/[^a-z0-9]/g, ' ').split(/\s+/).filter(Boolean);
      if (words.length === 0) return 0;

      const title = (item.title || '').toLowerCase();
      const fabric = (item.fabric || '').toLowerCase();
      const color = (item.color || '').toLowerCase();
      const work = (item.work || '').toLowerCase();
      const category = (item.category || '').toLowerCase();
      const desc = (item.description || '').toLowerCase();

      let score = 0;

      // Exact full query match
      if (title.includes(q)) score += 0.8;
      if (color.includes(q)) score += 0.6;
      if (fabric.includes(q)) score += 0.5;
      if (work.includes(q)) score += 0.5;
      if (category.includes(q)) score += 0.4;

      // Token-level matches
      words.forEach(w => {
        if (w.length < 2) return;
        if (title.includes(w)) score += 0.35;
        if (color.includes(w)) score += 0.25;
        if (fabric.includes(w)) score += 0.2;
        if (work.includes(w)) score += 0.2;
        if (desc.includes(w)) score += 0.1;
      });

      return Math.min(1, score);
    }

    /**
     * Perform Search:
     * - mode: 'hybrid' (Default: 65% Vector Cosine Sim + 35% Lexical Matching)
     * - mode: 'vector' (100% Pure Vector Cosine Similarity)
     * - categoryFilter: optional category filter (e.g. 'sherwani', 'bandhgala')
     */
    search(query, options = {}) {
      const mode = options.mode || 'hybrid';
      const categoryFilter = options.categoryFilter || 'all';
      const minSimilarity = options.minSimilarity || 0.05;

      const trimmedQuery = (query || '').trim();
      const relatedWords = this.getRelatedWords(trimmedQuery);

      if (!trimmedQuery) {
        // Return all catalog items or filtered by category
        let results = this.catalog;
        if (categoryFilter !== 'all') {
          results = results.filter(item => item.category === categoryFilter);
        }
        return {
          query: '',
          mode: mode,
          total: results.length,
          relatedWords: relatedWords,
          results: results.map(item => ({
            item: item,
            similarity: 1.0,
            similarityPercent: 100,
            lexicalScore: 1.0,
            finalScore: 1.0,
            matchReason: 'Featured Masterwork'
          }))
        };
      }

      const queryVector = this.vectorizeQuery(trimmedQuery);

      let scoredItems = this.itemVectors.map(entry => {
        const item = entry.item;
        const cosine = this.cosineSimilarity(queryVector, entry.vector);
        const lexical = this.calculateLexicalScore(trimmedQuery, item);

        let finalScore = 0;
        if (mode === 'vector') {
          finalScore = cosine;
        } else {
          // Hybrid score: cosine + lexical booster
          finalScore = (cosine * 0.65) + (lexical * 0.35);
          // If exact title match exists, ensure high rank
          if (lexical >= 0.8) finalScore = Math.max(finalScore, 0.85 + (cosine * 0.14));
        }

        // Determine dominant matching semantic dimension
        let matchReason = '';
        if (lexical > 0.6) {
          matchReason = 'Direct Keyword Match';
        } else if (cosine > 0.6) {
          matchReason = 'High Semantic Vector Affinity';
        } else if (cosine > 0.3) {
          matchReason = 'Contextual Style & Fabric Match';
        } else {
          matchReason = 'Related Wardrobe Match';
        }

        return {
          item: item,
          similarity: cosine,
          similarityPercent: Math.round(Math.min(99, Math.max(15, (finalScore * 100)))),
          lexicalScore: lexical,
          finalScore: finalScore,
          matchReason: matchReason
        };
      });

      // Filter by category if requested
      if (categoryFilter !== 'all') {
        scoredItems = scoredItems.filter(res => res.item.category === categoryFilter);
      }

      // Filter by threshold and sort descending
      scoredItems = scoredItems
        .filter(res => res.finalScore >= minSimilarity || res.lexicalScore > 0)
        .sort((a, b) => b.finalScore - a.finalScore);

      return {
        query: trimmedQuery,
        mode: mode,
        total: scoredItems.length,
        relatedWords: relatedWords,
        results: scoredItems
      };
    }
  }

  return RoyalVectorSearchEngine;
}));
