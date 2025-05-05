import { createTopic } from "./topic/create";
import { getTopics } from "./topic/get-multi";
import { getTopic } from "./topic/get-single";
import { delTopic } from "./topic/delete";
import { updateTopic } from "./topic/update";

// video
import { createVideo } from "./video/create";
import { getVideos } from "./video/get-multi";
import { getVideo } from "./video/get-single";
import { delVideo } from "./video/delete";
import { updateVideo } from "./video/update";

// score
import { createScore } from "./score/create";
import { getScores } from "./score/get-multi";
import { getScore } from "./score/get-single";
import { delScore } from "./score/delete";
import { updateScore } from "./score/update";

export = {
  createTopic,
  getTopic,
  getTopics,
  updateTopic,
  delTopic,
  updateVideo,
  createVideo,
  getVideo,
  getVideos,
  delVideo,
  createScore,
  getScore,
  getScores,
  updateScore,
  delScore,
};
