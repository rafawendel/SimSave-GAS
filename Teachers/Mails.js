function sendContractMail() {
  const replyToLabel = 'contracts';
  sendMail({
    subject: '{{name}}, seu contrato com a SimSave',
    preview: '',
    intro: 'Olá {{name}}. Tudo bem?',
    title: 'Seu contrato com a SimSave',
    body: `Aqui é o Rafael, da SimSave. Estou passando para te fazer um pedido muito simples... o preenchimento de um formulário.`,
    request: 'Precisamos da sua assinatura do termo de imagem',
    strong: '',
    pic: '<img alt="" src="https://gallery.mailchimp.com/161bfedc9aec8979510162a9e/images/7f58f731-8d0b-495a-b7a2-ea97a90c49b1.png" style="max-width:450px;" class="mcnImage">',
    details: `...Eu sei, formulários podem ser entediantes. Mas prometo que esse não leva mais de 3 minutos. Se eu puder ajudar com algo, basta <a href="mailto:suporte${replyToLabel ? '+' + replyToLabel : ''}@simsave.com.br">responder este e-mail</a>`,
    button: `
      <td class="mcnButtonContent" style="font-family: Arial; font-size: 16px; padding: 15px;" valign="middle" align="center">
      <a class="mcnButton " title="Form" href="{{link}}" target="_blank" style="font-weight: bold;letter-spacing: normal;line-height: 100%;text-align: center;text-decoration: none;color: #FFFFFF;"
      >FORMULÁRIO DO TERMO</a></td>`,
    year: (new Date()).getFullYear().toString()
  }, replyToLabel, 'Controle')
}

function sendProfileMail() {
  const replyToLabel = 'bio';
  sendMail({
    subject: '{{name}}, seu perfil na SimSave',
    preview: '{{name}}, você pode nos escrever uma minibio para o seu perfil na SimSave?',
    title: 'Seu perfil na SimSave',
    intro: `<span style="text-align: center;">Olá {{name}}. Tudo bem?</span>
      <br/><span style="color:#000000">Aqui é o Rafael, da SimSave.</span>
      <br/><span style="color:#000000">Já sei que você está engajado com a nossa plataforma, por isso vim fazer um pedido muito relevante para a sua imagem!</span>`,
    request: 'Você pode nos escrever uma minibio?',
    body: `Estou passando para lembrar da <strong style="font-size:120%;">sua minibio</strong> na SimSave. Você precisa de ajuda? É só responder <a href="mailto:suporte${replyToLabel ? '+' + replyToLabel : ''}@simsave.com.br">este e-mail.</a>
      <br/>...Eu sei, você quer ver como alguém fez! Sem problema, só olhar este <a href="https://simsave.com.br/profile/99">exemplo</a>, da Susana.
      <br/>Quando achar que está pronto, ou se eu puder ajudar com isso, basta <a href="mailto:suporte${replyToLabel ? '+' + replyToLabel : ''}@simsave.com.br">responder este e-mail</a>`,
    strong: '',
    pic: '',
    details: 'O texto deve conter entre 300 e 1000 caracteres.',
    button: `
      <td class="mcnButtonContent" style="font-family: Arial; font-size: 16px; padding: 15px;" valign="middle" align="center">
      <a class="mcnButton " title="Profile" href="{{link}}" target="_blank" style="font-weight: bold;letter-spacing: normal;line-height: 100%;text-align: center;text-decoration: none;color: #FFFFFF;"
      >Editar meu Perfil na SimSave</a></td>`,
    year: (new Date()).getFullYear().toString()
  }, replyToLabel, 'Controle')
}
