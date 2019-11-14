import HelpOrder from '../models/HelpOrder';
import Student from '../models/Student';
import Queue from '../../lib/Queue';
import CancellationMail from '../jobs/CancellationMail';

class AnswerController {
  async store(req, res) {
    const { helpOrderId } = req.params;
    const { answer } = req.body;
    const helpOrder = await HelpOrder.findByPk(helpOrderId);
    if (!helpOrder) {
      return res.status(400).json({ error: 'Help order does not exist' });
    }

    const updatedHelpOrder = await helpOrder.update({
      answer,
      answer_at: new Date(),
    });

    const { name, email } = await Student.findByPk(updatedHelpOrder.student_id);

    Queue.doJob(CancellationMail.key, {
      name,
      email,
      answer,
      question: helpOrder.question,
    });
    return res.json(updatedHelpOrder);
  }

  async index(req, res) {
    const helpOrders = await HelpOrder.findAll({ where: { answer: null } });
    return res.json(helpOrders);
  }
}

export default new AnswerController();
