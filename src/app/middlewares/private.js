import User from '../models/User';

export default async (req, res, next) => {
  const checkUserIsAdmin = await User.findByPk(req.userId);

  if (!checkUserIsAdmin) {
    return res
      .status(400)
      .json({ error: 'Only admin can create registration' });
  }

  return next();
};
