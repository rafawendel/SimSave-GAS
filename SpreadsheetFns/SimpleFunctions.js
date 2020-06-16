/**
 * Returns the background color of own cell or reference.
 *
 * @param {string} A1 [optional] A1 notation of cell.
 * @return Background color of own cell or referenced cell.
 * @customFunction
 */
function COR(A1) {
  return A1
    ? A1.indexOf(':') > -1
      ? SpreadsheetApp.getActiveSheet()
          .getRange(A1)
          .getBackgrounds()
      : SpreadsheetApp.getActiveSheet()
          .getRange(A1)
          .getBackground()
    : SpreadsheetApp.getActiveSheet()
        .getCurrentCell()
        .getBackground();
}

/**
 * Returns the input as a single column, ignoring empty values.
 *
 * @param {A1:B10} range The range of values to be linearized.
 * @return Vertical array containing linearized input.
 * @customFunction
 */
function SINGLECOLUMN(range) {
  let singleDimensionList = [];
  for (let i = 0; i < range.length; i++) {
    for (let j = 0; j < range[i].length; j++) {
      if (!range[i][j]) continue;
      singleDimensionList.push(range[i][j]);
    }
  }
  return singleDimensionList;
}
