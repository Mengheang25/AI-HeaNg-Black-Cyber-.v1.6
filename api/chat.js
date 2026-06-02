export default async function handler(req, res) {
    // Set CORS headers
    res.setHeader('Access-Control-Allow-Credentials', true);
    res.setHeader('Access-Control-Allow-Origin', '*');
    res.setHeader('Access-Control-Allow-Methods', 'GET,OPTIONS,PATCH,DELETE,POST,PUT');
    res.setHeader('Access-Control-Allow-Headers', 'X-CSRF-Token, X-Requested-With, Accept, Accept-Version, Content-Length, Content-MD5, Content-Type, Date, X-Api-Version');

    // Handle preflight OPTIONS request
    if (req.method === 'OPTIONS') {
        res.status(200).end();
        return;
    }

    // Allow only POST method
    if (req.method !== 'POST') {
        return res.status(405).json({ 
            error: 'Method not allowed', 
            message: 'Only POST requests are accepted',
            method: req.method 
        });
    }

    try {
        const { messages, temperature = 0.75, stream = true } = req.body;

        if (!messages || !Array.isArray(messages)) {
            return res.status(400).json({ error: 'Invalid messages format' });
        }

        // Get API key from environment variables
        const OPENROUTER_API_KEY = process.env.OPENROUTER_API_KEY;
        const OPENROUTER_MODEL = process.env.OPENROUTER_MODEL || 'deepseek/deepseek-v4-flash';
        const OPENROUTER_ENDPOINT = 'https://openrouter.ai/api/v1/chat/completions';

        // Check if API key exists
        if (!OPENROUTER_API_KEY) {
            console.error('❌ Missing OPENROUTER_API_KEY environment variable');
            console.log('Available env vars:', Object.keys(process.env));
            return res.status(500).json({ 
                error: 'Server configuration error', 
                message: 'API key not configured. Please set OPENROUTER_API_KEY in Vercel Environment Variables.',
                details: 'Make sure you added the environment variable in Vercel dashboard'
            });
        }

        console.log('📡 Calling OpenRouter API...');
        console.log('Model:', OPENROUTER_MODEL);
        console.log('Messages count:', messages.length);

        // Call OpenRouter API
        const response = await fetch(OPENROUTER_ENDPOINT, {
            method: 'POST',
            headers: {
                'Authorization': `Bearer ${OPENROUTER_API_KEY}`,
                'Content-Type': 'application/json',
                'HTTP-Referer': process.env.VERCEL_URL ? `https://${process.env.VERCEL_URL}` : 'https://heang-black-cyber.vercel.app',
                'X-Title': 'HeaNg Black-Cyber AI'
            },
            body: JSON.stringify({
                model: OPENROUTER_MODEL,
                messages: messages,
                temperature: temperature,
                stream: stream,
                max_tokens: 4096
            })
        });

        // Check if response is OK
        if (!response.ok) {
            const errorText = await response.text();
            console.error('❌ OpenRouter API error:', response.status, errorText);
            
            let errorMessage = `OpenRouter API error: ${response.status}`;
            try {
                const errorJson = JSON.parse(errorText);
                errorMessage = errorJson.error?.message || errorMessage;
            } catch(e) {}
            
            return res.status(response.status).json({ 
                error: errorMessage,
                status: response.status 
            });
        }

        console.log('✅ OpenRouter API connected successfully');

        // If streaming is disabled, return JSON
        if (!stream) {
            const data = await response.json();
            return res.status(200).json(data);
        }

        // For streaming: forward the stream
        res.setHeader('Content-Type', 'text/event-stream');
        res.setHeader('Cache-Control', 'no-cache, no-transform');
        res.setHeader('Connection', 'keep-alive');
        res.setHeader('X-Accel-Buffering', 'no');

        const reader = response.body.getReader();
        const decoder = new TextDecoder();

        try {
            while (true) {
                const { done, value } = await reader.read();
                if (done) {
                    console.log('📦 Stream completed');
                    res.end();
                    break;
                }
                const chunk = decoder.decode(value, { stream: true });
                res.write(chunk);
                
                // Flush the response
                if (res.flush) res.flush();
            }
        } catch (streamError) {
            console.error('Stream error:', streamError);
            res.end();
        }
        
    } catch (error) {
        console.error('❌ Handler error:', error);
        return res.status(500).json({ 
            error: 'Internal server error', 
            message: error.message,
            stack: process.env.NODE_ENV === 'development' ? error.stack : undefined
        });
    }
}