function createQuestionsObj(questionsObjArr, onSystem, reviewed) {
  const questionsObjList = questionsObjArr
    .filter(obj => (
      (onSystem === OnSystem.ONLY ? obj['Sys?'] :
      onSystem === OnSystem.EXCEPT ? !obj['Sys?'] :
      true)
      &&
      (reviewed === Reviewed.ONLY ? !obj['Revisada?'] :
      reviewed === Reviewed.EXCEPT ? obj['Revisada?'] :
      true)
    ))
    .map(obj => {
      const lessons = parseContentListAsObject(obj['Aulas'], 'none')
      const rightMarks = parseContentListAsObject(obj['Sug (+)'], 'correct');
      const wrongMarks = parseContentListAsObject(obj['Sug (-)'], 'wrong');
      const contents = { ...rightMarks, ...wrongMarks, ...lessons };
      if (Object.keys(contents).findIndex(isNaN) >= 0) throw 'Entrada inválida.\nVer sugestões de aulas.';
      
      const question_alternatives = ['A', 'B', 'C', 'D', 'E']
        .reduce((tot, alt) => ([...tot, { text: paragraphize(obj[alt]), correct: obj['Resp.'] === alt }]), [])
      
      const image = `<img src="${obj['Imagem']}" alt="${obj['Descrição']}"/>`;
      
      let questionObj = {
        question: `${obj['Caso'] ? paragraphize(obj['Caso']) : ''}${paragraphize(obj['Questão'])}${obj['Imagem'] ? image : ''}`,
        question_alternatives,
        comment: obj['Correção'] !== '' ? paragraphize(obj['Correção']) : '',
        keywords: obj['Tags'],
        contents,
      };
      
      if (obj['ID']) questionObj.id = +obj['ID'];
      
      return questionObj;
  });
  
  return questionsObjList;
}

function separateNewAndEditedQuestions(questionsObjArr, reviewed = Reviewed.EXCEPT) {
  const newQuestionsObjList = createQuestionsObj(questionsObjArr, OnSystem.EXCEPT, reviewed);
  const editedQuestionsObjList = createQuestionsObj(questionsObjArr, OnSystem.ONLY, reviewed);
  
  return { newQuestionsObjList, editedQuestionsObjList };
}

function injectIntoArr(oldDataArr, newDataArr, updateValues = false) {
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

function editColumnByHeaderName(headerName, newData, reviewed = Reviewed.EXCEPT) {
  let [colIndex, colData] = getColumnByHeaderName(headerName);
  
  if (reviewed !== Reviewed.IGNORE) {
    const [, reviewedCol] = getColumnByHeaderName('Revisada?');
    colData = reviewedCol.map((review, i) => (
      reviewed === Reviewed.EXCEPT ? (review ? colData[i] : null) :
      reviewed === Reviewed.ONLY ? (!review ? colData[i] : null) :
      colData[i]
    ));
  }
  
  saveColumnToSpreadsheet(colIndex, injectIntoArr(colData, newData));
}

async function postQuestionsToSimSaveFromSpreadsheet() {
  const questionsObjArr = parseSpreadsheetAsObject([1, 1, 20]);
  const filteredQuestionsObjArr = clearEmptyFields(questionsObjArr, 'Questão');

  try {
    const { newQuestionsObjList, editedQuestionsObjList } = separateNewAndEditedQuestions(filteredQuestionsObjArr);
    const { responses: postResponses, errors: postErrors } = await SimSave.post('question', newQuestionsObjList);
    const { responses: editResponses, errors: editErrors } = await SimSave.edit('question', editedQuestionsObjList);
    console.log(await SimSave.edit('question', editedQuestionsObjList))

    const idList = postResponses.map(item => item.id || null);    
    const successfulPostList = postResponses.map(item => !!item);
    
    editColumnByHeaderName('ID', idList);
    editColumnByHeaderName('Sys?', successfulPostList);
    
    if (postErrors.length > 0 && postErrors[0] !== 'Empty data') throw new Error(`Postagem: ${JSON.stringify(postErrors)}`);
    if (editErrors.length > 0 && editErrors[0] !== 'Empty data') throw new Error(`Edição: ${JSON.stringify(postErrors)}`);
    
    SpreadsheetApp.getUi().alert('Perguntas postadas com sucesso');
  } catch(err) {
    console.log(err);
    SpreadsheetApp.getUi().alert(`Erros:\n${JSON.stringify(err.error ? (err.error.message || err.error) : (err.message || err))}`);
  }
}

function clearAllQuestions() {
  SimSave.deleteAllEntries('question');
}

function clearQuestionsWithIdBetween() {
  const range = [...Array(2).keys()].map(i => i + 398);
  SimSave.deleteBetween('question', range);
}
