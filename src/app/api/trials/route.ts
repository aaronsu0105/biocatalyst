// src/app/api/trials/route.ts
import { NextResponse } from 'next/server';

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const company = searchParams.get('company');

  if (!company) {
    return NextResponse.json({ error: 'Company name is required' }, { status: 400 });
  }

  // We search the government database for trials sponsored by this specific company
  const url = `https://clinicaltrials.gov/api/v2/studies?query.term=${encodeURIComponent(company)}&pageSize=5`;

  try {
    const response = await fetch(url);
    const data = await response.json();

    if (!data.studies || data.studies.length === 0) {
      return NextResponse.json({ error: 'No trials found for this company' }, { status: 404 });
    }

    // Map the chaotic government JSON into our clean frontend format
    const formattedPipeline = data.studies.map((study: any) => {
      const protocol = study.protocolSection;
      
      // Extract the phase (FDA returns an array like ["PHASE2", "PHASE3"])
      const rawPhases = protocol.designModule?.phases || [];
      let phaseNumber = 1;
      if (rawPhases.includes("PHASE4")) phaseNumber = 4;
      else if (rawPhases.includes("PHASE3")) phaseNumber = 3;
      else if (rawPhases.includes("PHASE2")) phaseNumber = 2;

      // Extract and map the status
      const rawStatus = protocol.statusModule?.overallStatus || "";
      let mappedStatus = "UPCOMING";
      if (rawStatus.includes("RECRUITING") || rawStatus.includes("ACTIVE")) mappedStatus = "ONGOING";
      if (rawStatus.includes("COMPLETED")) mappedStatus = "COMPLETED";
      if (rawStatus.includes("TERMINATED") || rawStatus.includes("SUSPENDED")) mappedStatus = "FAILED";

      return {
        phaseNumber: phaseNumber,
        status: mappedStatus,
        estimatedCompletionDate: protocol.statusModule?.completionDateStruct?.date || "Unknown",
        // We will use the raw title for both modes until we hook up the AI translator!
        simplifiedObjective: protocol.identificationModule?.briefTitle || "Objective details pending.",
        rawScientificTitle: protocol.identificationModule?.officialTitle || protocol.identificationModule?.briefTitle || "Title unavailable",
      };
    });

    // Sort by phase number so they display in order (Phase 1 -> Phase 3)
    const sortedPipeline = formattedPipeline.sort((a: any, b: any) => a.phaseNumber - b.phaseNumber);

    return NextResponse.json({ pipeline: sortedPipeline });

  } catch (error) {
    console.error("Clinical API Error:", error);
    return NextResponse.json({ error: 'Failed to fetch clinical data' }, { status: 500 });
  }
}