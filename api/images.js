import { readFileSync, existsSync } from 'fs';
import { join, extname } from 'path';

export default function handler(req, res) {
    try {
        // Get the image name from query parameter
        const { image } = req.query;
        
        if (!image) {
            return res.status(400).json({ error: 'Image parameter is required' });
        }
        
        // Sanitize the filename to prevent path traversal
        const sanitizedImage = image.replace(/[^a-zA-Z0-9.-_() ]/g, '');
        
        // Construct the path to the image in the public folder
        const imagePath = join(process.cwd(), 'public', sanitizedImage);
        
        // Check if file exists
        if (!existsSync(imagePath)) {
            return res.status(404).json({ error: 'Image not found' });
        }
        
        // Get file extension to determine content type
        const ext = extname(sanitizedImage).toLowerCase();
        let contentType = 'application/octet-stream';
        
        switch (ext) {
            case '.png':
                contentType = 'image/png';
                break;
            case '.jpg':
            case '.jpeg':
                contentType = 'image/jpeg';
                break;
            case '.gif':
                contentType = 'image/gif';
                break;
            case '.webp':
                contentType = 'image/webp';
                break;
            case '.svg':
                contentType = 'image/svg+xml';
                break;
            default:
                return res.status(400).json({ error: 'Unsupported image format' });
        }
        
        // Read and serve the image
        const imageBuffer = readFileSync(imagePath);
        
        // Set appropriate headers
        res.setHeader('Content-Type', contentType);
        res.setHeader('Cache-Control', 'public, max-age=86400'); // Cache for 24 hours
        res.setHeader('Content-Length', imageBuffer.length);
        
        // Send the image
        res.status(200).send(imageBuffer);
        
    } catch (error) {
        console.error('Error serving image:', error);
        res.status(500).json({ error: 'Internal server error' });
    }
}
