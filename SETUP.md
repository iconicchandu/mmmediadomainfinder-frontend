# Quick Setup Guide

## Step 1: Install Dependencies

### Backend
```bash
cd backend
npm install
```

### Frontend
```bash
cd frontend
npm install
```

## Step 2: Configure API Credentials

1. **Create `.env` file in the `backend` folder:**
   ```bash
   cd backend
   ```

2. **Create a file named `.env` with the following content:**
   ```env
   NC_API_USER=your_api_user
   NC_API_KEY=your_api_key
   NC_USERNAME=your_username
   CLIENT_IP=your_public_ip_address
   PORT=3001
   ```

3. **Get your Namecheap API credentials:**
   - Log in to your Namecheap account
   - Go to **Profile** → **Tools** → **Business & Dev Tools** → **API Access**
   - Copy your API User, API Key, and Username

4. **Get your public IP address:**
   - Visit https://whatismyipaddress.com/
   - Copy your public IP address
   - **IMPORTANT:** Add this IP to the whitelist in Namecheap (same page as API Access)

## Step 3: Start the Servers

### Terminal 1 - Backend Server
```bash
cd backend
npm start
```

You should see: `Server running on port 3001`

### Terminal 2 - Frontend Server
```bash
cd frontend
npm run dev
```

You should see: `Local: http://localhost:3000`

## Step 4: Test the Application

1. Open your browser to `http://localhost:3000`
2. Enter a keyword (e.g., "car warranty")
3. Select a TLD extension (e.g., ".com")
4. Click "Search"

## Troubleshooting

### Error: "Missing Namecheap API credentials"
- Make sure you created the `.env` file in the `backend` folder
- Verify all credentials are filled in (no "your_user", "your_key", etc.)
- Restart the backend server after creating/editing `.env`

### Error: "Namecheap API Error: IP address not whitelisted"
- Add your public IP address to the whitelist in Namecheap
- Wait a few minutes for changes to take effect
- Make sure you're using your public IP, not 127.0.0.1 or localhost

### Error: "Failed to parse XML response"
- Check the backend console for detailed error messages
- Verify your API credentials are correct
- Check if Namecheap API is accessible from your network

### Still having issues?
- Check the backend console output for detailed error messages
- See `TROUBLESHOOTING.md` for more help
- Verify your API credentials in Namecheap account

