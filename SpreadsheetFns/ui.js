/**
 * @OnlyCurrentDoc
 */

function onOpen(_e) {
  SpreadsheetApp.getUi()
    .createAddonMenu()
    .addItem('')
    .addToUi();
}

function onInstall(e) {
  onOpen(e);
}
