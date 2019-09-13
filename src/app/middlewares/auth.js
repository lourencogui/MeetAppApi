import jwt from 'jsonwebtoken';
import { promisify } from 'util';
import authConfig from '../../config/auth';

export default async (req, res, next) => {
  const auth = req.headers.authorization;

  if (!auth) {
    return res.status(401).json({ error: 'Token is not present on header' });
  }

  const [, token] = auth.split(' ');

  try {
    const { id } = await promisify(jwt.verify)(token, authConfig.secret);
    req.userId = id;
    return next();
  } catch (error) {
    return res.status(401).json({ error: 'Invalid token' });
  }
};
