/* global Config SimSave separateNewAndEditedQuestions_ parseSpreadsheetAsObject_ clearEmptyFields_ editColumnByHeaderName_*/
/// <reference path="./utils.js" />
/// <reference path="./dependencies.js" />
/// <reference path="./enums.js" />
/// <reference path="../SimSave/SimSave.js" />

/**
 * Gets the questions from the active spreadsheet and loads them to SimSave Admin
 */
async function postQuestionsToSimSaveFromSpreadsheet() {
  const questionsObjArr = parseSpreadsheetAsObject_([1, 1, 20]);
  const filteredQuestionsObjArr = clearEmptyFields_(questionsObjArr, 'Questão');

  try {
    const { newQuestionsObjList, editedQuestionsObjList } = separateNewAndEditedQuestions_(
      filteredQuestionsObjArr
    );
    const { responses: postResponses, errors: postErrors } = await SimSave.post(
      'question',
      newQuestionsObjList
    );
    const { errors: editErrors } = await SimSave.edit('question', editedQuestionsObjList);

    const idList = postResponses.map(item => item.id || null);
    const successfulPostList = postResponses.map(item => !!item);

    editColumnByHeaderName_('ID', idList);
    editColumnByHeaderName_('Sys?', successfulPostList);

    if (postErrors.length > 0 && postErrors[0] !== 'Empty data')
      throw new Error(`Postagem: ${JSON.stringify(postErrors)}`);
    if (editErrors.length > 0 && editErrors[0] !== 'Empty data')
      throw new Error(`Edição: ${JSON.stringify(postErrors)}`);

    SpreadsheetApp.getUi().alert('Perguntas postadas com sucesso');
  } catch (err) {
    console.log(err);
    SpreadsheetApp.getUi().alert(
      `Erros:\n${JSON.stringify(err.error ? err.error.message || err.error : err.message || err)}`
    );
  }
}

function clearAllQuestions_() {
  SimSave.deleteAllEntries('question');
}

/**
 * Clears all questions with ids in between the beginning and the beginning + length
 *
 * @param {number} start - The index from which to begin'
 * @param {number} length - The number of ids until to delete from the start
 */
function clearQuestionsWithIdBetween(start, length) {
  const range = [...Array(length).keys()].map(i => i + start);
  SimSave.deleteBetween('question', range);
}
