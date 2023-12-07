import { Router } from 'express';
import answersController from './controllers/answers';
import questionsController from './controllers/questions';

const router = Router();

router.use('/questions', questionsController);
router.use('/answers', answersController);

export default router;
