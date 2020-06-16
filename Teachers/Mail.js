function sendMail(mailObj, replyToLabel, sheetName = 'Controle') {
  const test = false;
  let errors = [];
  const html = HtmlService.createTemplateFromFile('mail.html').evaluate().getContent().toString();
  
  const ss = SpreadsheetApp.getActiveSpreadsheet().getSheets().find(sheet => sheet.getName().includes(sheetName));
  const range = ss.getRange(2, 1, ss.getDataRange().getLastRow(), 4); // Nome	Email	Sent?	Contrato
  const sheetValues = range.getValues();
  
  const verified = sheetValues.map(value => {
    if (!value[1]) return [false];
    if (value[3]) return [value[3]];
    
    const email = test ? 'rafawendel2010@gmail.com' : value[1];
    const personObj = {
      name: value[0].split(' ')[0],
      link: value[2]
    };
    
      
    const thisMailObj = Object.keys(mailObj)
      .reduce((replaced, currKey) => ({ ...replaced, [currKey]: fieldReplacer(personObj, mailObj[currKey]) }), {});
    
    const thisBody = removeHTMLTags(
      `${thisMailObj.intro}\n\n${thisMailObj.body}\n\n${thisMailObj.request}\n\n${thisMailObj.strong}\n\n${thisMailObj.details}\n\nLink: ${thisMailObj.btnLink}`);
    const thisHtml = fieldReplacer(thisMailObj, html);
    
    try { 
      GmailApp.sendEmail(email, thisMailObj.subject, thisBody, {
        name: "Rafael, da SimSave",
        htmlBody: thisHtml,
        replyTo: `suporte${replyToLabel ? '+' + replyToLabel : ''}@simsave.com.br`
      });
      return [true];
      
    } catch(_err) {
      try { 
        MailApp.sendEmail(email, thisMailObj.subject, thisBody, {
        name: "Rafael, da SimSave",
        htmlBody: thisHtml,
        replyTo: `suporte${replyToLabel ? '+' + replyToLabel : ''}@simsave.com.br`
      });
        return [true];
        
      } catch(error) {
        console.log(error);
        errors.push(error);
        return [false]; 
      } 
    }
  });
  
  if (!test) ss.getRange(2, 4, verified.length, 1).setValues(verified);
  SpreadsheetApp.getUi().alert(errors[0] ? errors : 'E-mails enviados com sucesso').OK;
}

function fieldReplacer(fieldObject, body) {
  return Object.keys(fieldObject).reduce((replacedBody, key) => (
    replacedBody.replace(new RegExp(`{{${key}}}`, 'g'), fieldObject[key])
  ), body);
}
