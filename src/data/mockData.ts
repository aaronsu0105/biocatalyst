import { BiotechCompany } from "@/types/biotech";

export const mockBiotechCompanies: BiotechCompany[] = [
  {
    id: "1",
    name: "Axiom Therapeutics",
    ticker: "AXSM",
    marketCap: "$640M",
    riskScore: "HIGH",
    drugName: "Axo-102",
    targetCondition: "Glioblastoma (Brain Cancer)",
    tags: ["Oncology", "CNS", "Small Molecule"],
    simplifiedMechanism:
      "A targeted molecular missile that sneaks past the blood-brain barrier to shut down the self-destruct override switch inside brain tumor cells.",
    rawMechanism:
      "A small-molecule MDM2 inhibitor engineered with high blood-brain barrier penetrance, designed to disrupt the p53-MDM2 interaction and restore apoptotic pathways in IDH-wildtype glioblastoma multiforme.",
    currentPhase: 2,
    nextCatalystDate: "Q3 2026",
    catalystDescription: "Phase 2b Efficacy Data Readout",
    pipeline: [
      {
        phaseNumber: 1,
        status: "COMPLETED",
        estimatedCompletionDate: "Nov 2024",
        simplifiedObjective:
          "Tested on 24 volunteers. Proved the drug doesn't cause severe toxic liver reactions at therapeutic doses.",
        rawScientificTitle:
          "Safety, Pharmacokinetics, and Maximum Tolerated Dose of Axo-102 in Healthy Subjects",
      },
      {
        phaseNumber: 2,
        status: "ONGOING",
        estimatedCompletionDate: "Sept 2026",
        simplifiedObjective:
          "Currently checking if the drug actually shrinks brain tumors in 120 patients over a 6-month period.",
        rawScientificTitle:
          "Phase 2 Evaluation of Objective Response Rate (ORR) using Axo-102 Mono-therapy",
      },
      {
        phaseNumber: 3,
        status: "UPCOMING",
        estimatedCompletionDate: "Dec 2028",
        simplifiedObjective:
          "Will test on 1,500+ patients to prove it extends life expectancy longer than standard chemotherapy.",
        rawScientificTitle:
          "Randomized, Double-Blind Phase 3 Trial of Axo-102 vs. Temozolomide in Refractory GBM",
      },
    ],
  },
  {
    id: "2",
    name: "Vertex Biologics",
    ticker: "VRTX",
    marketCap: "$82B",
    riskScore: "LOW",
    drugName: "Vx-880",
    targetCondition: "Type 1 Diabetes",
    tags: ["Cell Therapy", "Endocrinology", "Stem Cell"],
    simplifiedMechanism:
      "Fully functional pancreatic islet cells grown in a lab from stem cells, designed to be infused directly into the liver to start making insulin naturally.",
    rawMechanism:
      "An allogeneic, stem cell-derived, fully differentiated pancreatic islet cell replacement therapy administered via hepatic portal vein infusion, requiring concurrent immunosuppressive regimens.",
    currentPhase: 3,
    nextCatalystDate: "Oct 14, 2026",
    catalystDescription: "FDA PDUFA Approval Deadline",
    pipeline: [
      {
        phaseNumber: 1,
        status: "COMPLETED",
        estimatedCompletionDate: "Jan 2022",
        simplifiedObjective:
          "Confirmed the stem-cell derived implants are safe and don't trigger immediate immune rejection.",
        rawScientificTitle:
          "Phase 1 Open-Label Study of VX-880 Safety and Tolerability Profiles",
      },
      {
        phaseNumber: 2,
        status: "COMPLETED",
        estimatedCompletionDate: "Aug 2025",
        simplifiedObjective:
          "Proved that patients given the cells successfully started producing their own insulin, drastically dropping their daily injection needs.",
        rawScientificTitle:
          "Efficacy Assessment of C-peptide Secretion Following Allogeneic Islet Infusion",
      },
      {
        phaseNumber: 3,
        status: "COMPLETED",
        estimatedCompletionDate: "Mar 2026",
        simplifiedObjective:
          "Large scale trial tracking patients for a full year to guarantee long-term stability and insulin independence.",
        rawScientificTitle:
          "Pivotal Phase 3 Multi-Center Trial for Cellular Insulin Independence at 52 Weeks",
      },
    ],
  },
  {
    id: "3",
    name: "CRISPR Therapeutics",
    ticker: "CRSP",
    marketCap: "$3.8B",
    riskScore: "MEDIUM",
    drugName: "Casgevy",
    targetCondition: "Sickle Cell Disease",
    tags: ["CRISPR", "Gene Therapy", "Approved"],
    simplifiedMechanism:
      "The world's first approved CRISPR therapy. It edits patients' own stem cells to reactivate a backup form of hemoglobin from before birth, effectively curing sickle cell disease.",
    rawMechanism:
      "Casgevy (exagamglogene autotemcel) utilizes CRISPR-Cas9 to disrupt BCL11A erythroid enhancer in autologous CD34+ HSCs, reactivating fetal hemoglobin expression to compensate for defective adult hemoglobin.",
    currentPhase: 3,
    nextCatalystDate: "Q2 2025",
    catalystDescription: "Commercial ramp and real-world outcomes data",
    pipeline: [
      {
        phaseNumber: 1,
        status: "COMPLETED",
        estimatedCompletionDate: "2020 Q2",
        simplifiedObjective:
          "Showed edited stem cells safely engraft and survive long-term.",
        rawScientificTitle: "Safety and engraftment study of CTX001",
      },
      {
        phaseNumber: 3,
        status: "COMPLETED",
        estimatedCompletionDate: "2023 Q4",
        simplifiedObjective:
          "Proved the cure works — FDA approved Dec 2023.",
        rawScientificTitle: "CLIMB-121 pivotal trial (SCD)",
      },
    ],
  },
];