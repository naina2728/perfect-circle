export default function handler(req, res) {
  // Set CORS headers
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');
  
  // Handle preflight requests
  if (req.method === 'OPTIONS') {
    res.status(200).end();
    return;
  }
  
  // Only allow GET requests
  if (req.method !== 'GET') {
    res.status(405).json({ error: 'Method not allowed' });
    return;
  }
  
  // Set content type
  res.setHeader('Content-Type', 'application/json');
  
  // Return the farcaster.json content
  const farcasterData = { 
    "accountAssociation": {
      "header": "eyJmaWQiOjEwODk4NzksInR5cGUiOiJjdXN0b2R5Iiwia2V5IjoiMHg1ZDczYzczNGQ3Yzg0OUUxNTRiNmYwNjczNjY0NDQ0MzJkOTdDZjE3In0",
      "payload": "eyJkb21haW4iOiJtaW5pYXBwLXNlcGlhLnZlcmNlbC5hcHAifQ",
      "signature": "MHhlODk5MGJjZDU5ODg3OGFjMDYzM2RkNDk2NWI1Yjg4YWE4YWIzN2UxY2JjMjA1MjEwNDViNWM0ZjA1OGZlMjQ2MzgxM2UwODc3ODlkNWM3ZmFhY2I2YjNhZmExMjk1MWNjMjVkZDlkZmY4NjkwYjFkYTMyZDdiNDNiOGVhMWQzZjFj"
    },
    "frame": {
      "name": "Perfect circle",
      "version": "1",
      "iconUrl": "https://github.com/naina2728/perfect-circle/blob/main/public/icon.png",
      "homeUrl": "https://perfect-circle-nine.vercel.app",
      "imageUrl": "https://github.com/naina2728/perfect-circle/blob/main/header%20(1).png?raw=true",
      "buttonTitle": "Open mini app",
      "splashImageUrl": "https://github.com/naina2728/perfect-circle/blob/main/splash%20(1).png?raw=true",
      "splashBackgroundColor": "#FFFFFF",
      "webhookUrl": "https://perfect-circle-nine.vercel.app/api/webhook",
      "subtitle": "Create a circle and share your score! ",
      "description": "Create a circle and share your score! ",
      "primaryCategory": "games",
      "screenshotUrls": [
        "https://github.com/naina2728/perfect-circle/blob/main/perfect%20circle.png?raw=true"
      ],
      "heroImageUrl": "https://github.com/naina2728/perfect-circle/blob/main/header%20(1).png?raw=true",
      "tags": [
        "fun",
        "games",
        "challenge",
        "social"
      ],
      "tagline": "Draw the Impossible.",
      "ogTitle": "Draw the Impossible.",
      "ogDescription": "Draw the Impossible.",
      "ogImageUrl": "https://github.com/naina2728/perfect-circle/blob/main/splash%20(1).png?raw=true"
    }
  };
  
  res.status(200).json(farcasterData);
} 