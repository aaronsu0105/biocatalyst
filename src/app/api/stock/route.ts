// src/app/api/stock/route.ts
import { NextResponse } from 'next/server';

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const ticker = searchParams.get('ticker')?.toUpperCase();
  const type = searchParams.get('type') || 'quote'; 

  if (!ticker) {
    return NextResponse.json({ error: 'Ticker is required' }, { status: 400 });
  }

  const apiKey = process.env.ALPHA_VANTAGE_API_KEY;

  try {
    // CATEGORY A: FETCH FULL CORPORATE OVERVIEW
    if (type === 'overview') {
      const url = `https://www.alphavantage.co/query?function=OVERVIEW&symbol=${ticker}&apikey=${apiKey}`;
      const response = await fetch(url);
      const data = await response.json();

      // FIX 1: Catch both variations of Alpha Vantage rate limit warnings
      if (data.Information || data.Note) {
        console.warn(`[DEV MODE] Alpha Vantage Rate Limit Hit for ${ticker}`);
        
        // FIX 2: Graceful Mock Fallback so your frontend UI keeps working while rate-limited!
        return NextResponse.json({
          name: `${ticker} (Simulated Data)`,
          description: "API Rate limit reached. This is a simulated profile injection allowing you to continue testing the dashboard UI without hard-crashing the client.",
          marketCap: "$12.50B"
        });
      }

      // FIX 3: Catch blank objects returned for valid but unsupported tickers (like international/CDRs)
      if (!data || Object.keys(data).length === 0 || !data.Name) {
        return NextResponse.json({ error: `Corporate directory indexing failed for ${ticker}.` }, { status: 404 });
      }

      const rawCap = parseFloat(data.MarketCapitalization);
      const formattedCap = !isNaN(rawCap) ? `$${(rawCap / 1e9).toFixed(2)}B` : 'N/A';

      return NextResponse.json({
        name: data.Name,
        description: data.Description || "No scientific text profile available.",
        marketCap: formattedCap
      });
    } 
    
    // CATEGORY B: FETCH LIVE PRICE QUOTE
    else {
      const url = `https://www.alphavantage.co/query?function=GLOBAL_QUOTE&symbol=${ticker}&apikey=${apiKey}`;
      const response = await fetch(url);
      const data = await response.json();

      if (data.Information || data.Note) {
        // Mock fallback for pricing so the dashboard numbers still render
        return NextResponse.json({
          price: "150.00",
          changePercent: "+1.25%",
          isPositive: true,
        });
      }

      const quote = data['Global Quote'];
      if (!quote || !quote['05. price']) {
        return NextResponse.json({ error: 'Ticker not found on primary exchange.' }, { status: 404 });
      }

      return NextResponse.json({
        price: parseFloat(quote['05. price']).toFixed(2),
        changePercent: quote['10. change percent'],
        isPositive: parseFloat(quote['09. change']) >= 0,
      });
    }
  } catch (error) {
    console.error("Market API Error:", error);
    return NextResponse.json({ error: 'Failed to establish market data connection.' }, { status: 500 });
  }
}