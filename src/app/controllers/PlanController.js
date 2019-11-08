import * as Yup from 'yup';
import Plan from '../models/Plan';

class PlanController {
  async store(req, res) {
    const schema = Yup.object().shape({
      title: Yup.string().required(),
      price: Yup.number()
        .integer()
        .positive()
        .required(),
      duration: Yup.number()
        .integer()
        .positive()
        .required(),
    });

    if (!(await schema.isValid(req.body))) {
      return res.status(400).json({ error: 'Validation failed ' });
    }

    const { title } = req.body;

    const checkPlanExists = await Plan.findOne({ where: { title } });

    if (checkPlanExists) {
      return res.status(400).json({ error: 'Plan already exists ' });
    }

    const plan = await Plan.create(req.body);

    return res.json(plan);
  }

  async update(req, res) {
    const schema = Yup.object().shape({
      title: Yup.string().required(),
      price: Yup.number()
        .integer()
        .positive(),
      duration: Yup.number()
        .integer()
        .positive(),
    });

    if (!(await schema.isValid(req.body))) {
      return res.status(400).json({ error: 'Validation failed ' });
    }

    const { planId } = req.params;
    const plan = await Plan.findByPk(planId);
    if (!plan) {
      return res.status(400).json({ error: 'Plan does not exist' });
    }

    const updatedPlan = await plan.update(req.body);
    return res.json(updatedPlan);
  }

  async index(req, res) {
    const plans = await Plan.findAll();
    return res.json(plans);
  }

  async remove(req, res) {
    const { planId } = req.params;

    const plan = await Plan.findByPk(planId);

    if (!plan) {
      return res.status(400).json({ error: 'Plan does not exist' });
    }

    await plan.destroy();
    return res.json({ success: true });
  }
}

export default new PlanController();
