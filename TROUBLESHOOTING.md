# Troubleshooting Guide

## Common Issues and Solutions

### Error: "Failed to check domains"

This error can occur for several reasons. Follow these steps to diagnose:

#### 1. Check API Credentials

Verify that your `.env` file in the `backend` folder contains all required credentials:

```env
NC_API_USER=your_user
NC_API_KEY=your_key
NC_USERNAME=your_name
CLIENT_IP=your_ip
PORT=3001
```

**Important Notes:**
- `NC_API_USER` and `NC_USERNAME` are usually the same value
- `CLIENT_IP` must be the public IP address of the server making the API call
- For local development, use your public IP (not 127.0.0.1)
- The IP must be whitelisted in your Namecheap account

#### 2. Whitelist Your IP Address

1. Log in to your Namecheap account
2. Go to **Profile** → **Tools** → **Business & Dev Tools** → **API Access**
3. Add your public IP address to the whitelist
4. Wait a few minutes for changes to take effect

To find your public IP:
- Visit https://whatismyipaddress.com/
- Or run: `curl ifconfig.me` (Linux/Mac) or visit the site in your browser

#### 3. Check API Environment

Namecheap has two API environments:
- **Sandbox**: `https://api.sandbox.namecheap.com/xml.response`
- **Production**: `https://api.namecheap.com/xml.response`

Make sure you're using the correct environment for your API credentials.

#### 4. Verify API Credentials

1. Check that your API key is active in Namecheap
2. Ensure `NC_USERNAME` matches your Namecheap account username
3. Verify the API key hasn't expired

#### 5. Check Server Logs

When you run the backend server, check the console output for detailed error messages:

```bash
cd backend
npm start
```

Look for messages like:
- "Missing Namecheap API credentials"
- "Namecheap API Error: [specific error]"
- "Error checking batch: [error details]"

#### 6. Test API Connection

You can test the API connection by checking the health endpoint:

```bash
curl http://localhost:3001/api/health
```

This will return:
```json
{
  "status": "ok",
  "hasCredentials": true,
  "port": 3001
}
```

If `hasCredentials` is `false`, your `.env` file is not being loaded correctly.

#### 7. Common API Errors

**"Invalid API Key"**
- Verify your API key in Namecheap account
- Check for typos in `.env` file
- Ensure no extra spaces in the values

**"IP Address not whitelisted"**
- Add your IP to the whitelist in Namecheap
- Wait a few minutes after adding
- Use your public IP, not localhost

**"Invalid User"**
- Verify `NC_USERNAME` matches your Namecheap account username
- Check for case sensitivity issues

**"Rate limit exceeded"**
- The API has rate limits
- Wait a few minutes and try again
- Reduce the number of domains checked per request

#### 8. Check Network Connection

Ensure your server can reach the Namecheap API:
- Check firewall settings
- Verify internet connectivity
- Test with: `curl https://api.namecheap.com/xml.response`

#### 9. XML Parsing Issues

If you see "Unexpected API response structure" errors:
- Check the server console for the raw XML response
- Verify the API response format matches expected structure
- Check Namecheap API documentation for any changes

## Still Having Issues?

1. Check the backend server console for detailed error messages
2. Verify all environment variables are set correctly
3. Test with a single domain first to isolate the issue
4. Review Namecheap API documentation: https://www.namecheap.com/support/api/methods/

## Quick Test

To test if everything is working, try searching for a simple keyword like "test" with extension ".com". If this works, the issue might be with the specific keyword or TLD you're using.

