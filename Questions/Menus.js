function onOpen(_e) {
  
  SpreadsheetApp.getUi()
    .createMenu('Funções Especiais')
    .addItem('Atualizar aulas', 'updateSpreadsheetFromSimSave')
    .addItem('Gerar documento', 'generateDocumentFromSpreadsheet')
    .addItem('Postar Questões', 'postQuestionsToSimSaveFromSpreadsheet')
    .addToUi();

}

function initialize() {
  fetchContactsAndAddToSpreadsheet()
}
