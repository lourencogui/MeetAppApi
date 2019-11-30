import { format, parseISO } from 'date-fns';
import Mail from '../../lib/Mail';

class RegistrationMail {
  get key() {
    return 'RegistrationMail';
  }

  async handle({ data }) {
    const { endDate, email, name, total, plan } = data;
    const formattedDate = format(parseISO(endDate), 'dd/MM/yyyy');
    await Mail.sendEmail({
      to: email,
      subject: 'Inscrição Gympoint',
      template: 'registration',
      context: {
        endDate: formattedDate,
        total: total.toLocaleString('pt-BR'),
        student: name,
        plan,
      },
    });
  }
}

export default new RegistrationMail();
