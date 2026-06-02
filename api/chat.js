export default async function handler(req, res) {
    // Enable CORS
    res.setHeader('Access-Control-Allow-Credentials', true);
    res.setHeader('Access-Control-Allow-Origin', '*');
    res.setHeader('Access-Control-Allow-Methods', 'GET,OPTIONS,PATCH,DELETE,POST,PUT');
    res.setHeader('Access-Control-Allow-Headers', 'X-CSRF-Token, X-Requested-With, Accept, Accept-Version, Content-Length, Content-MD5, Content-Type, Date, X-Api-Version');

    if (req.method === 'OPTIONS') {
        res.status(200).end();
        return;
    }

    if (req.method !== 'POST') {
        return res.status(405).json({ error: 'Method not allowed' });
    }

    try {
        const { messages, temperature = 0.75, stream = true } = req.body;

        // API key from Vercel Environment Variables (.env on Vercel)
        const OPENROUTER_API_KEY = process.env.OPENROUTER_API_KEY;
        const OPENROUTER_MODEL = process.env.OPENROUTER_MODEL || 'deepseek/deepseek-v4-flash';
        const OPENROUTER_ENDPOINT = 'https://openrouter.ai/api/v1/chat/completions';

        if (!OPENROUTER_API_KEY) {
            console.error('Missing OPENROUTER_API_KEY environment variable');
            return res.status(500).json({ error: 'Server configuration error: Missing API key' });
        }

        const response = await fetch(OPENROUTER_ENDPOINT, {
            method: 'POST',
            headers: {
                'Authorization': `Bearer ${OPENROUTER_API_KEY}`,
                'Content-Type': 'application/json',
                'HTTP-Referer': process.env.VERCEL_URL ? `https://${process.env.VERCEL_URL}` : 'http://localhost:3000',
                'X-Title': 'HeaNg Black-Cyber AI'
            },
            body: JSON.stringify({
                model: OPENROUTER_MODEL,
                messages: messages,
                temperature: temperature,
                stream: stream
            })
        });

        if (!response.ok) {
            const errorText = await response.text();
            console.error('OpenRouter API error:', response.status, errorText);
            return res.status(response.status).json({ error: `OpenRouter API error: ${response.status}` });
        }

        // Forward the stream response
        res.setHeader('Content-Type', 'text/event-stream');
        res.setHeader('Cache-Control', 'no-cache');
        res.setHeader('Connection', 'keep-alive');

        const reader = response.body.getReader();
        const decoder = new TextDecoder();

        try {
            while (true) {
                const { done, value } = await reader.read();
                if (done) break;
                const chunk = decoder.decode(value);
                res.write(chunk);
            }
            res.end();
        } catch (streamError) {
            console.error('Stream error:', streamError);
            res.end();
        }
    } catch (error) {
        console.error('Handler error:', error);
        res.status(500).json({ error: error.message || 'Internal server error' });
    }
}