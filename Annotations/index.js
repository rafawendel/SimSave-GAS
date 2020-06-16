function getAnnotations(presentation) {
  const slides = presentation.getSlides();
  return slides.map(
    slide =>
      slide
        .getNotesPage()
        .getSpeakerNotesShape()
        .getText()
        .asString()
    //.replace(/\n/g, '')
  );
}

function appendAnnotationsToDoc(annotationsList, documentBody) {
  let documentErrors = [];
  try {
    for (let i = 0; i < annotationsList.length; i++) {
      const annotation = annotationsList[i];
      if (i > 0) documentBody.appendHorizontalRule();
      if (annotation.includes('SLIDE FINAL')) {
        documentBody.appendParagraph(annotation);
        break;
      }
      documentBody.appendParagraph(`SLIDE ${i + 1} - ${annotation}\n`);
    }
  } catch (err) {
    documentErrors.push(err);
  }

  return documentErrors;
}

function createDocument(title, trashOldCopies = true) {
  const TEMPLATE_ID = '1Ln0N1GFDjbyIIZZRqgmKDD8My0xHuthNvevyQjxI_LI';
  const FOLDER_ID = '1BJQPeg0YR57snhwGpRjIQ6NOYUqFqkI3';
  const fileName = `TP - ${title}`;
  const folder = DriveApp.getFolderById(FOLDER_ID);

  if (trashOldCopies) {
    const oldFiles = folder.getFilesByName(fileName);
    while (oldFiles.hasNext()) {
      oldFiles.next().setTrashed(true);
    }
  }

  const targetFile = DriveApp.getFileById(TEMPLATE_ID).makeCopy(fileName, folder);
  const document = DocumentApp.openById(targetFile.getId());
  const body = document.getBody();

  const header = body.insertParagraph(0, `${title}\n`);
  header.setHeading(DocumentApp.ParagraphHeading.HEADING1);
  header.setAttributes({
    [DocumentApp.Attribute.HORIZONTAL_ALIGNMENT]: DocumentApp.HorizontalAlignment.CENTER
  });

  return { documentUrl: targetFile.getUrl(), documentBody: body, document };
}

function createDocFromAnnotations() {
  const presentation = SlidesApp.getActivePresentation();
  const annotationsList = getAnnotations(presentation);

  const { documentUrl, documentBody, document } = createDocument(presentation.getName());

  const errors = appendAnnotationsToDoc(annotationsList, documentBody);

  document.saveAndClose();

  console.log(documentUrl);
  SlidesApp.getUi().alert(
    `${documentUrl}\n${errors.length > 0 ? 'Erros:\n' + errors.map(e => e.message + '\n') : ''}`
  ).OK;
}

function addMenu() {
  SlidesApp.getUi()
    .createMenu('Documento')
    .addItem('Criar TP com as anotações', 'createDocFromAnnotations')
    .addToUi();
}

function onOpen(_e) {
  addMenu();
}
