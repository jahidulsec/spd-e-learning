import { createTopic } from "./topic/create";
import { getTopics } from "./topic/get-multi";
import { getTopic } from "./topic/get-single";
import { delTopic } from "./topic/delete";
import { updateTopic } from "./topic/update";

export = {
  createTopic,
  getTopic,
  getTopics,
  updateTopic,
  delTopic,
};
