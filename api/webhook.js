export default function handler(req, res) {
  // Set CORS headers
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'POST, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');
  
  // Handle preflight requests
  if (req.method === 'OPTIONS') {
    res.status(200).end();
    return;
  }
  
  // Only allow POST requests
  if (req.method !== 'POST') {
    res.status(405).json({ error: 'Method not allowed' });
    return;
  }
  
  try {
    // Log the webhook data
    console.log('Webhook received:', req.body);
    
    // Process the webhook data (you can add your logic here)
    const { type, data } = req.body;
    
    // For now, just acknowledge the webhook
    res.status(200).json({ 
      success: true, 
      message: 'Webhook received successfully',
      timestamp: new Date().toISOString()
    });
    
  } catch (error) {
    console.error('Webhook error:', error);
    res.status(500).json({ 
      error: 'Internal server error',
      message: error.message 
    });
  }
} 