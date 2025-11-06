# Quick Start Guide

## ✅ The `.env` file has been created!

The `.env` file now exists in the `backend` folder. However, you need to **replace the placeholder values** with your actual Namecheap API credentials.

## 📝 Update Your `.env` File

1. **Open the file:** `backend/.env`

2. **Replace the placeholder values** with your actual credentials:

```env
NC_API_USER=your_actual_api_user_here
NC_API_KEY=your_actual_api_key_here
NC_USERNAME=your_actual_username_here
CLIENT_IP=your_public_ip_address_here
PORT=3001
```

## 🔑 How to Get Your Namecheap API Credentials

1. **Log in to Namecheap:**
   - Go to https://www.namecheap.com/
   - Log in to your account

2. **Navigate to API Access:**
   - Go to **Profile** → **Tools** → **Business & Dev Tools** → **API Access**

3. **Get Your Credentials:**
   - **API User:** Copy this value
   - **API Key:** Copy this value
   - **Username:** Usually the same as API User
   - **Public IP:** Get from https://whatismyipaddress.com/

4. **Whitelist Your IP:**
   - On the same API Access page, add your public IP address to the whitelist
   - **Important:** Wait a few minutes after adding for it to take effect

## 🚀 Start the Server

After updating your `.env` file:

```bash
cd backend
npm start
```

You should now see:
```
Server running on port 3001
Environment check:
  NC_API_USER: Set
  NC_API_KEY: Set
  NC_USERNAME: Set
  CLIENT_IP: Set
```

## ⚠️ Important Notes

- **Do NOT use placeholder values** like "your_user", "your_key", etc.
- **Use your actual public IP**, not 127.0.0.1 or localhost
- **Whitelist your IP** in Namecheap before testing
- **Restart the server** after updating the `.env` file

## 🧪 Test the Application

1. Start the backend: `cd backend && npm start`
2. Start the frontend: `cd frontend && npm run dev`
3. Open `http://localhost:3000` in your browser
4. Try searching for a domain!

## ❓ Still Having Issues?

- Check that your `.env` file is in the `backend` folder (not the root)
- Verify all values are filled in (no "your_user", "your_key", etc.)
- Make sure you restarted the server after updating `.env`
- Check the backend console for detailed error messages

