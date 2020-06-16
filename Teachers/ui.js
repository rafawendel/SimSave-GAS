function onOpen(_e) {
  SpreadsheetApp.getUi()
    .createMenu('SimSave')
    .addItem('Enviar E-mails Contratos', 'sendContractMail')
    .addItem('Enviar E-mails Minibio', 'sendProfileMail')
    .addItem('Atualizar Contatos', 'fetchContactsAndAddToSpreadsheet')
    .addItem('Atualizar Clicksign', 'fetchSignersAndAddToSpreadsheet')
    .addToUi()
}
