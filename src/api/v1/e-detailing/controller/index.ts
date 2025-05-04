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
};
