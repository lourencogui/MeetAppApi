import * as Yup from 'yup';
import { Op } from 'sequelize';
import Student from '../models/Student';

class StudentController {
  async store(req, res) {
    const schema = Yup.object().shape({
      name: Yup.string().required(),
      email: Yup.string()
        .email()
        .required(),
      age: Yup.number()
        .positive()
        .integer()
        .required(),
      height: Yup.number()
        .positive()
        .integer()
        .required(),
      weight: Yup.number()
        .positive()
        .integer()
        .required(),
    });

    if (!(await schema.isValid(req.body))) {
      return res.status(400).json({ error: 'Validation failed' });
    }

    const { email } = req.body;
    const checkStudentExists = await Student.findOne({ where: { email } });

    if (checkStudentExists) {
      return res.status(400).json({ error: 'student already exists' });
    }

    const student = await Student.create(req.body);

    return res.json(student);
  }

  async index(req, res) {
    const { q: name } = req.query;
    let where;
    if (name) {
      where = {
        where: {
          name: {
            [Op.iLike]: `%${name}%`,
          },
        },
      };
    }
    const users = await Student.findAll(where);
    return res.json(users);
  }

  async update(req, res) {
    const schema = Yup.object().shape({
      name: Yup.string().required(),
      email: Yup.string().email(),
      age: Yup.number()
        .positive()
        .integer(),

      height: Yup.number()
        .positive()
        .integer(),

      weight: Yup.number()
        .positive()
        .integer(),
    });

    if (!(await schema.isValid(req.body))) {
      return res.status(400).json({ error: 'Validation failed' });
    }

    const { email } = req.body;
    const { studentId } = req.params;

    if (email) {
      const emailAlreadyUsed = await Student.findOne({ where: { email } });

      if (emailAlreadyUsed) {
        return res
          .status(400)
          .json({ error: 'Email already used by another student' });
      }
    }

    const student = await Student.findByPk(studentId);

    if (!student) {
      return res.status(400).json({ error: 'student does not exist' });
    }

    const updatedStudent = await student.update(req.body);

    return res.json({ student: updatedStudent });
  }
}

export default new StudentController();
