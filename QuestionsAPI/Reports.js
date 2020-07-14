/* global removeHTMLTags_ clearEmptyFields_ parseSpreadsheetAsObject_ */
/// <reference path="./utils.js" />

function formatQuestions_(questionsObjArr) {
  return questionsObjArr.map(questionObj => {
    const alternatives = ['A', 'B', 'C', 'D', 'E'];

    const subItems = alternatives
      .reduce(
        (tot, alt) => [
          ...tot,
          { statement: removeHTMLTags_(questionObj[alt]), correct: questionObj['Resp.'] === alt }
        ],
        []
      )
      .sort((_a, _b) => 0.5 - Math.random());

    return {
      questionCase: removeHTMLTags_(questionObj['Caso']),
      statement: removeHTMLTags_(questionObj['Questão']),
      imageUrl: questionObj['Imagem'],
      imageAlt: questionObj['Descrição'],
      subItems,
      answer: `RESPOSTA: ${
        alternatives[subItems.reduce((tot, item, i) => (item.correct ? i : tot), 0)]
      }`
    };
  });
}

function appendQuestions_(questionsObjList, documentBody, nestingLevel = 0) {
  const [firstQuestion] = questionsObjList;

  let errors = [];

  let lastCase = '';
  let firstItem;
  questionsObjList.forEach((question, i) => {
    if (lastCase !== question.questionCase) {
      lastCase = question.questionCase;
      documentBody.appendParagraph(question.questionCase);
    }

    if (i === 0) {
      firstItem = documentBody.appendListItem(firstQuestion.statement);
      firstItem.setNestingLevel(nestingLevel);
    } else {
      if (nestingLevel === 0) documentBody.appendHorizontalRule();
      const li = documentBody.appendListItem(question.statement);
      li.setListId(firstItem);
      li.setNestingLevel(nestingLevel);
    }

    if (question.imageUrl) {
      try {
        const thisImage = documentBody.appendImage(UrlFetchApp.fetch(question.imageUrl));
        const ratio = thisImage.getHeight() / thisImage.getWidth();
        thisImage
          .setWidth(documentBody.getPageWidth() * 0.7)
          .setHeight(thisImage.getWidth() * ratio)
          .setAltDescription(question.imageAlt)
          .getParent()
          .setAttributes({
            [DocumentApp.Attribute.HORIZONTAL_ALIGNMENT]: DocumentApp.HorizontalAlignment.CENTER
          });
      } catch (err) {
        console.error(err);
        errors.push(err);
      }
    }

    if (question.subItems && question.subItems.length > 0)
      appendQuestions_(question.subItems, documentBody, nestingLevel + 1);
    if (question.answer)
      documentBody.appendParagraph(question.answer).setAttributes({
        [DocumentApp.Attribute.HORIZONTAL_ALIGNMENT]: DocumentApp.HorizontalAlignment.CENTER
      });
  });

  return errors;
}

function createDocument_(title, trashOldCopies = true) {
  const TEMPLATE_ID = PropertiesService.getScriptProperties().getProperty('TEMPLATE_ID');
  const fileName = `Questões de ${title}`;

  if (trashOldCopies) {
    const oldFiles = DriveApp.getFilesByName(fileName);
    while (oldFiles.hasNext()) {
      oldFiles.next().setTrashed(true);
    }
  }

  const targetFile = DriveApp.getFileById(TEMPLATE_ID).makeCopy(fileName);
  const document = DocumentApp.openById(targetFile.getId());
  const body = document.getBody();

  const header = body.insertParagraph(0, `${title}\n`);
  header.setHeading(DocumentApp.ParagraphHeading.HEADING1);
  header.setAttributes({
    [DocumentApp.Attribute.HORIZONTAL_ALIGNMENT]: DocumentApp.HorizontalAlignment.CENTER
  });

  return { documentUrl: targetFile.getUrl(), documentBody: body, document };
}

/**
 * Generates a document from the active spreadsheet
 */
function generateDocumentFromSpreadsheet() {
  const filteredQuestionsObjArr = clearEmptyFields_(
    parseSpreadsheetAsObject_([1, 1, 20]),
    'Questão'
  );
  //  const filteredReferenceObjArr = clearEmptyFields_(parseSpreadsheetAsObject([20, 1, 3]), 'IDs');
  const formattedQuestions = formatQuestions_(filteredQuestionsObjArr);

  const sheetName = SpreadsheetApp.getActiveSheet().getName();
  const { documentUrl, documentBody, document } = createDocument_(sheetName);
  const errors = appendQuestions_(formattedQuestions, documentBody);
  document.saveAndClose();

  console.log(documentUrl);
  SpreadsheetApp.getUi().alert(
    `${documentUrl}\n${
      errors.length > 0 ? 'Erros:\n' + errors.map(e => e.message || e + '\n') : ''
    }`
  );
}
