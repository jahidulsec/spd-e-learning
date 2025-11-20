import db from "../db/db";
import {
  LeaderboardQueryInputTypes,
} from "../schemas/leaderboard";

const getMulti = async (queries: LeaderboardQueryInputTypes) => {
  const size = Number(queries?.size) || 20;
  const page = Number(queries?.page) || 1;
  const offset = (page - 1) * size;


  let baseQuery = `
    WITH scored_user AS (
      SELECT u.full_name,
          u.sap_id,
          u.mobile,
          tm.team_id,
          t.title team_title,
          IFNULL(
              (
                  SELECT SUM(r.score)
                  FROM result r
                  ${queries.quater_id ? `
                    LEFT JOIN question qu on qu.id = r.question_id
                    LEFT JOIN quiz q on q.quater_id=qu.quiz_id
                    LEFT JOIN quater qua on qua.id = q.quater_id
                    ` : ""
    }
                  WHERE r.team_member_id = tm.id
                  ${queries.quater_id ? " AND qua.id = ?" : ""
    }
              ),
              0
          ) AS quiz_score,
          (
              SELECT SUM(qm.duration_s)
              FROM quiz_member qm
              ${queries.quater_id ? ` LEFT JOIN quiz q on q.id=qm.quiz_id` : ""}
              WHERE qm.team_member_id = tm.id
              ${queries.quater_id ? " AND q.quater_id = ?" : ""}
          ) AS duration_s,
          IFNULL(
              (
                  SELECT SUM(
                          es.score_closing + es.score_content + es.score_presentation + es.score_starting
                      )
                  FROM e_detailing_score es
                      LEFT JOIN e_detailing_video ev ON ev.id = es.video_id
                      ${queries.quater_id ? " LEFT JOIN e_detailing e on e.id = ev.e_detailing_id" : ""}
                  WHERE ev.team_member_id = tm.id
                  ${queries.quater_id ? " AND e.quater_id = ?" : ""}
              ),
              0
          ) AS e_score
      FROM users u
          LEFT JOIN team_members tm ON tm.user_id = u.sap_id
          LEFT JOIN teams t on t.id = tm.team_id
  ),
  groupd as (
    select *,
    (
      case when duration_s > 0 then 1 else 0 end
    ) is_completed
    from scored_user
  ${!queries.team_id ? "" : " where team_id = ? "}
  ),
  ranked AS (
    SELECT *,
          RANK() OVER (
              ORDER BY (quiz_score + e_score) DESC, is_completed desc, duration_s asc
          ) AS rank
        FROM groupd
    )
  SELECT 
    *, 
    count(*) over() total_count 
    FROM ranked
    `;

  const params: any[] = [];


  if (queries.quater_id) {
    params.push(queries.quater_id, queries.quater_id, queries.quater_id)
  }


  if (queries.team_id) {
    params.push(queries.team_id)
  }

  // handle multiple filter
  let filter = []

  // Search condition (note leading space)
  if (queries.search && queries.search.trim() !== "") {
    filter.push(`mobile LIKE ? OR full_name LIKE ? OR sap_id LIKE ?`);
    const searchTerm = `%${queries.search}%`;
    params.push(searchTerm, searchTerm, searchTerm);
  }

  if (filter.length > 0) {
    baseQuery += ` where ${filter.join(' AND ')}`
  }

  // Pagination (with proper spacing)
  baseQuery += ` 
  ORDER BY rank ASC LIMIT ?, ?`;
  params.push(offset, size);


  // Execute
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
