import { parseISO, addMonths } from 'date-fns';
import * as Yup from 'yup';
import Registration from '../models/Registration';
import User from '../models/User';
import Student from '../models/Student';
import Plan from '../models/Plan';
import Queue from '../../lib/Queue';
import RegistrationMail from '../jobs/RegistrationMail';

class RegistrationController {
  async store(req, res) {
    const schema = Yup.object().shape({
      student_id: Yup.number()
        .integer()
        .positive()
        .required(),
      plan_id: Yup.number()
        .integer()
        .positive()
        .required(),
      start_date: Yup.date().required(),
    });

    if (!(await schema.isValid(req.body))) {
      return res.status(400).json({ error: 'Validation failed' });
    }

    const { student_id, plan_id, start_date } = req.body;

    const checkStudenExists = await Student.findByPk(student_id);
    if (!checkStudenExists) {
      return res.status(400).json({ error: 'Student does not exist' });
    }

    const studentHasRegistration = await Registration.findOne({
      where: { student_id },
    });

    if (studentHasRegistration) {
      return res.status(400).json({ error: 'Student already registred' });
    }

    const plan = await Plan.findByPk(plan_id);
    if (!plan) {
      return res.status(400).json({ error: 'Plan does not exist' });
    }

    const { total, duration } = plan;
    const endDate = addMonths(parseISO(start_date), duration);

    const registration = await Registration.create({
      student_id,
      plan_id,
      start_date,
      price: total,
      end_date: endDate,
    });

    const { email, name } = checkStudenExists;
    Queue.doJob(RegistrationMail.key, { email, name, endDate, plan, total });

    return res.json(registration);
  }

  async index(req, res) {
    const checkUserIsAdmin = await User.findByPk(req.userId);

    if (!checkUserIsAdmin) {
      return res
        .status(400)
        .json({ error: 'Only admin can create registration' });
    }

    const registrations = await Registration.findAll({
      attributes: ['id', 'start_date', 'end_date', 'price', 'active'],
    });

    return res.json(registrations);
  }

  async update(req, res) {
    const schema = Yup.object().shape({
      plan_id: Yup.number()
        .integer()
        .positive()
        .required(),
      start_date: Yup.date().required(),
    });

    if (!(await schema.isValid(req.body))) {
      return res.status(400).json({ error: 'Validation failed' });
    }

    const { registrationId } = req.params;
    const { plan_id, start_date } = req.body;

    const registration = await Registration.findByPk(registrationId);

    if (!registration) {
      return res.status(400).json({ error: 'Registration does not exist' });
    }

    const plan = await Plan.findByPk(plan_id);
    if (!plan) {
      return res.status(400).json({ error: 'Plan does not exist' });
    }

    const { total, duration } = plan;
    const endDate = addMonths(parseISO(start_date), duration);

    const updatedRegistration = await registration.update({
      price: total,
      end_date: endDate,
      plan_id: plan.id,
    });
    return res.json(updatedRegistration);
  }

  async delete(req, res) {
    const schema = Yup.object().shape({
      registrationId: Yup.number()
        .integer()
        .positive()
        .required(),
    });

    if (!(await schema.isValid(req.params))) {
      return res.status(400).json({ error: 'Validation failed' });
    }

    const { registrationId } = req.params;

    const registration = await Registration.findByPk(registrationId);
    if (!registration) {
      return res.status(400).json({ error: 'Registration does not exist' });
    }

    await registration.destroy();
    return res.json({ success: true });
  }
}

export default new RegistrationController();
