// src/app/api/stock/route.ts
import { NextResponse } from 'next/server';

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const ticker = searchParams.get('ticker')?.toUpperCase();
  const type = searchParams.get('type') || 'quote'; // Default to quote if not specified

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

      if (data.Information) {
        return NextResponse.json({ error: 'API Rate Limit Reached' }, { status: 429 });
      }

      if (!data.Name) {
        return NextResponse.json({ error: 'Company details not found' }, { status: 404 });
      }

      // Convert raw market cap into clean readable billions
      const rawCap = parseFloat(data.MarketCapitalization);
      const formattedCap = !isNaN(rawCap) 
        ? `$${(rawCap / 1e9).toFixed(2)}B` 
        : 'N/A';

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

      if (data.Information) {
        return NextResponse.json({ error: 'API Rate Limit Reached' }, { status: 429 });
      }

      const quote = data['Global Quote'];
      if (!quote || !quote['05. price']) {
        return NextResponse.json({ error: 'Ticker not found' }, { status: 404 });
      }

      return NextResponse.json({
        price: parseFloat(quote['05. price']).toFixed(2),
        changePercent: quote['10. change percent'],
        isPositive: parseFloat(quote['09. change']) >= 0,
      });
    }
  } catch (error) {
    console.error("Market API Error:", error);
    return NextResponse.json({ error: 'Failed to fetch market data' }, { status: 500 });
  }
}