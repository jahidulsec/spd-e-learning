import { createQuiz } from "./quiz/create";
import { getQuizzes } from "./quiz/get-multi";
import { getQuiz } from "./quiz/get-single";
import { updateQuiz } from "./quiz/update";
import { delQuiz } from "./quiz/delete";

// question
import { createQuestion } from "./question/create";
import { delQuestion } from "./question/delete";
import { getQuestions } from "./question/get-multi";
import { getQuestion } from "./question/get-single";
import { updateQuestion } from "./question/update";

// option
import { createOption } from "./option/create";
import { delOption } from "./option/delete";
import { getOptions } from "./option/get-multi";
import { getOption } from "./option/get-single";
import { updateOption } from "./option/update";

export = {
  createQuiz,
  getQuiz,
  getQuizzes,
  updateQuiz,
  delQuiz,
  createQuestion,
  delQuestion,
  getQuestion,
  getQuestions,
  updateQuestion,
  createOption,
  getOption,
  getOptions,
  updateOption,
  delOption,
};
