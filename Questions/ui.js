/* global QuestionsAPI */

const generateDoc = () => QuestionsAPI.generateDocumentFromSpreadsheet();
const post = () => QuestionsAPI.postQuestionsToSimSaveFromSpreadsheet();

function onOpen(_e) {
  SpreadsheetApp.getUi()
    .createMenu('SimSave')
    .addItem('Gerar documento', 'generateDoc')
    .addItem('Postar Questões', 'post')
    .addToUi();
}
