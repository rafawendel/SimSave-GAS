function removeHTMLTags(text) {
  return text.replace(/<[^>]*>/g, '')
}

function fetchUrl(reqUrl, params) {
  return new Promise((resolve, reject) => {
    const res = UrlFetchApp.fetch(reqUrl, { ...params, muteHttpExceptions: true });
    if (res.getResponseCode() >= 200 && res.getResponseCode() < 300) {
      resolve(JSON.parse(res));
    } else {
      reject(res.getResponseCode());
    }
  })
};

async function batchFetch(reqUrlList, params) {
  let networkErrors = [];
  const responses = await Promise.all(
    reqUrlList.map(reqUrl => (
      fetchUrl(reqUrl, params)
        .catch(err => networkErrors.push(err)) // avoids stopping of the chain
        .then(res => res)
    ))
  );
  
  return { responses, errors: networkErrors };
}

function addToSpreadsheet(matrix, sheetName, clear = false, ss = SpreadsheetApp.getActiveSpreadsheet()) {
  
  const sheet = ss.getSheetByName(sheetName) || ss.insertSheet(sheetName);
  
  /* clears all data */
  if (clear) sheet.getDataRange().clear();
  
  const range = sheet.getRange(1, 1, matrix.length, matrix[0].length);
  range.setValues(matrix);
  
  SpreadsheetApp.flush();
}

function initialize() {
  fetchContactsAndAddToSpreadsheet()
}

function onOpen(_e) {
  
  SpreadsheetApp.getUi()
    .createMenu('Funções especiais')
    .addItem('Atualizar Contatos', 'fetchContactsAndAddToSpreadsheet')
    .addItem('Baixar assinaturas do Clicksign', 'fetchSignersAndAddToSpreadsheet')
    .addItem("Enviar Emails", "sendMail")
    .addToUi();
  
  initialize();

}
