function onOpen(_e) {
  
  SpreadsheetApp.getUi()
    .createMenu('SimSave')
    .addItem('Atualizar aulas', 'updateSpreadsheetFromSimSave')
    .addItem('Gerar documento', 'generateDocumentFromSpreadsheet')
    .addItem('Postar Questões', 'postQuestionsToSimSaveFromSpreadsheet')
    .addToUi();

}

function initialize() {
  fetchContactsAndAddToSpreadsheet()
}
