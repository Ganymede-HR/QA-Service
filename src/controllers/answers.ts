import { Router } from 'express';

const router = Router();

// PUT mark answer helpful
router.put('/:answer_id/helpful', (req, res) => {
  res.send(`put helpful for answer ${req.params.answer_id}`);
});

// PUT report answer
router.put('/:answer_id/report', (req, res) => {
  res.send(`put report for answer ${req.params.answer_id}`);
});

export default router;
