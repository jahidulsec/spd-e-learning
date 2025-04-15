import { Router } from "express";
import { authorize } from "../../middlewares/authorize";
import controller from "../../api/v1/quiz";

const router = Router();

// quiz
router
  .route("/quiz")
  .get(controller.getQuizzes)
  .post(authorize("quiz", "create"), controller.createQuiz);

router
  .route("/quiz/:id")
  .get(controller.getQuiz)
  .patch(controller.updateQuiz)
  .delete(controller.delQuiz);

// question
router
  .route("/question")
  .get(controller.getQuestions)
  .post(authorize("question", "create"), controller.createQuestion);

router
  .route("/question/:id")
  .get(controller.getQuestion)
  .patch(controller.updateQuestion)
  .delete(controller.delQuestion);

export { router as quizRouter };
