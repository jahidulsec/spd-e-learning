import db from "../db/db";
import {
  LeaderboardQueryInputTypes,
} from "../schemas/leaderboard";

const getMulti = async (queries: LeaderboardQueryInputTypes) => {
  const size = Number(queries?.size) || 20;
  const page = Number(queries?.page) || 1;
  const offset = (page - 1) * size;

  let baseQuery = `
  WITH scored_users AS (
    SELECT 
      d.full_name,
      d.mobile,
      d.sap_id,
      IFNULL((
        SELECT SUM(r.score)
        FROM result r
        INNER JOIN team_members t ON t.id = r.team_member_id
        ${queries.quater_id ? `
          INNER JOIN question q ON q.id = r.question_id
          INNER JOIN quiz qu ON qu.id = q.quiz_id
          INNER JOIN quater qr ON qr.id = qu.quater_id
        ` : ""}
        WHERE t.user_id = d.sap_id
      `;

  const params: any[] = [];

  // Handle quarter IDs
  let quaterCondition = "";
  if (queries.quater_id) {
    const quaterIds = String(queries.quater_id)
      .split(",")
      .map(id => id.trim())


    if (quaterIds.length > 0) {
      const placeholders = quaterIds.map(() => "?").join(", ");
      quaterCondition = `AND qr.id IN (${placeholders})`;
      params.push(...quaterIds, ...quaterIds); // for both subqueries
    }
  }

  // continue base query
  baseQuery += `
        ${quaterCondition}
      ), 0) AS total_quiz_mark,
      IFNULL((
        SELECT SUM(
          es.score_closing + es.score_content + es.score_presentation + es.score_starting
        )
        FROM e_detailing_score es
        INNER JOIN e_detailing_video e ON e.id = es.video_id
        INNER JOIN team_members t ON t.id = e.team_member_id
        ${queries.quater_id ? `
          INNER JOIN e_detailing ed ON ed.id = e.e_detailing_id
          INNER JOIN quater qr ON qr.id = ed.quater_id
        ` : ""}
        WHERE t.user_id = d.sap_id
        ${quaterCondition}
      ), 0) AS total_e_learning_mark,
      (
        SELECT SUM(qm.duration_s)
        FROM quiz_member qm
            INNER JOIN team_members tms ON tms.id = qm.team_member_id
        WHERE tms.user_id = d.sap_id
      ) AS duration_s
    FROM users d
    ${queries.team_id ? "INNER JOIN team_members tm ON tm.user_id = d.sap_id WHERE tm.team_id = ?" : ""}
  ),
  ranked_users AS (
    SELECT 
      *,
        RANK() OVER (
            ORDER BY CASE
                    WHEN duration_s IS NULL THEN 1
                    ELSE 0
                END ASC,
                (total_quiz_mark + total_e_learning_mark) DESC,
                duration_s ASC
        ) AS rank
    FROM scored_users
  )
  SELECT *, COUNT(*) OVER() AS total_count
  FROM ranked_users
`;


  // Push team_id
  if (queries.team_id) {
    params.push(queries.team_id);
  }

  // Search condition (note leading space)
  if (queries.search && queries.search.trim() !== "") {
    baseQuery += ` WHERE mobile LIKE ? OR full_name LIKE ? OR sap_id LIKE ?`;
    const searchTerm = `%${queries.search}%`;
    params.push(searchTerm, searchTerm, searchTerm);
  }

  // Pagination (with proper spacing)
  baseQuery += ` ORDER BY rank ASC LIMIT ?, ?`;
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
