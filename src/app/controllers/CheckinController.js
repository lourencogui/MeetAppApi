import { subDays } from 'date-fns';
import { Op } from 'sequelize';
import Student from '../models/Student';
import Checkin from '../models/Checkin';

class CheckinController {
  async store(req, res) {
    const { studentId } = req.params;

    const checkStudentExists = await Student.findByPk(studentId);

    if (!checkStudentExists) {
      return res.status(400).json({ error: 'Student does not exist' });
    }

    const checkins = await Checkin.findAll({
      where: {
        created_at: {
          [Op.between]: [subDays(new Date(), 6), new Date()],
        },
        student_id: studentId,
      },
    });

    if (checkins.length > 4) {
      return res
        .status(400)
        .json({ error: 'This user exceeded checkin limit on this week' });
    }

    const checkin = await Checkin.create({
      student_id: studentId,
    });

    return res.json(checkin);
  }

  async index(req, res) {
    const { studentId: student_id } = req.params;

    const checkStudentExists = await Student.findByPk(student_id);

    if (!checkStudentExists) {
      return res.status(400).json({ error: 'Student does not exist' });
    }

    const checkins = await Checkin.findAll(
      { where: { student_id } },
      {
        attributes: { exclude: ['id'] },
      }
    );
    return res.json(checkins);
  }
}

export default new CheckinController();
