function addToSpreadsheet(header, data) {
  const ss =
    SpreadsheetApp.getActiveSpreadsheet().getSheetByName('Imports') ||
    SpreadsheetApp.getActiveSpreadsheet().insertSheet('Imports');
  ss.clearContents();

  const headRange = ss.getRange(1, 1, 1, header[0].length);
  const dataRange = ss.getRange(2, 1, data.length, data[0].length);

  headRange.setValues(header);
  dataRange.setValues(data);
  SpreadsheetApp.flush();
}

function toHHMMSS(timeInSeconds) {
  return `${Math.floor(timeInSeconds / 3600) || '00'}:${Math.floor((timeInSeconds % 3600) / 60) ||
    '00'}:${timeInSeconds % 60 || '00'}`;
}

function arraySplitter(arr) {
  return arr.reduce(
    (acc, splitter) => {
      const [first, ...rest] = splitter;
      acc[0].push(first);
      acc[1].push(rest);
      return acc;
    },
    [[], []]
  );
}
