// src/app/api/translate/route.ts
import { NextResponse } from 'next/server';
import { GoogleGenerativeAI } from '@google/generative-ai';

// Initialize the Google AI client with our secret key
const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY || '');

export async function POST(request: Request) {
  try {
    // Grab the heavy medical text sent from our frontend
    const { text } = await request.json();

    if (!text) {
      return NextResponse.json({ error: 'Text is required' }, { status: 400 });
    }

    // This is where the magic happens: Our system prompt
    const prompt = `
      You are an expert bioinformatics science communicator. 
      I am going to give you a highly technical clinical trial objective or medical mechanism. 
      Your job is to translate this into a single, short, easy-to-understand sentence that a high school biology student can easily grasp. 
      Strip out all heavy medical jargon, but keep the core scientific intent accurate.
      
      Original Text: "${text}"
      
      Translation:
    `;

    // Send the prompt to the lightning-fast Gemini 1.5 Flash model
    const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash" });
    const result = await model.generateContent(prompt);
    
    // Clean up the text (remove any markdown formatting or quotes the AI might add)
    const translatedText = result.response.text().replace(/["*`]/g, '').trim();

    return NextResponse.json({ translatedText });

  } catch (error) {
    console.error("AI Translation Error:", error);
    return NextResponse.json({ error: 'Failed to translate text' }, { status: 500 });
  }
}