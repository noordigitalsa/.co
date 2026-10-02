import {
  EXISTING_RESOURCE_KEYS,
  GoogleSheetRowPayload,
  ProjectRequestFormData
} from '../types/projectRequest';

/**
 * ============================================================================
 * GOOGLE APPS SCRIPT ENDPOINT CONFIGURATION
 * ============================================================================
 * Production Google Apps Script Web App endpoint (ending in /exec).
 */
export const GOOGLE_APPS_SCRIPT_WEB_APP_URL: string =
  'https://script.google.com/macros/s/AKfycbyw2q-QHB3q4y3A3tC-GPVxRUZWxSWsIpP3qK2j99JpsCjIY7v1Mt7c-d3-azsdwr_W/exec';

/**
 * Returns the active production Google Apps Script Web App URL.
 */
export function getActiveAppsScriptUrl(): string {
  return GOOGLE_APPS_SCRIPT_WEB_APP_URL.trim();
}

/**
 * Validates that the provided URL is a deployed Google Apps Script Web App URL
 * starting with https://script.google.com/macros/s/ and ending with /exec.
 */
export function validateAppsScriptUrl(url: string): { valid: boolean; error?: string } {
  const trimmed = url.trim();
  if (!trimmed) {
    return {
      valid: false,
      error:
        'Google Apps Script Web App URL is not configured in src/config/appsScript.ts.'
    };
  }

  if (trimmed.includes('docs.google.com/spreadsheets')) {
    return {
      valid: false,
      error:
        'Invalid URL: Google Sheet URL detected instead of the Google Apps Script Web App URL. The URL must start with https://script.google.com/macros/s/ and end with /exec.'
    };
  }

  if (!trimmed.startsWith('https://script.google.com/macros/s/')) {
    return {
      valid: false,
      error:
        'Invalid endpoint URL. The URL must start with https://script.google.com/macros/s/'
    };
  }

  if (trimmed.endsWith('/dev')) {
    return {
      valid: false,
      error:
        'Invalid endpoint URL: /dev test URL detected. Please use the production deployment URL ending in /exec.'
    };
  }

  if (!trimmed.endsWith('/exec')) {
    return {
      valid: false,
      error:
        'The Google Apps Script Web App URL must end with /exec.'
    };
  }

  return { valid: true };
}

/**
 * Generates a client-side fallback Reference ID (e.g. GDS-20261001-4821)
 */
function createRequestId(now: Date): string {
  const yyyy = now.getFullYear();
  const mm = String(now.getMonth() + 1).padStart(2, '0');
  const dd = String(now.getDate()).padStart(2, '0');
  const rand = Math.floor(1000 + Math.random() * 9000);
  return `GDS-${yyyy}${mm}${dd}-${rand}`;
}

/**
 * Formats the 7 Yes/No existing resource answers into a single clean cell string
 * for the "Existing Assets" column in Google Sheets.
 */
export function formatExistingAssetsColumn(
  resources: ProjectRequestFormData['existingResources']
): string {
  return EXISTING_RESOURCE_KEYS.map(
    (key) => `${key}: ${resources[key] || 'No'}`
  ).join(' | ');
}

/**
 * Maps the 5-step form state to the exact property names expected by Google Apps Script:
 * name, email, business, instagram, service, plan, websiteType,
 * products, budget, deadline, description, existingAssets, reference, notes,
 * plus id, date, status ('NEW'), priority ('NORMAL').
 */
export function buildGoogleSheetPayload(
  formData: ProjectRequestFormData
): GoogleSheetRowPayload {
  const now = new Date();
  const formattedInstagram = formData.instagram.trim()
    ? formData.instagram.trim().startsWith('@')
      ? formData.instagram.trim()
      : `@${formData.instagram.trim()}`
    : '';

  return {
    id: createRequestId(now),
    date: now.toISOString(),
    name: formData.fullName.trim(),
    email: formData.email.trim(),
    business: formData.businessName.trim(),
    instagram: formattedInstagram,
    service: formData.service,
    plan: formData.plan,
    websiteType: formData.websiteType.trim(),
    products: formData.numberOfProducts.trim(),
    budget: formData.budget.trim(),
    deadline: formData.desiredDeadline.trim(),
    description: formData.projectDescription.trim(),
    existingAssets: formatExistingAssetsColumn(formData.existingResources),
    reference: formData.referenceWebsites.trim(),
    status: 'NEW',
    priority: 'NORMAL',
    notes: formData.additionalNotes.trim()
  };
}

export interface SubmissionResult {
  ok: boolean;
  requestId: string;
  submittedAt: string;
  error?: string;
}

/**
 * Sends a REAL HTTP POST request to the deployed Google Apps Script Web App
 * returned by getActiveAppsScriptUrl().
 *
 * Uses Content-Type: text/plain;charset=utf-8 and redirect: 'follow' so the browser:
 * 1. Sends a CORS simple POST request without failing on OPTIONS preflight
 * 2. Follows Google Apps Script's HTTP 302 redirect to script.googleusercontent.com
 * 3. Reads the actual JSON output returned by doPost(e)
 * 4. Throws a real error if the Apps Script returns { success: false }, { ok: false }, or { error: "..." }
 */
export async function submitProjectRequestToGoogleSheets(
  formData: ProjectRequestFormData
): Promise<SubmissionResult> {
  const endpointUrl = getActiveAppsScriptUrl();
  const validation = validateAppsScriptUrl(endpointUrl);

  if (!validation.valid) {
    throw new Error(validation.error);
  }

  const payload = buildGoogleSheetPayload(formData);

  const response = await fetch(endpointUrl, {
    method: 'POST',
    mode: 'cors',
    headers: {
      'Content-Type': 'text/plain;charset=utf-8'
    },
    body: JSON.stringify(payload),
    redirect: 'follow'
  });

  if (!response.ok) {
    throw new Error(
      `Google Apps Script returned HTTP ${response.status}. Verify that your Web App is deployed with "Who has access: Anyone".`
    );
  }

  const text = (await response.text()).trim();

  if (!text) {
    throw new Error(
      'Google Apps Script returned an empty response. Verify your doPost(e) function returns ContentService JSON output.'
    );
  }

  // Check if Google returned an HTML login or error page instead of script output
  if (text.includes('accounts.google.com') || text.includes('Sign in')) {
    throw new Error(
      'Google Apps Script required Sign-In. In Apps Script -> Deploy -> Manage deployments, make sure "Who has access" is set to "Anyone".'
    );
  }

  if (text.includes('<!DOCTYPE html>') || text.includes('<html')) {
    if (text.includes('Script function not found: doPost')) {
      throw new Error(
        'Google Apps Script error: Script function not found: doPost. Make sure doPost(e) is saved and deployed in a New Version.'
      );
    }
    throw new Error(
      'Google Apps Script returned an HTML error page instead of JSON. Check your Apps Script code and re-deploy a New Version.'
    );
  }

  // Parse JSON response returned by ContentService in doPost(e)
  let json: Record<string, unknown>;
  try {
    json = JSON.parse(text);
  } catch {
    throw new Error(
      `Google Apps Script returned non-JSON output: ${text.slice(0, 200)}`
    );
  }

  // Check ALL error formats returned by Google Apps Script ({ success: false, error: "..." }, { ok: false }, etc.)
  if (
    !json ||
    json.success === false ||
    json.ok === false ||
    json.status === 'error' ||
    json.result === 'error' ||
    Boolean(json.error)
  ) {
    const rawError = String(
      json?.error ||
        json?.message ||
        'Google Apps Script reported an error while writing to the Google Sheet.'
    );

    if (rawError.includes("reading 'appendRow'")) {
      throw new Error(
        `Google Apps Script Error: ${rawError}. Your Apps Script could not find the target sheet/tab (getSheetByName returned null, or getActiveSpreadsheet() returned null). In your Google Apps Script Code.gs, make sure your SHEET_ID is set and use spreadsheet.getSheets()[0] or match the exact tab name at the bottom of your Google Sheet, then Deploy -> Manage deployments -> Edit -> New version.`
      );
    }

    throw new Error(`Google Apps Script Error: ${rawError}`);
  }

  return {
    ok: true,
    requestId: typeof json.id === 'string' && json.id ? json.id : payload.id,
    submittedAt: typeof json.date === 'string' && json.date ? json.date : payload.date
  };
}
