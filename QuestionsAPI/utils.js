// Utils
function parseContentListAsObject_(idList, type) {
  if (idList === '') return {};
  return parseStringAsArray_(idList)
    .map(id => (typeof id === 'string' ? +id.trim() : id))
    .reduce(
      (obj, id) => ({
        ...obj,
        [id]: { type }
      }),
      {}
    );
}

function clearEmptyFields_(objArr, keyList) {
  return objArr.filter(obj => {
    for (let key in obj) {
      if (!keyList.includes(key)) continue;
      if (!obj[key]) return false;
    }
    return true;
  });
}
function parseStringAsArray_(str) {
  return str === null || str === undefined
    ? []
    : str instanceof Array
    ? str
    : typeof str === 'object'
    ? Object.values(str)
    : typeof str === 'string'
    ? str.split(',')
    : [str];
}

function parseIdListAsArray_(idList = '') {
  return parseStringAsArray_(idList).map(i => +i.trim());
}

function convert2DArrayToObject_(array, key) {
  return array.reduce(
    (obj, item) => ({
      ...obj,
      [item[key]]: item
    }),
    {}
  );
}

function paragraphize_(string) {
  return `<p>${string}</p>`;
}

function removeHTMLTags_(text) {
  return text.replace(/<[^>]*>/g, '');
}

// Spreadsheet
function addToSpreadsheet_(
  matrix,
  sheetName,
  clear = false,
  ss = SpreadsheetApp.getActiveSpreadsheet()
) {
  const sheet = ss.getSheetByName(sheetName) || ss.insertSheet(sheetName);

  if (clear) sheet.getDataRange().clear();

  const range = sheet.getRange(1, 1, matrix.length, matrix[0].length);
  range.setValues(matrix);

  SpreadsheetApp.flush();
}

function getColumnByHeaderName_(
  headerName,
  sheetName,
  headerStart = [1, 1],
  ss = SpreadsheetApp.getActiveSpreadsheet()
) {
  const sheet = sheetName ? ss.getSheetByName(sheetName) : ss.getActiveSheet();
  const lastRow = sheet.getDataRange().getLastRow();
  const [headers] = sheet.getRange(...headerStart, 1, lastRow).getValues();

  const indexOfHeader = headers.indexOf(headerName);
  if (indexOfHeader < 0) throw 'Not found';

  const colIndex = indexOfHeader + headerStart[1];
  const column = sheet
    .getRange(headerStart[0] + 1, colIndex, lastRow)
    .getValues()
    .map(row => row[0]);
  return [colIndex, column];
}

// @param {array} range = [row, column, numRows, numColumns] OR [row, column, numColumns] OR [row, column]
function parseSpreadsheetAsObject_(
  range = [1, 1, 1, 1],
  sheetName,
  ss = SpreadsheetApp.getActiveSpreadsheet()
) {
  const sheet = sheetName ? ss.getSheetByName(sheetName) : ss.getActiveSheet();

  if (range.length === 2)
    // eslint-disable-next-line no-param-reassign
    range = [...range, sheet.getDataRange().getLastRow(), sheet.getDataRange().getLastColumn()];
  // eslint-disable-next-line no-param-reassign
  if (range.length === 3) range = [range[0], range[1], sheet.getDataRange().getLastRow(), range[2]];
  const [header, ...data] = sheet.getRange(...range).getValues();

  const dataObjList = data.map(row =>
    row.reduce(
      (tot, col, i) =>
        header[i] && header[i] !== '\n'
          ? { ...tot, [header[i]]: col.trim ? col.trim() : col }
          : tot,
      {}
    )
  );

  return dataObjList;
}

function saveColumnToSpreadsheet_(
  col,
  data,
  sheetName,
  offset = 1,
  ss = SpreadsheetApp.getActiveSpreadsheet()
) {
  const sheet = sheetName ? ss.getSheetByName(sheetName) : ss.getActiveSheet();
  const destRange = sheet.getRange(offset + 1, col, data.length, 1);
  destRange.setValues(data.map(item => [item]));

  SpreadsheetApp.flush();
}
