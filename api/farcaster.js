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
      "payload": "eyJkb21haW4iOiJwZXJmZWN0LWNpcmNsZS1uaW5lLnZlcmNlbC5hcHAifQ",
      "signature": "MHhiNTZlM2FlM2M3YjBiZGVjMzMyODcwOTYxMGRjMWNmMmMzNTg4M2VhMGZlODUwOTU5OTUzYjkwOTA1MzgxMmYwN2YwNmMwMjZlNjFiOGEyODYzMDk4ZGMyNzEzOWU2YTZlZDQ1MGM3MzA4ZjY4MjZiMWY0YTcyMjRlMmNhNWM1MjFi"
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
      "subtitle": "Draw a perfect circle!",
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