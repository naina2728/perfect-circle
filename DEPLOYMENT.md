# Deploying Perfect Circle Game to Vercel

This guide will help you deploy your perfect circle game to Vercel.

## Prerequisites

1. **GitHub Account**: You'll need a GitHub account to host your code
2. **Vercel Account**: Sign up at [vercel.com](https://vercel.com)

## Method 1: Deploy via Vercel Dashboard (Recommended)

### Step 1: Push to GitHub

1. **Initialize Git** (if not already done):
   ```bash
   git init
   git add .
   git commit -m "Initial commit"
   ```

2. **Create a GitHub repository**:
   - Go to [github.com](https://github.com)
   - Click "New repository"
   - Name it `perfect-circle-game`
   - Make it public or private
   - Don't initialize with README (we already have one)

3. **Push to GitHub**:
   ```bash
   git remote add origin https://github.com/YOUR_USERNAME/perfect-circle-game.git
   git branch -M main
   git push -u origin main
   ```

### Step 2: Deploy on Vercel

1. **Go to Vercel Dashboard**:
   - Visit [vercel.com/dashboard](https://vercel.com/dashboard)
   - Sign in with your GitHub account

2. **Import Project**:
   - Click "New Project"
   - Select "Import Git Repository"
   - Find and select your `perfect-circle-game` repository
   - Click "Import"

3. **Configure Project**:
   - **Framework Preset**: Select "Other" or "Static"
   - **Root Directory**: Leave as `./` (default)
   - **Build Command**: Leave empty (not needed for static files)
   - **Output Directory**: Leave empty (not needed for static files)
   - **Install Command**: Leave empty (not needed for static files)

4. **Deploy**:
   - Click "Deploy"
   - Wait for deployment to complete (usually 1-2 minutes)

5. **Access Your Site**:
   - Your site will be available at `https://your-project-name.vercel.app`
   - You can customize the domain in the Vercel dashboard

## Method 2: Deploy via Vercel CLI

### Step 1: Install Vercel CLI

```bash
npm install -g vercel
```

### Step 2: Login to Vercel

```bash
vercel login
```

### Step 3: Deploy

```bash
vercel
```

Follow the prompts:
- Set up and deploy? `Y`
- Which scope? Select your account
- Link to existing project? `N`
- Project name? `perfect-circle-game` (or press Enter for default)
- In which directory is your code located? `./` (press Enter for current directory)
- Want to override the settings? `N`

## Method 3: Deploy from GitHub (Automatic)

1. **Push your code to GitHub** (as in Method 1, Step 1)

2. **Connect Vercel to GitHub**:
   - In Vercel dashboard, go to "Settings" → "Git"
   - Connect your GitHub account
   - Enable "Deploy Hooks" for automatic deployments

3. **Automatic Deployments**:
   - Every time you push to the `main` branch, Vercel will automatically deploy
   - You can also set up preview deployments for pull requests

## Custom Domain (Optional)

1. **Add Custom Domain**:
   - Go to your project in Vercel dashboard
   - Click "Settings" → "Domains"
   - Add your custom domain

2. **Configure DNS**:
   - Follow Vercel's instructions to configure your DNS records
   - Usually involves adding a CNAME record

## Environment Variables (If Needed)

If you need environment variables later:

1. **In Vercel Dashboard**:
   - Go to your project → "Settings" → "Environment Variables"
   - Add your variables

2. **In vercel.json** (if needed):
   ```json
   {
     "env": {
       "YOUR_VARIABLE": "your-value"
     }
   }
   ```

## Troubleshooting

### Common Issues:

1. **Build Fails**:
   - Check that all files are committed to Git
   - Ensure `index.html` is in the root directory
   - Check the build logs in Vercel dashboard

2. **404 Errors**:
   - The `vercel.json` file should handle routing
   - Make sure all file paths are correct

3. **Mobile Issues**:
   - Test on actual mobile devices
   - Check viewport meta tag in `index.html`

### Performance Tips:

1. **Optimize Images** (if you add any later):
   - Use WebP format
   - Compress images
   - Use appropriate sizes

2. **Enable Caching**:
   - Vercel automatically caches static assets
   - The `vercel.json` includes cache headers

## Monitoring

1. **Analytics**:
   - Vercel provides built-in analytics
   - Go to your project → "Analytics"

2. **Logs**:
   - View deployment logs in the dashboard
   - Check "Functions" tab for serverless function logs (if any)

## Updating Your Site

### Automatic Updates:
- Push changes to your GitHub repository
- Vercel will automatically redeploy

### Manual Updates:
```bash
vercel --prod
```

## Success!

Your perfect circle game should now be live at your Vercel URL. Share it with friends and family to test their circle-drawing skills! 🎯

---

**Next Steps:**
- Test the deployed site on different devices
- Share the URL on social media
- Consider adding analytics (Google Analytics, etc.)
- Monitor performance and user feedback 