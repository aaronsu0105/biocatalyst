export interface TrialPhase {
  phaseNumber: 1 | 2 | 3 | 4;
  status: "COMPLETED" | "ONGOING" | "UPCOMING" | "FAILED";
  estimatedCompletionDate: string;
  simplifiedObjective: string;
  rawScientificTitle: string;
}

export interface BiotechCompany {
  id: string;
  name: string;
  ticker: string;
  marketCap: string;
  riskScore: "LOW" | "MEDIUM" | "HIGH";
  drugName: string;
  targetCondition: string;
  tags: string[];
  simplifiedMechanism: string;
  rawMechanism: string;
  currentPhase: 1 | 2 | 3 | 4;
  pipeline: TrialPhase[];
  nextCatalystDate: string;
  catalystDescription: string;
}