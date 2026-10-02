export type ServiceOption =
  | 'Informational Website'
  | 'Business Website'
  | 'E-Commerce Website'
  | 'Custom Web Application'
  | 'Custom Mobile App'
  | 'Other';

export type PlanOption =
  | 'Starter — $70 CAD'
  | 'Business — $100 CAD'
  | 'Professional — $250 CAD'
  | 'Custom Project';

export type YesNoChoice = 'Yes' | 'No' | '';

export interface ExistingResourcesMap {
  'Domain': YesNoChoice;
  'Hosting': YesNoChoice;
  'Logo / Branding': YesNoChoice;
  'Product Photos': YesNoChoice;
  'Product Information': YesNoChoice;
  'Social Media': YesNoChoice;
  'Website Content': YesNoChoice;
}

export interface ProjectRequestFormData {
  // Step 1 — Project
  service: ServiceOption | '';
  plan: PlanOption | '';

  // Step 2 — Business
  fullName: string;
  businessName: string;
  email: string;
  instagram: string;

  // Step 3 — Project Details
  websiteType: string;
  numberOfProducts: string;
  budget: string;
  desiredDeadline: string;
  projectDescription: string;
  referenceWebsites: string;

  // Step 4 — Existing Resources
  existingResources: ExistingResourcesMap;

  // Step 5 — Additional Requirements
  additionalNotes: string;
}

/**
 * Exact 18-column payload sent to Google Apps Script doPost(e)
 * Maps 1-to-1 with the Google Sheet columns:
 * ID | Date | Name | Email | Business | Instagram | Service | Plan | Website Type |
 * Products | Budget | Deadline | Description | Existing Assets | Reference | Status | Priority | Notes
 */
export interface GoogleSheetRowPayload {
  id: string;
  date: string;
  name: string;
  email: string;
  business: string;
  instagram: string;
  service: string;
  plan: string;
  websiteType: string;
  products: string;
  budget: string;
  deadline: string;
  description: string;
  existingAssets: string;
  reference: string;
  status: 'NEW';
  priority: 'NORMAL';
  notes: string;
}

export const SERVICE_OPTIONS: {
  value: ServiceOption;
  summary: string;
}[] = [
  {
    value: 'Informational Website',
    summary: 'Editorial pages, company overview, and structured information architecture.'
  },
  {
    value: 'Business Website',
    summary: 'Lead-focused corporate presence with service pages and client inquiry flows.'
  },
  {
    value: 'E-Commerce Website',
    summary: 'Online storefront with product catalog, cart, and checkout configuration.'
  },
  {
    value: 'Custom Web Application',
    summary: 'Bespoke browser-based software, workflows, or database-driven tools.'
  },
  {
    value: 'Custom Mobile App',
    summary: 'Cross-platform or native mobile experience built for iOS and Android.'
  },
  {
    value: 'Other',
    summary: 'Specialized digital build, redesign, or custom technical integration.'
  }
];

export const PLAN_OPTIONS: {
  value: PlanOption;
  title: string;
  price: string;
  summary: string;
}[] = [
  {
    value: 'Starter — $70 CAD',
    title: 'Starter',
    price: '$70 CAD',
    summary: 'Clean foundational presence for new brands and single-focus launches.'
  },
  {
    value: 'Business — $100 CAD',
    title: 'Business',
    price: '$100 CAD',
    summary: 'Multi-section business website built to capture inquiries and showcase services.'
  },
  {
    value: 'Professional — $250 CAD',
    title: 'Professional',
    price: '$250 CAD',
    summary: 'Full-featured digital storefront or multi-page architecture with custom flows.'
  },
  {
    value: 'Custom Project',
    title: 'Custom Project',
    price: 'Custom Scope',
    summary: 'Tailored engineering specification for web applications, mobile apps, or complex systems.'
  }
];

export const EXISTING_RESOURCE_KEYS: (keyof ExistingResourcesMap)[] = [
  'Domain',
  'Hosting',
  'Logo / Branding',
  'Product Photos',
  'Product Information',
  'Social Media',
  'Website Content'
];
