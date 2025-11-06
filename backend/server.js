import express from 'express';
import cors from 'cors';
import axios from 'axios';
import xml2js from 'xml2js';
import dotenv from 'dotenv';
import OpenAI from 'openai';
import { fileURLToPath } from 'url';
import { dirname, join } from 'path';

// Get the directory of the current module
const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

// Load environment variables from .env file in the same directory as server.js
dotenv.config({ path: join(__dirname, '.env') });

// Initialize OpenAI client
const openai = new OpenAI({ 
  apiKey: process.env.OPENAI_API_KEY 
});

const app = express();
const PORT = process.env.PORT || 3001;

app.use(cors());
app.use(express.json());

// Generate domain ideas using OpenAI API
async function generateDomainIdeasWithAI(keyword, tld, maxSuggestions = 20) {
  try {
    if (!process.env.OPENAI_API_KEY) {
      throw new Error('OpenAI API key not configured');
    }

    const prompt = `Generate exactly ${maxSuggestions} short, professional, brandable domain names for a business about "${keyword}". 

CRITICAL REQUIREMENTS:
- Return ONLY domain names, one per line or comma-separated
- Each domain must be 2-3 words maximum (e.g., "HomeShield", "WarrantyPro", "CoverMyHome")
- Use professional brand words: Shield, Pro, Plus, Prime, Nest, Assure, Care, Plan, Protect, Safe, Trust, Cover, Secure, Total, Guard, GuardPlus, ShieldPro
- Make them sound like REAL brand names - professional, memorable, trustworthy
- NO repetitive combinations (avoid: repairhomewarrantyrepair, hubhomewarrantyhub)
- NO meaningless word repetition
- All domains MUST end with .${tld}
- NO numbering, bullets, dashes, or extra text
- Use PascalCase style (capitalize first letter of each word, no spaces)

Examples for "${keyword}":
HomeShieldPro.${tld}, WarrantyNest.${tld}, SafeHomePlan.${tld}, HouseGuardPlus.${tld}, CoverMyHome.${tld}, HomeAssure.${tld}, TotalHomeCare.${tld}, PrimeHomeWarranty.${tld}, AssureMyHome.${tld}, HomeProtectionCo.${tld}

Return ONLY the domain names, nothing else:`;

    console.log('Calling OpenAI API to generate domain suggestions...');
    
    const completion = await openai.chat.completions.create({
      model: 'gpt-4o-mini',
      messages: [
        {
          role: 'system',
          content: 'You are a domain name expert that creates professional, brandable domain names. Return only domain names, one per line or comma-separated.'
        },
        {
          role: 'user',
          content: prompt
        }
      ],
      temperature: 0.8,
      max_tokens: 500
    });

    const aiResponse = completion.choices[0].message.content;
    console.log('OpenAI response:', aiResponse.substring(0, 200));

    // Parse the response to extract domain names
    const suggestions = aiResponse
      .split(/[\n,;]+/)
      .map(s => s.trim())
      .filter(s => s.length > 0 && !s.toLowerCase().includes('example') && !s.toLowerCase().includes('format'))
      .map(s => {
        // Remove any leading numbers, bullets, dashes, or markers
        s = s.replace(/^[\d\s\-•\*\.\(\)\[\]]+/, '').trim();
        // Remove trailing periods, commas, or other punctuation
        s = s.replace(/[\.\,\;]+$/, '').trim();
        
        // Extract domain name (before TLD)
        let domainPart = s.split('.')[0];
        
        // Remove any existing TLD if present
        domainPart = domainPart.replace(/\.(com|net|org|io|co|xyz|shop|online|info|biz|us|uk|ca|au|de|fr|es|it|nl|tech|app|dev|site|website|store|cloud|ai|pro|me|tv|cc|ws|name|email|blog|news)$/i, '');
        
        // Remove spaces and ensure proper format (PascalCase to lowercase for domain)
        domainPart = domainPart.replace(/\s+/g, '');
        
        // Validate: must contain only alphanumeric characters (no hyphens for cleaner names)
        if (!/^[a-zA-Z0-9]+$/.test(domainPart)) {
          return null;
        }
        
        // Ensure minimum length
        if (domainPart.length < 3 || domainPart.length > 50) {
          return null;
        }
        
        // Convert to lowercase for domain part (domains are case-insensitive)
        domainPart = domainPart.toLowerCase();
        
        return `${domainPart}.${tld}`;
      })
      .filter(s => s !== null && s.length > 0)
      .filter(s => {
        // Final validation: proper domain format
        const domainRegex = /^[a-z0-9][a-z0-9-]*[a-z0-9]*\.[a-z]+$/;
        return domainRegex.test(s) && s.length < 60 && s.length > 4;
      })
      .slice(0, maxSuggestions);

    console.log(`Generated ${suggestions.length} domain suggestions from OpenAI`);
    return suggestions;
  } catch (error) {
    console.error('Error generating domains with OpenAI:', error.message);
    throw new Error(`Failed to generate domain suggestions: ${error.message}`);
  }
}

// Check domain availability via Namecheap API
async function checkDomains(domainList) {
  const apiUser = process.env.NC_API_USER;
  const apiKey = process.env.NC_API_KEY;
  const username = process.env.NC_USERNAME;
  const clientIp = process.env.CLIENT_IP;
  
  if (!apiUser || !apiKey || !username || !clientIp) {
    throw new Error('Missing Namecheap API credentials in environment variables');
  }
  
  // Namecheap API allows checking up to 50 domains per request
  const batchSize = 50;
  const batches = [];
  
  for (let i = 0; i < domainList.length; i += batchSize) {
    batches.push(domainList.slice(i, i + batchSize));
  }
  
  const allResults = [];
  
  for (const batch of batches) {
    const domainListStr = batch.join(',');
    const url = `https://api.namecheap.com/xml.response?ApiUser=${encodeURIComponent(apiUser)}&ApiKey=${encodeURIComponent(apiKey)}&UserName=${encodeURIComponent(username)}&Command=namecheap.domains.check&ClientIp=${encodeURIComponent(clientIp)}&DomainList=${encodeURIComponent(domainListStr)}`;
    
    try {
      console.log(`Checking batch of ${batch.length} domains...`);
      const response = await axios.get(url, {
        timeout: 30000,
        headers: {
          'Accept': 'application/xml'
        }
      });
      
      // Log raw response for debugging (first 500 chars only)
      if (batches.indexOf(batch) === 0) {
        const responseStr = typeof response.data === 'string' ? response.data : String(response.data);
        console.log('API Response (first 500 chars):', responseStr.substring(0, Math.min(500, responseStr.length)));
      }
      
      // Parse XML response
      const parser = new xml2js.Parser();
      const xmlData = typeof response.data === 'string' ? response.data : String(response.data);
      
      // Validate XML before parsing
      if (!xmlData || xmlData.trim().length === 0) {
        throw new Error('Empty response from Namecheap API');
      }
      
      let result;
      try {
        result = await parser.parseStringPromise(xmlData);
      } catch (parseError) {
        console.error('XML Parse Error:', parseError.message);
        console.error('Response data (first 1000 chars):', xmlData.substring(0, Math.min(1000, xmlData.length)));
        throw new Error(`Failed to parse XML response: ${parseError.message}`);
      }
      
      // Check for API errors first
      if (result.ApiResponse && result.ApiResponse.Errors) {
        const errors = result.ApiResponse.Errors[0];
        if (errors && errors.Error) {
          const errorMessages = Array.isArray(errors.Error) 
            ? errors.Error.map(e => (typeof e === 'string' ? e : (e._ || e))) 
            : [(typeof errors.Error === 'string' ? errors.Error : (errors.Error._ || errors.Error))];
          throw new Error(`Namecheap API Error: ${errorMessages.join(', ')}`);
        }
      }
      
      // Extract domain check results
      if (result.ApiResponse && result.ApiResponse.CommandResponse) {
        const commandResponse = result.ApiResponse.CommandResponse[0];
        if (commandResponse.DomainCheckResult) {
          const checkResults = commandResponse.DomainCheckResult;
          for (const domainResult of checkResults) {
            const domain = domainResult.$.Domain;
            const available = domainResult.$.Available === 'true';
            if (available) {
              allResults.push(domain);
            }
          }
        } else {
          console.warn('No DomainCheckResult found in API response');
        }
      } else {
        console.warn('Unexpected API response structure:', JSON.stringify(result, null, 2));
        throw new Error('Unexpected API response structure');
      }
      
      // Add a small delay between batches to avoid rate limiting
      if (batches.length > 1) {
        await new Promise(resolve => setTimeout(resolve, 500));
      }
    } catch (error) {
      console.error(`Error checking batch: ${error.message}`);
      if (error.response) {
        const errorData = typeof error.response.data === 'string' 
          ? error.response.data.substring(0, 500) 
          : JSON.stringify(error.response.data);
        console.error('Error response data:', errorData);
      } else {
        console.error('Error stack:', error.stack);
      }
      // If it's a credential or API error, throw it up
      if (error.message.includes('Namecheap API Error') || 
          error.message.includes('Missing Namecheap API credentials') ||
          error.message.includes('Unexpected API response') ||
          error.message.includes('timeout')) {
        throw error;
      }
      // Continue with next batch for other errors
    }
  }
  
  return allResults;
}

// API endpoint
app.get('/api/domains', async (req, res) => {
  try {
    console.log('Received request:', { keyword: req.query.keyword, tld: req.query.tld });
    
    const { keyword, tld } = req.query;
    
    if (!keyword || !tld) {
      return res.status(400).json({ 
        error: 'Missing required parameters: keyword and tld' 
      });
    }
    
    // Check OpenAI API key first
    if (!process.env.OPENAI_API_KEY || process.env.OPENAI_API_KEY === 'your_openai_api_key') {
      return res.status(500).json({ 
        error: 'Failed to generate domains', 
        message: 'Please configure your OpenAI API key in the .env file. Required: OPENAI_API_KEY' 
      });
    }
    
    // Check Namecheap credentials
    const apiUser = process.env.NC_API_USER;
    const apiKey = process.env.NC_API_KEY;
    const username = process.env.NC_USERNAME;
    const clientIp = process.env.CLIENT_IP;
    
    if (!apiUser || !apiKey || !username || !clientIp) {
      console.error('Missing credentials:', {
        hasApiUser: !!apiUser,
        hasApiKey: !!apiKey,
        hasUsername: !!username,
        hasClientIp: !!clientIp
      });
      return res.status(500).json({ 
        error: 'Failed to check domains', 
        message: 'Please configure your Namecheap API credentials in the .env file. Required: NC_API_USER, NC_API_KEY, NC_USERNAME, CLIENT_IP' 
      });
    }
    
    // Validate credentials are not placeholders
    if (apiUser === 'your_user' || apiKey === 'your_key' || username === 'your_name' || clientIp === 'your_ip') {
      return res.status(500).json({ 
        error: 'Failed to check domains', 
        message: 'Please update your .env file with actual Namecheap API credentials (not placeholder values)' 
      });
    }
    
    // Step 1: Generate domain ideas using OpenAI
    console.log('Generating domain ideas with OpenAI...');
    let domainIdeas = [];
    
    try {
      domainIdeas = await generateDomainIdeasWithAI(keyword, tld, 20);
      console.log(`Generated ${domainIdeas.length} domain suggestions from OpenAI`);
    } catch (aiError) {
      console.error('OpenAI error:', aiError.message);
      // If OpenAI fails, return error
      return res.status(500).json({
        error: 'Failed to generate domains',
        message: aiError.message || 'OpenAI API error. Please check your OPENAI_API_KEY in .env file.'
      });
    }
    
    if (domainIdeas.length === 0) {
      return res.status(500).json({
        error: 'Failed to generate domains',
        message: 'No domain suggestions generated. Please try again.'
      });
    }
    
    // Step 2: Check availability with Namecheap
    console.log('Checking domain availability with Namecheap...');
    const availableDomains = await checkDomains(domainIdeas);
    console.log(`Found ${availableDomains.length} available domains out of ${domainIdeas.length} checked`);
    
    res.json({
      keyword,
      tld,
      totalGenerated: domainIdeas.length,
      available: availableDomains.length,
      domains: availableDomains
    });
  } catch (error) {
    console.error('Error in /api/domains:', error);
    console.error('Error stack:', error.stack);
    const errorMessage = error.message || 'Unknown error occurred';
    
    // Provide more helpful error messages
    let userMessage = errorMessage;
    if (errorMessage.includes('Missing Namecheap API credentials')) {
      userMessage = 'Please configure your Namecheap API credentials in the .env file';
    } else if (errorMessage.includes('Namecheap API Error')) {
      userMessage = errorMessage;
    } else if (errorMessage.includes('timeout')) {
      userMessage = 'Request timed out. Please try again.';
    } else if (errorMessage.includes('ECONNREFUSED') || errorMessage.includes('ENOTFOUND')) {
      userMessage = 'Unable to connect to Namecheap API. Please check your internet connection.';
    } else if (errorMessage.includes('Failed to parse XML')) {
      userMessage = 'Error parsing response from Namecheap API. Please check your API credentials and try again.';
    } else if (errorMessage.includes('Empty response')) {
      userMessage = 'Received empty response from Namecheap API. Please check your API credentials.';
    }
    
    res.status(500).json({ 
      error: 'Failed to check domains', 
      message: userMessage 
    });
  }
});

// Health check endpoint
app.get('/api/health', (req, res) => {
  const hasCredentials = !!(process.env.NC_API_USER && process.env.NC_API_KEY && process.env.NC_USERNAME && process.env.CLIENT_IP);
  res.json({ 
    status: 'ok',
    hasCredentials,
    port: PORT
  });
});

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
  console.log(`Environment check:`);
  console.log(`  OPENAI_API_KEY: ${process.env.OPENAI_API_KEY ? 'Set' : 'NOT SET'}`);
  console.log(`  NC_API_USER: ${process.env.NC_API_USER ? 'Set' : 'NOT SET'}`);
  console.log(`  NC_API_KEY: ${process.env.NC_API_KEY ? 'Set' : 'NOT SET'}`);
  console.log(`  NC_USERNAME: ${process.env.NC_USERNAME ? 'Set' : 'NOT SET'}`);
  console.log(`  CLIENT_IP: ${process.env.CLIENT_IP ? 'Set' : 'NOT SET'}`);
});


