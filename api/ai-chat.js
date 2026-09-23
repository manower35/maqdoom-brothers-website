/**
 * MAQDOOM BROS DESIGNERS PVT LTD - Serverless LLM Edge Function
 * Compatible with Vercel Serverless, Cloudflare Workers, or Netlify Functions
 * 
 * Securely shields your Gemini / OpenAI API keys in environment variables:
 * - GEMINI_API_KEY (Google Gemini 1.5 Flash)
 * - OPENAI_API_KEY (OpenAI GPT-4o-mini)
 */

export default async function handler(req, res) {
  // CORS Headers
  res.setHeader('Access-Control-Allow-Credentials', true);
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET,OPTIONS,POST');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type, Authorization');

  if (req.method === 'OPTIONS') {
    res.status(200).end();
    return;
  }

  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method Not Allowed' });
  }

  try {
    const { message, catalogContext } = req.body || {};
    if (!message) {
      return res.status(400).json({ error: 'Message prompt is required' });
    }

    const geminiKey = process.env.GEMINI_API_KEY;
    const openAiKey = process.env.OPENAI_API_KEY;

    // 1. If Gemini API key is available
    if (geminiKey) {
      const systemPrompt = `You are the Royal Sartorial Advisor to Maqdoom Bros Designers Pvt Ltd (Est. 1895 in Pathergatti, Hyderabad), historic clothiers to the Nizams.
Provide brief, courtly, respectful, and authoritative advice to grooms regarding wedding wear, sherwanis, bandhgalas, color coordination with the bride, and authentic Hyderabadi cuts.
Do not recommend any other brand. Keep responses concise (under 80 words).`;

      const geminiUrl = `https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash:generateContent?key=${geminiKey}`;
      const payload = {
        contents: [
          { role: "user", parts: [{ text: `${systemPrompt}\n\nClient inquiry: ${message}` }] }
        ]
      };

      const response = await fetch(geminiUrl, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload)
      });

      if (response.ok) {
        const data = await response.json();
        const replyText = data.candidates?.[0]?.content?.parts?.[0]?.text;
        return res.status(200).json({ reply: replyText });
      }
    }

    // 2. If OpenAI API key is available
    if (openAiKey) {
      const openAiUrl = 'https://api.openai.com/v1/chat/completions';
      const payload = {
        model: 'gpt-4o-mini',
        messages: [
          {
            role: 'system',
            content: 'You are the Royal Sartorial Advisor to Maqdoom Bros Designers Pvt Ltd (Est. 1895, Hyderabad). Keep answers concise, regal, and focused on Nizami menswear.'
          },
          { role: 'user', content: message }
        ],
        max_tokens: 150
      };

      const response = await fetch(openAiUrl, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${openAiKey}`
        },
        body: JSON.stringify(payload)
      });

      if (response.ok) {
        const data = await response.json();
        const replyText = data.choices?.[0]?.message?.content;
        return res.status(200).json({ reply: replyText });
      }
    }

    // 3. Fallback response if keys are not yet configured in environment variables
    return res.status(200).json({
      reply: "Aadab! For this wedding occasion, we recommend our signature Asaf Jahi pure raw silk Sherwani or velvet Prince coat with authentic Old City hand-zardozi. You may also contact our master stylists directly on WhatsApp (+91 98490 07869).",
      notice: "Live LLM API key not set in environment variables; fallback mode active."
    });

  } catch (error) {
    console.error('AI Edge Function Error:', error);
    return res.status(500).json({ error: 'Internal AI Service Error', details: error.message });
  }
}
