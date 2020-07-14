function mock() {
  post('question', [
    {
      question:
        '<p>A doença inflamatória pélvica (DIP) é um processo infeccioso que acomete o útero e estruturas anexas. Quais das seguintes assertivas está <strong>incorreta</strong>?</p>',
      question_alternatives: [],
      comment: '<p>Apenas cerca de 15% dos casos estão associados à manipulação.</p>',
      keywords: '',
      contents: {}
    }
  ]).then(console.log);
}
