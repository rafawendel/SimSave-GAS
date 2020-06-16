function interpretData(classList, durationList, contentList, journeysList) {
  
  let indexedDurationObject = {};
  durationList.forEach(durationObj => {
    indexedDurationObject[durationObj.id] = durationObj['Tempo Total (minutos)'];
  });
  
  let indexedPlaylistsObject = {};
  contentList.forEach(classObj => {
    indexedPlaylistsObject[classObj.id] = classObj.playlists.reduce((acc, cur) => `${acc}${cur.name},`, '');
  });
  
  let indexedJourneysObject = {};
  journeysList.forEach(journeyObj => {
    const currentJourney = journeyObj['name'];
    journeyObj['titles'].forEach(journeyItem => {
      journeyItem['steps'].forEach(journeyStep => {
        if (journeyStep['type'] !== 'content') return;
        indexedJourneysObject[journeyStep['content_id']] = currentJourney;
      });
    });
  });
  
  return classList
    .filter(classObj => classObj.Medicina === 'Sim')
    .map(classObj => {
      
      classObj['Duração'] = indexedDurationObject[classObj['ID']] || '';
      classObj['Playlists'] = indexedPlaylistsObject[classObj['ID']] || '';
      classObj['Journeys'] = indexedJourneysObject[classObj['ID']] || '';
      
      return Object.keys(classObj)
        .filter(key => key !== 'Pir\u00e2mide' && key !== 'Medicina' && key !== 'Enfermagem' && key !== 'T\u00e9c. Enfermagem')
        .map(key => [classObj[key]]);
  });
  
}

async function updateSpreadsheetFromSimSave() {
  
  const { data: responseMain } = await SimSave.get('report/content_infos');
  const { data: responseDuration } = await SimSave.get('report/contents_videos_duration');
  const { data: responseContent } = await SimSave.get('content');
  const { responses: responseJourneys } = await SimSave.getAll('journey', false);
  const header = [['ID', 'Título', 'Tópicos', 'Publico Alvo', 'Palavras Chave', 'Professor', 'Tipo', 'Status', 'Publicado', 'Duração', 'Playlist', 'Jornada']];
  const interpretedData = interpretData(responseMain, responseDuration, responseContent, responseJourneys);
  
  addToSpreadsheetSp(header, interpretedData);
  
}

function addToSpreadsheetSp( header, data) {
  
  var ss = SpreadsheetApp.getActiveSpreadsheet().getSheetByName('reference') || SpreadsheetApp.getActiveSpreadsheet().insertSheet('reference');
  ss.getRange(1, 1, ss.getDataRange().getLastRow(), ss.getDataRange().getLastColumn()).clear();
  
  var headRange = ss.getRange(1, 1, 1, header[0].length);
  var dataRange = ss.getRange(2, 1, data.length, data[0].length);
  
  headRange.setValues(header);
  
  if (header[0].length !== data[0].length) { SpreadsheetApp.getUi().alert('Erro: Verificar número de variáveis!'); }
  
  dataRange.setValues(data);
  SpreadsheetApp.flush();
}
