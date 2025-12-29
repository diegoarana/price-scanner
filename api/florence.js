// api/florence.js
// Vercel Serverless Function para proxy de Florence-2

export default async function handler(req, res) {
  // Configurar CORS
  res.setHeader('Access-Control-Allow-Credentials', true);
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET,OPTIONS,PATCH,DELETE,POST,PUT');
  res.setHeader(
    'Access-Control-Allow-Headers',
    'X-CSRF-Token, X-Requested-With, Accept, Accept-Version, Content-Length, Content-MD5, Content-Type, Date, X-Api-Version'
  );

  // Manejar preflight request
  if (req.method === 'OPTIONS') {
    res.status(200).end();
    return;
  }

  // Solo permitir POST
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  try {
    const { imageBase64, prompt = '<OCR>', apiKey } = req.body;

    // Validar que se envíe la imagen
    if (!imageBase64) {
      return res.status(400).json({ error: 'imageBase64 is required' });
    }

    // Validar que se envíe el API key
    if (!apiKey) {
      return res.status(400).json({ 
        error: 'API key is required',
        message: 'Please provide your Hugging Face API key'
      });
    }

    // Llamar a Hugging Face API
    const hfResponse = await fetch(
      'https://router.huggingface.co/models/microsoft/Florence-2-base',
      {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${apiKey}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          inputs: imageBase64,
          parameters: {
            prompt: prompt,
            max_new_tokens: 1024,
          }
        })
      }
    );

    const data = await hfResponse.json();

    // Manejar errores de Hugging Face
    if (!hfResponse.ok) {
      console.error('Hugging Face API error:', data);
      
      if (hfResponse.status === 503) {
        return res.status(503).json({
          error: 'Model is loading',
          message: 'The model is loading, please try again in 20-30 seconds',
          retryAfter: 20
        });
      }

      if (hfResponse.status === 401) {
        return res.status(401).json({
          error: 'Invalid API key',
          message: 'The provided Hugging Face API key is invalid'
        });
      }

      return res.status(hfResponse.status).json({
        error: data.error || 'Unknown error',
        message: data.error || 'An error occurred while processing the image'
      });
    }

    // Retornar respuesta exitosa
    return res.status(200).json({
      success: true,
      data: data
    });

  } catch (error) {
    console.error('Proxy error:', error);
    return res.status(500).json({
      error: 'Internal server error',
      message: error.message
    });
  }
}