/* global QuestionsAPI */

function onOpen(_e) {
  SpreadsheetApp.getUi()
    .createMenu('SimSave')
    .addItem('Atualizar aulas', 'QuestionsAPI.updateSpreadsheetFromSimSave')
    .addItem('Gerar documento', 'QuestionsAPI.generateDocumentFromSpreadsheet')
    .addItem('Postar Questões', 'QuestionsAPI.postQuestionsToSimSaveFromSpreadsheet')
    .addToUi();
}
