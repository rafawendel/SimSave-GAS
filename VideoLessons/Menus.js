function onOpen(_e) {
  
  SpreadsheetApp.getUi().createMenu('SimSave').addItem('Atualizar Dados', 'updateSpreadsheetFromSimSave').addToUi();
  
  initialize();

}
