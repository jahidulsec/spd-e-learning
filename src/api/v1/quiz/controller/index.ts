import { createQuiz } from "./quiz/create";
import { getQuizzes } from "./quiz/get-multi";
import { getQuiz } from "./quiz/get-single";
import { updateQuiz } from "./quiz/update";
import { delQuiz } from "./quiz/delete";

// question
import { createQuestion } from "./question/create";

export = {
  createQuiz,
  getQuiz,
  getQuizzes,
  updateQuiz,
  delQuiz,
  createQuestion,
};
