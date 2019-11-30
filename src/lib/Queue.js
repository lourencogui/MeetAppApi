// import queue from './Queue';
import Bee from 'bee-queue';
import CancellationMail from '../app/jobs/CancellationMail';
import RegistrationMail from '../app/jobs/RegistrationMail';
import redisConfig from '../config/redis';

const jobs = [CancellationMail, RegistrationMail];

class Queue {
  constructor() {
    this.queues = {};
    this.init();
  }

  init() {
    jobs.forEach(({ key, handle }) => {
      this.queues[key] = {
        bee: new Bee(key, redisConfig),
        handle,
      };
    });
  }

  doJob(key, data) {
    this.queues[key].bee.createJob(data).save();
  }

  processQueue() {
    jobs.forEach(job => {
      const { bee, handle } = this.queues[job.key];
      bee.on('failure', this.handleFailure).process(handle);
    });
  }

  handleFailure(job, err) {
    console.log(`Queue ${job.queue.name}: FAILED`, err);
  }
}

export default new Queue();
