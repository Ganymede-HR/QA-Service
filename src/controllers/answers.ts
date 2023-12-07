import { Router } from 'express';
import { markAnswerHelpful, reportAnswer } from '../models/answers';

const router = Router();

// PUT mark answer helpful
router.put('/:answerId/helpful', (req, res) => {
  const { answerId } = req.params;
  markAnswerHelpful({ answerId: +answerId })
    .then(() => res.status(204))
    .catch((err) => {
      console.error('answer helpful err:', err);
      res.status(500);
    });
});

// PUT report answer
router.put('/:answerId/report', (req, res) => {
  const { answerId } = req.params;
  reportAnswer({ answerId: +answerId })
    .then(() => res.status(204))
    .catch((err) => {
      console.error('answer report err:', err);
      res.status(500);
    });
});

export default router;
