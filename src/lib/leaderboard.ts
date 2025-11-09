import db from "../db/db";
import {
  LeaderboardQueryInputTypes,
} from "../schemas/leaderboard";

const getMulti = async (queries: LeaderboardQueryInputTypes) => {
  const size = queries?.size ?? 20;
  const page = queries?.page ?? 1;

  const offset = (page - 1) * size;

  let baseQuery = `
            WITH ranked_users AS (
              SELECT d.full_name,
                  d.mobile,
                  d.sap_id,
                  IFNULL(
                      (
                          SELECT SUM(r.score)
                          FROM result r
                              LEFT JOIN team_members t ON t.id = r.team_member_id
                          WHERE t.user_id = d.sap_id
                      ),
                      0
                  ) AS total_quiz_mark,
                  IFNULL(
                      (
                          SELECT sum(
                                  es.score_closing + es.score_content + es.score_presentation + es.score_starting
                              )
                          FROM e_detailing_score es
                              INNER JOIN e_detailing_video e ON e.id = es.video_id
                              INNER JOIN team_members t ON t.id = e.team_member_id
                          WHERE t.user_id = d.sap_id
                      ),
                      0
                  ) AS total_e_learning_mark,
                  RANK() OVER (
                      ORDER BY (total_quiz_mark) DESC,
                          (total_e_learning_mark) DESC
                  ) AS rank
              FROM users d
          )
          SELECT *, count(*) over() total
          FROM ranked_users
        `;

  const params: any[] = [];

  // Add search condition if `search` is non-empty
  if (queries.search && queries.search.trim() !== "") {
    baseQuery += ` WHERE mobile LIKE ? OR full_name LIKE ? OR sap_id LIKE ?`;
    const searchTerm = `%${queries.search}%`;
    params.push(searchTerm, searchTerm, searchTerm);
  }

  // Push quiz_date if it exists (3 times for each subquery)
  // if (quiz_date) {
  //   params.push(quiz_date, quiz_date, quiz_date);
  // }

  // Add pagination
  baseQuery += ` LIMIT ?, ?`;
  params.push(offset, size);

  const res = await db.$queryRawUnsafe(baseQuery, ...params);

  return {
    data: res as any[],
    page: page,
    size: size,
  };

};


export = {
  getMulti,
};
