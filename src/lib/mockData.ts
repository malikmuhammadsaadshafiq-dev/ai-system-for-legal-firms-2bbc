export type CaseStatus = 'Active' | 'Review' | 'Closed' | 'On Hold'
export type RiskLevel = 'low' | 'medium' | 'high'
export type IntakeStatus = 'New' | 'Reviewed' | 'Contacted'

export interface LegalCase {
  id: string; title: string; type: string; status: CaseStatus
  client: string; attorney: string; deadline: string
  documents: number; lastActivity: string; value: string; description: string
}

export interface LegalDocument {
  id: string; name: string; type: string; uploadedAt: string
  size: string; status: 'Analyzed' | 'Processing' | 'Queued'
  riskLevel: RiskLevel; caseId: string
}

export interface Clause {
  id: number; heading: string; text: string
  risk: RiskLevel; page: number; note: string
}

export interface IntakeSubmission {
  id: string; name: string; email: string
  caseType: string; submittedAt: string; status: IntakeStatus
}

export const mockCases: LegalCase[] = [
  { id: 'case-001', title: 'Schulz GmbH v. Richter Holding AG', type: 'Commercial Litigation', status: 'Active', client: 'Schulz GmbH', attorney: 'Miriam Kessler', deadline: '2024-03-15', documents: 14, lastActivity: '2024-01-28', value: '€4.2M', description: 'Contract dispute over software licensing agreement. Schulz GmbH alleges Richter Holding failed to deliver contracted functionality within the agreed timeframe, causing operational disruption and financial loss.' },
  { id: 'case-002', title: 'Falkner Immobilien GmbH — Lease Dispute', type: 'Real Estate', status: 'Review', client: 'Falkner Immobilien GmbH', attorney: 'Thomas Brandt', deadline: '2024-02-20', documents: 7, lastActivity: '2024-01-25', value: '€870K', description: 'Commercial lease termination dispute. Tenant claims force majeure clause applies; landlord contests interpretation. Potential €870K in back rent at stake.' },
  { id: 'case-003', title: 'Weiss Pharma AG — Employment Class Action', type: 'Employment Law', status: 'Active', client: 'Weiss Pharma AG', attorney: 'Miriam Kessler', deadline: '2024-04-10', documents: 31, lastActivity: '2024-01-30', value: '€2.1M', description: 'Class action brought by 34 former employees following restructuring. Claims centre on unlawful termination and failure to consult the works council.' },
  { id: 'case-004', title: 'Hartmann & Söhne KG — M&A Due Diligence', type: 'Corporate / M&A', status: 'Active', client: 'Hartmann & Söhne KG', attorney: 'Elena Vogel', deadline: '2024-02-28', documents: 89, lastActivity: '2024-01-29', value: '€18M', description: 'Legal due diligence for acquisition of Nordalp Logistics GmbH. Review of 89 contracts, IP portfolio, regulatory compliance, and outstanding litigation.' },
  { id: 'case-005', title: 'Steinberg IP v. Kopf Technologies', type: 'Intellectual Property', status: 'On Hold', client: 'Steinberg IP GmbH', attorney: 'Thomas Brandt', deadline: '2024-05-01', documents: 19, lastActivity: '2024-01-15', value: '€5.6M', description: 'Patent infringement claim on industrial control system software. Waiting for expert witness availability before proceeding.' },
  { id: 'case-006', title: 'Bauer Logistics AG — Regulatory Compliance', type: 'Regulatory', status: 'Closed', client: 'Bauer Logistics AG', attorney: 'Elena Vogel', deadline: '2024-01-10', documents: 23, lastActivity: '2024-01-10', value: '€340K', description: 'Successfully resolved data protection inquiry by BayLDA. Implemented remediation measures and submitted compliance report.' },
]

export const mockDocuments: LegalDocument[] = [
  { id: 'doc-001', name: 'NDA_Richter_Holding_2024.pdf', type: 'NDA', uploadedAt: '2024-01-28', size: '340 KB', status: 'Analyzed', riskLevel: 'high', caseId: 'case-001' },
  { id: 'doc-002', name: 'SLA_Schulz_Software_Agreement.pdf', type: 'Service Agreement', uploadedAt: '2024-01-27', size: '890 KB', status: 'Analyzed', riskLevel: 'medium', caseId: 'case-001' },
  { id: 'doc-003', name: 'Falkner_Lease_Agreement_2021.pdf', type: 'Lease', uploadedAt: '2024-01-25', size: '1.2 MB', status: 'Analyzed', riskLevel: 'low', caseId: 'case-002' },
  { id: 'doc-004', name: 'Employment_Contracts_Bundle.zip', type: 'Employment', uploadedAt: '2024-01-30', size: '4.7 MB', status: 'Processing', riskLevel: 'medium', caseId: 'case-003' },
  { id: 'doc-005', name: 'Patent_EP3021847_Certificate.pdf', type: 'IP / Patent', uploadedAt: '2024-01-15', size: '210 KB', status: 'Analyzed', riskLevel: 'low', caseId: 'case-005' },
]

export const mockClauses: Clause[] = [
  { id: 1, heading: 'Confidentiality Period', text: 'All confidential information disclosed under this Agreement shall remain protected for a period of three (3) years from the date of disclosure.', risk: 'low', page: 2, note: 'Standard duration. Acceptable for most NDA contexts.' },
  { id: 2, heading: 'Jurisdiction & Governing Law', text: 'This Agreement shall be governed by the laws of the Federal Republic of Germany. Any disputes shall be subject to the exclusive jurisdiction of the courts in Berlin.', risk: 'low', page: 3, note: 'Clear jurisdiction. No outstanding issues.' },
  { id: 3, heading: 'Penalty Clause', text: 'In the event of any breach of the confidentiality obligations under Section 4, the breaching party shall pay liquidated damages of FIFTY THOUSAND EUROS (€50,000) per individual breach, regardless of actual damages incurred.', risk: 'high', page: 4, note: 'Unusually high penalty. Recommend capping or requiring proof of actual damages.' },
  { id: 4, heading: 'Non-Compete Scope', text: 'The receiving party agrees not to engage, directly or indirectly, in any competing business activity within the European Union for a period of twenty-four (24) months following termination.', risk: 'medium', page: 5, note: 'EU-wide scope may not be fully enforceable under German competition law (GWB). Recommend narrowing to DACH region.' },
  { id: 5, heading: 'Data Processing', text: 'The parties acknowledge that personal data may be shared under this agreement and agree that each party acts as an independent data controller under GDPR.', risk: 'medium', page: 6, note: 'Mutual controller designation requires a separate DPA. Current language is insufficient for GDPR Art. 26 compliance.' },
  { id: 6, heading: 'Term & Auto-Renewal', text: 'This Agreement shall remain in force for an initial term of two (2) years and shall automatically renew for successive one-year terms unless terminated with sixty (60) days written notice.', risk: 'low', page: 7, note: 'Auto-renewal with adequate notice period. Standard practice.' },
]

export const mockIntakeSubmissions: IntakeSubmission[] = [
  { id: 'sub-001', name: 'Annika Hofstetter', email: 'a.hofstetter@hofstetter-gmbh.de', caseType: 'Employment Law', submittedAt: '2024-01-30 09:14', status: 'New' },
  { id: 'sub-002', name: 'Werner Albrecht', email: 'w.albrecht@albrecht-gruppe.com', caseType: 'Commercial Litigation', submittedAt: '2024-01-29 14:32', status: 'Reviewed' },
  { id: 'sub-003', name: 'Petra Neumann', email: 'p.neumann@ncp-europe.eu', caseType: 'IP / Patent', submittedAt: '2024-01-28 11:05', status: 'Contacted' },
  { id: 'sub-004', name: 'Lukas Brenner', email: 'lukas.brenner@bmgh-invest.de', caseType: 'Real Estate', submittedAt: '2024-01-27 16:48', status: 'New' },
]

export const mockStats = {
  activeCases: 4,
  documentsProcessed: 187,
  hoursSaved: 312,
  clausesFlagged: 48,
  documentsThisMonth: 34,
  newIntakes: 4,
}

export const draftTemplates = [
  { id: 'nda', label: 'Non-Disclosure Agreement', description: 'Mutual or one-way confidentiality agreement under German law' },
  { id: 'engagement', label: 'Engagement Letter', description: 'Client retainer and scope-of-services letter for new matters' },
  { id: 'demand', label: 'Demand Letter', description: 'Formal pre-litigation demand for payment or specific performance' },
]
