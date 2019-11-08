import Student from '../models/Student';
import HelpOrder from '../models/HelpOrder';

class HelpOrderController {
  async store(req, res) {
    const { studentId } = req.params;
    const { question } = req.body;

    const checkStudentExist = await Student.findByPk(studentId);
    if (!checkStudentExist) {
      return res.status(400).json({ error: 'Student does not exist' });
    }

    const helpOrder = await HelpOrder.create({
      student_id: studentId,
      question,
    });
    return res.json(helpOrder);
  }

  async index(req, res) {
    const { studentId } = req.params;

    const checkStudentExist = await Student.findByPk(studentId);
    if (!checkStudentExist) {
      return res.status(400).json({ error: 'Student does not exist' });
    }

    const helpOrders = await HelpOrder.findAll({
      where: { student_id: studentId },
    });

    return res.json(helpOrders);
  }
}

export default new HelpOrderController();
