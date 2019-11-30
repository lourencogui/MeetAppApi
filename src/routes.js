import { Router } from 'express';
import AuthMiddleware from './app/middlewares/auth';
import PrivateMiddleware from './app/middlewares/private';

import UserController from './app/controllers/UserController';
import SessionController from './app/controllers/SessionController';
import StudentController from './app/controllers/StudentController';
import PlanController from './app/controllers/PlanController';
import RegistrationController from './app/controllers/RegistrationController';
import CheckinController from './app/controllers/CheckinController';
import HelpOrderController from './app/controllers/HelpOrderController';
import AnswerController from './app/controllers/AnswerController';

import Queue from './lib/Queue';
import CancellationMail from './app/jobs/CancellationMail';

const routes = new Router();

routes.get('/', (req, res) => {
  Queue.doJob(CancellationMail.key, {
    email: 'guilherme@agrotools.com.br',
    name: 'guilherme',
  });
  return res.json({ ok: true });
});

routes.post('/users', UserController.store);
routes.post('/sessions', SessionController.store);

routes.use(AuthMiddleware);

// USER
routes.put('/users', UserController.update);

// STUDENT
routes.get('/students', PrivateMiddleware, StudentController.index);
routes.post('/students', PrivateMiddleware, StudentController.store);
routes.put('/students/:studentId', PrivateMiddleware, StudentController.update);

// HELP-ORDER
routes.post('/students/:studentId/help-orders', HelpOrderController.store);
routes.get('/students/:studentId/help-orders', HelpOrderController.index);

// ANSWER HELP
routes.post('/help-orders/:helpOrderId/answer', AnswerController.store);
routes.get('/help-orders/answer', AnswerController.index);

// PLAN
routes.post('/plans', PrivateMiddleware, PlanController.store);
routes.get('/plans', PrivateMiddleware, PlanController.index);
routes.put('/plans/:planId', PrivateMiddleware, PlanController.update);
routes.delete('/plans/:planId', PrivateMiddleware, PlanController.remove);

// REGISTRATION
routes.post('/registrations', PrivateMiddleware, RegistrationController.store);
routes.get('/registrations', PrivateMiddleware, RegistrationController.index);
routes.put(
  '/registrations/:registrationId',
  PrivateMiddleware,
  RegistrationController.update
);
routes.delete(
  '/registrations/:registrationId',
  PrivateMiddleware,
  RegistrationController.delete
);

// CHECKIN
routes.post('/checkins/:studentId', CheckinController.store);
routes.get('/checkins/:studentId', CheckinController.index);

export default routes;
