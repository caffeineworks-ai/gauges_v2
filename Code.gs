// ──────────────────────────────────────────────
// Edge Measurement Tool — Apps Script Web App
// 스프레드시트에 붙여넣고 배포 > 웹 앱으로 배포
// 실행 대상: 나, 액세스 권한: 모든 사용자
// ──────────────────────────────────────────────

const SHEET_NAME = 'EdgeData';
const HEADERS = [
  'Index', 'Brand', 'Category', 'Product Name',
  'Edge Type', 'Total Real (mm)', 'Part Est (mm)',
  'Ratio', 'Description', 'Text URL', 'Worker'
];

function getSheet() {
  const ss = SpreadsheetApp.getActiveSpreadsheet();
  let sheet = ss.getSheetByName(SHEET_NAME);
  if (!sheet) {
    sheet = ss.insertSheet(SHEET_NAME);
    sheet.appendRow(HEADERS);
    sheet.setFrozenRows(1);
  }
  return sheet;
}

// ──────────────────────────────────────────────
// GET: 전체 레코드 조회
// ──────────────────────────────────────────────
function doGet(e) {
  try {
    const sheet = getSheet();
    const data = sheet.getDataRange().getValues();
    const headers = data[0];
    const rows = data.slice(1).map((row, i) => {
      const obj = {};
      headers.forEach((h, j) => obj[h] = row[j]);
      obj._row = i + 2; // 실제 시트 행 번호
      return obj;
    }).filter(r => r['Index'] !== ''); // 빈 행 제외

    return jsonResponse({ ok: true, records: rows });
  } catch(e) {
    return jsonResponse({ ok: false, error: e.message });
  }
}

// ──────────────────────────────────────────────
// POST: action에 따라 분기
// ──────────────────────────────────────────────
function doPost(e) {
  try {
    const body = JSON.parse(e.postData.contents);
    const action = body.action;

    if (action === 'append') return actionAppend(body.data);
    if (action === 'update') return actionUpdate(body.row, body.data);
    if (action === 'delete') return actionDelete(body.row);

    return jsonResponse({ ok: false, error: 'Unknown action' });
  } catch(err) {
    return jsonResponse({ ok: false, error: err.message });
  }
}

function actionAppend(data) {
  const sheet = getSheet();
  const index = Date.now();
  const row = [
    index,
    data.brand       || '',
    data.category    || '',
    data.product     || '',
    data.edgeType    || '',
    data.totalReal   || '',
    data.partEst     || '',
    data.ratio       || '',
    data.description || '',
    data.textUrl     || '',
    data.worker      || ''
  ];
  sheet.appendRow(row);
  return jsonResponse({ ok: true, index });
}

function actionUpdate(rowNum, data) {
  const sheet = getSheet();
  const existing = sheet.getRange(rowNum, 1).getValue();
  const row = [
    existing,
    data.brand       || '',
    data.category    || '',
    data.product     || '',
    data.edgeType    || '',
    data.totalReal   || '',
    data.partEst     || '',
    data.ratio       || '',
    data.description || '',
    data.textUrl     || '',
    data.worker      || ''
  ];
  sheet.getRange(rowNum, 1, 1, row.length).setValues([row]);
  return jsonResponse({ ok: true });
}

function actionDelete(rowNum) {
  const sheet = getSheet();
  sheet.deleteRow(rowNum);
  return jsonResponse({ ok: true });
}

function jsonResponse(obj) {
  return ContentService
    .createTextOutput(JSON.stringify(obj))
    .setMimeType(ContentService.MimeType.JSON);
}
