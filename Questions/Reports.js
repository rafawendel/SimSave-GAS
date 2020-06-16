function formatQuestions(questionsObjArr) {
  return questionsObjArr.map((questionObj, i) => {
    const alternatives = ['A', 'B', 'C', 'D', 'E'];

    const subItems = alternatives
      .reduce(
        (tot, alt) => [
          ...tot,
          { statement: removeHTMLTags(questionObj[alt]), correct: questionObj['Resp.'] === alt }
        ],
        []
      )
      .sort((_a, _b) => 0.5 - Math.random());

    return {
      questionCase: removeHTMLTags(questionObj.Caso),
      statement: removeHTMLTags(questionObj['Questão']),
      imageUrl: questionObj.Imagem,
      imageAlt: questionObj['Descrição'],
      subItems,
      answer: `RESPOSTA: ${
        alternatives[subItems.reduce((tot, item, i) => (item.correct ? i : tot), 0)]
      }`
    };
  });
}

function appendQuestions(questionsObjList, documentBody, nestingLevel = 0) {
  const [firstQuestion] = questionsObjList;

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
    }

    if (question.subItems && question.subItems.length > 0)
      appendQuestions(question.subItems, documentBody, nestingLevel + 1);
    if (question.answer)
      documentBody.appendParagraph(question.answer).setAttributes({
        [DocumentApp.Attribute.HORIZONTAL_ALIGNMENT]: DocumentApp.HorizontalAlignment.CENTER
      });
  });
}

function createDocument(title) {
  const targetFile = DriveApp.getFileById(Config.TEMPLATE_ID).makeCopy(`Questões de ${title}`);
  const document = DocumentApp.openById(targetFile.getId());
  const body = document.getBody();

  const header = body.insertParagraph(0, `${title}\n`);
  header.setHeading(DocumentApp.ParagraphHeading.HEADING1);
  header.setAttributes({
    [DocumentApp.Attribute.HORIZONTAL_ALIGNMENT]: DocumentApp.HorizontalAlignment.CENTER
  });

  return { documentUrl: targetFile.getUrl(), documentBody: body, document };
}

function generateDocumentFromSpreadsheet() {
  const filteredQuestionsObjArr = clearEmptyFields(parseSpreadsheetAsObject([1, 1, 20]), 'Questão');
  //  const filteredReferenceObjArr = clearEmptyFields(parseSpreadsheetAsObject([20, 1, 3]), 'IDs');
  const formattedQuestions = formatQuestions(filteredQuestionsObjArr);

  const sheetName = SpreadsheetApp.getActiveSheet().getName();
  const { documentUrl, documentBody, document } = createDocument(sheetName);
  appendQuestions(formattedQuestions, documentBody);
  document.saveAndClose();

  console.log(documentUrl);
  SpreadsheetApp.getUi().alert(documentUrl).OK;
}
