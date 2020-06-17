/* global OnSystem Reviewed parseContentListAsObject_ paragraphize_ getColumnByHeaderName_ saveColumnToSpreadsheet_ */
function createQuestionsObj_(questionsObjArr, onSystem, reviewed) {
  const questionsObjList = questionsObjArr
    .filter(
      obj =>
        (onSystem === OnSystem.ONLY
          ? obj['Sys?']
          : onSystem === OnSystem.EXCEPT
          ? !obj['Sys?']
          : true) &&
        (reviewed === Reviewed.ONLY
          ? !obj['Revisada?']
          : reviewed === Reviewed.EXCEPT
          ? obj['Revisada?']
          : true)
    )
    .map(obj => {
      const lessons = parseContentListAsObject_(obj['Aulas'], 'none');
      const rightMarks = parseContentListAsObject_(obj['Sug (+)'], 'correct');
      const wrongMarks = parseContentListAsObject_(obj['Sug (-)'], 'wrong');
      const contents = { ...rightMarks, ...wrongMarks, ...lessons };
      if (Object.keys(contents).findIndex(isNaN) >= 0)
        throw 'Entrada inválida.\nVer sugestões de aulas.';

      const question_alternatives = ['A', 'B', 'C', 'D', 'E'].reduce(
        (tot, alt) => [...tot, { text: paragraphize_(obj[alt]), correct: obj['Resp.'] === alt }],
        []
      );

      const image = `<img src="${obj['Imagem']}" alt="${obj['Descrição']}"/>`;

      let questionObj = {
        question: `${obj['Caso'] ? paragraphize_(obj['Caso']) : ''}${paragraphize_(
          obj['Questão']
        )}${obj['Imagem'] ? image : ''}`,
        question_alternatives,
        comment: obj['Correção'] !== '' ? paragraphize_(obj['Correção']) : '',
        keywords: obj['Tags'],
        contents
      };

      if (obj['ID']) questionObj.id = +obj['ID'];

      return questionObj;
    });

  return questionsObjList;
}

function separateNewAndEditedQuestions_(questionsObjArr, reviewed = Reviewed.EXCEPT) {
  const newQuestionsObjList = createQuestionsObj_(questionsObjArr, OnSystem.EXCEPT, reviewed);
  const editedQuestionsObjList = createQuestionsObj_(questionsObjArr, OnSystem.ONLY, reviewed);

  return { newQuestionsObjList, editedQuestionsObjList };
}

function injectIntoArr_(oldDataArr, newDataArr, updateValues = false) {
  let i = 0;
  return oldDataArr.map(datum => {
    if (datum === null) return null;

    if (!datum) {
      i++;
      return newDataArr[i - 1] || null;
    }

    if (updateValues) {
      i++;
      return newDataArr[i - 1] || datum;
    }

    return datum;
  });
}

function editColumnByHeaderName_(headerName, newData, reviewed = Reviewed.EXCEPT) {
  let [colIndex, colData] = getColumnByHeaderName_(headerName);

  if (reviewed !== Reviewed.IGNORE) {
    const [, reviewedCol] = getColumnByHeaderName_('Revisada?');
    colData = reviewedCol.map((review, i) =>
      reviewed === Reviewed.EXCEPT
        ? review
          ? colData[i]
          : null
        : reviewed === Reviewed.ONLY
        ? !review
          ? colData[i]
          : null
        : colData[i]
    );
  }

  saveColumnToSpreadsheet_(colIndex, injectIntoArr_(colData, newData));
}
