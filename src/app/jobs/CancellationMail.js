import Mail from '../../lib/Mail';

class CancellationMail {
  get key() {
    return 'cancelationMail';
  }

  async handle({ data }) {
    const { name, email, question, answer } = data;

    await Mail.sendEmail({
      to: `${name} <${email}>`,
      subject: 'Resposta a sua pergunta',
      template: 'answer',
      context: {
        question,
        answer,
        name,
      },
    });
  }
}

export default new CancellationMail();
