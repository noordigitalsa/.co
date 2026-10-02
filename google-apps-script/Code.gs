/**
 * GOODSiFY Development — Project Request Intake Backend (Google Apps Script)
 *
 * WHY "Cannot read properties of null (reading 'appendRow')" HAPPENS:
 * That error occurs in Google Apps Script when:
 *   1) SpreadsheetApp.getActiveSpreadsheet() is used in a standalone script (returns null), OR
 *   2) spreadsheet.getSheetByName("...") looks for a tab name (e.g. "Requests" or "Projects")
 *      that does not match the actual tab name at the bottom of your Google Sheet (returns null).
 *
 * The code below fixes this permanently by falling back to the first tab in the spreadsheet
 * (`spreadsheet.getSheets()[0]`) if the named tab is not found, so `sheet` is NEVER null.
 */

// ============================================================================
// 1. CONFIGURATION — PASTE YOUR GOOGLE SHEET ID BELOW
// ============================================================================
// Copy the ID from your Google Sheet URL between "/d/" and "/edit":
// https://docs.google.com/spreadsheets/d/YOUR_GOOGLE_SHEET_ID_HERE/edit
const SHEET_ID = "PASTE_YOUR_GOOGLE_SHEET_ID_HERE";

// Optional tab name. If a tab with this name doesn't exist, the script automatically
// uses the first tab (`getSheets()[0]`) so `appendRow` never fails with null!
const SHEET_TAB_NAME = "Sheet1";

const REQUIRED_HEADERS = [
  "ID",
  "Date",
  "Name",
  "Email",
  "Business",
  "Instagram",
  "Service",
  "Plan",
  "Website Type",
  "Products",
  "Budget",
  "Deadline",
  "Description",
  "Existing Assets",
  "Reference",
  "Status",
  "Priority",
  "Notes"
];

function doGet() {
  return createJsonResponse({
    success: true,
    ok: true,
    service: "GOODSiFY Development Project Request API"
  });
}

function doPost(e) {
  const lock = LockService.getScriptLock();
  lock.tryLock(10000);

  try {
    if (!e || !e.postData || !e.postData.contents) {
      return createJsonResponse({
        success: false,
        ok: false,
        error: "No request payload received."
      });
    }

    const data = JSON.parse(e.postData.contents);
    const sheet = getTargetSheet();
    ensureHeadersExist(sheet);

    const now = new Date();
    const requestId = data.id || generateRequestId(now);
    const formattedDate = Utilities.formatDate(
      now,
      Session.getScriptTimeZone() || "America/Toronto",
      "yyyy-MM-dd HH:mm:ss"
    );

    let existingAssetsText = "";
    if (typeof data.existingAssets === "string") {
      existingAssetsText = data.existingAssets;
    } else if (data.existingAssets && typeof data.existingAssets === "object") {
      existingAssetsText = Object.keys(data.existingAssets)
        .map(function (key) {
          return key + ": " + data.existingAssets[key];
        })
        .join(" | ");
    }

    const status = "NEW";
    const priority = "NORMAL";

    // Exact 18 columns matching your Google Sheet:
    const rowValues = [
      requestId,                        // 1. ID
      formattedDate,                    // 2. Date
      sanitizeCell(data.name),          // 3. Name
      sanitizeCell(data.email),         // 4. Email
      sanitizeCell(data.business),      // 5. Business
      sanitizeCell(data.instagram),     // 6. Instagram
      sanitizeCell(data.service),       // 7. Service
      sanitizeCell(data.plan),          // 8. Plan
      sanitizeCell(data.websiteType),   // 9. Website Type
      sanitizeCell(data.products),      // 10. Products
      sanitizeCell(data.budget),        // 11. Budget
      sanitizeCell(data.deadline),      // 12. Deadline
      sanitizeCell(data.description),   // 13. Description
      sanitizeCell(existingAssetsText), // 14. Existing Assets
      sanitizeCell(data.reference),     // 15. Reference
      status,                           // 16. Status = NEW
      priority,                         // 17. Priority = NORMAL
      sanitizeCell(data.notes)          // 18. Notes
    ];

    sheet.appendRow(rowValues);

    return createJsonResponse({
      success: true,
      ok: true,
      id: requestId,
      date: formattedDate,
      status: status,
      priority: priority
    });
  } catch (err) {
    return createJsonResponse({
      success: false,
      ok: false,
      error: err && err.message ? err.message : String(err)
    });
  } finally {
    lock.releaseLock();
  }
}

/**
 * Safely locates the target sheet so `sheet` is NEVER null.
 */
function getTargetSheet() {
  let spreadsheet = null;

  if (SHEET_ID && SHEET_ID !== "PASTE_YOUR_GOOGLE_SHEET_ID_HERE" && SHEET_ID.trim() !== "") {
    spreadsheet = SpreadsheetApp.openById(SHEET_ID.trim());
  } else {
    spreadsheet = SpreadsheetApp.getActiveSpreadsheet();
  }

  if (!spreadsheet) {
    throw new Error(
      "Spreadsheet is null. Paste your Google Sheet ID into SHEET_ID at the top of Code.gs."
    );
  }

  // First try the named tab; if not found, always fall back to the first tab in the Google Sheet
  let sheet = spreadsheet.getSheetByName(SHEET_TAB_NAME);
  if (!sheet) {
    const allSheets = spreadsheet.getSheets();
    if (allSheets && allSheets.length > 0) {
      sheet = allSheets[0];
    }
  }

  if (!sheet) {
    throw new Error("No worksheet tabs found inside the Google Sheet.");
  }

  return sheet;
}

function ensureHeadersExist(sheet) {
  if (sheet.getLastRow() === 0) {
    sheet.appendRow(REQUIRED_HEADERS);
    sheet.getRange(1, 1, 1, REQUIRED_HEADERS.length).setFontWeight("bold");
    sheet.setFrozenRows(1);
  }
}

function sanitizeCell(value) {
  if (value === null || value === undefined) return "";
  const str = String(value).trim();
  if (/^[=+\-@]/.test(str)) {
    return "'" + str;
  }
  return str;
}

function generateRequestId(dateObj) {
  const datePart = Utilities.formatDate(dateObj, "GMT", "yyyyMMdd");
  const randomPart = Math.floor(1000 + Math.random() * 9000);
  return "GDS-" + datePart + "-" + randomPart;
}

function createJsonResponse(payload) {
  return ContentService.createTextOutput(JSON.stringify(payload)).setMimeType(
    ContentService.MimeType.JSON
  );
}
