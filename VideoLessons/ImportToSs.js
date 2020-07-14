/* global SimSave toHHMMSS addToSpreadsheet arraySplitter */
/// <reference path="./utils.js">
function interpretData(contentList, reference) {
  return contentList.map(content =>
    reference.map(ref => {
      const [prop, cb] = ref;
      const val = cb ? cb(content[prop]) : content[prop];
      return Array.isArray(val) ? val.join(', ') : val;
    })
  );
}

async function updateSpreadsheetFromSimSave() {
  const { data } = await SimSave.get('content');

  const propMapper = property => list => list.map(item => item[property]);
  const mapNames = propMapper('name');

  /**
   * [displayName, propertyName, callback?]
   */
  const reference = [
    ['ID', 'id'],
    ['Padronizada?', 'short_description', sd => !!sd],
    ['Título', 'title'],
    ['Professor', 'instructor', i => i['name']],
    ['Tópicos', 'topics', mapNames],
    ['Publico Alvo', 'target_audiences', mapNames],
    ['Palavras Chave', 'keywords'],
    ['Jornadas', 'journeys', mapNames],
    ['Produtos', 'products', mapNames],
    ['Tipo', 'type'],
    ['Descrição', 'short_description'],
    ['Publicado?', 'published', p => !!p],
    ['Status', 'status'],
    ['Duração', 'total_time', toHHMMSS],
    ['Vídeos?', 'videos', vs => vs.reduce((ac, c) => ac || !!c['uri'], false)],
    ['Anexos', 'files', propMapper('url')],
    [
      'Link',
      'user_view',
      uv =>
        uv &&
        `https://admin.simsave.com.br/minhas_aulas/${uv['content_id']}/video/${uv['content_video_id']}`
    ]
  ];
  const [header, headlessRef] = arraySplitter(reference);
  const interpretedData = interpretData(data, headlessRef);

  addToSpreadsheet([header], interpretedData);
}
