import db from "../db/db";
import { LeaderboardQueryInputTypes } from "../schemas/leaderboard";

const getMulti = async (queries: LeaderboardQueryInputTypes) => {
  const size = Number(queries.size) || 20;
  const page = Number(queries.page) || 1;
  const offset = (page - 1) * size;

  const params: any[] = [];

  // Quarter filter
  const quizQuarterWhere = queries.quater_id ? "WHERE q.quater_id = ?" : "";
  const edQuarterWhere = queries.quater_id ? "WHERE e.quater_id = ?" : "";

  if (queries.quater_id) {
    params.push(queries.quater_id); // quiz_scores
    params.push(queries.quater_id); // quiz_duration
    params.push(queries.quater_id); // edetail
  }

  // Team filter
  const rankedFilters: string[] = [];
  if (queries.team_id) {
    rankedFilters.push("tm.team_id = ?");
    params.push(queries.team_id);
  }

  const rankedWhere =
    rankedFilters.length > 0 ? `WHERE ${rankedFilters.join(" AND ")}` : "";

  let query = `
    WITH quiz_scores AS (
      SELECT r.team_member_id, SUM(r.score) AS quiz_score
      FROM result r
      JOIN question qu ON qu.id = r.question_id
      JOIN quiz q ON q.id = qu.quiz_id
      ${quizQuarterWhere}
      GROUP BY r.team_member_id
    ),
    quiz_duration AS (
      SELECT qm.team_member_id, SUM(qm.duration_s) AS duration_s
      FROM quiz_member qm
      JOIN quiz q ON q.id = qm.quiz_id
      ${quizQuarterWhere}
      GROUP BY qm.team_member_id
    ),
    edetail_scores AS (
      SELECT
        ev.team_member_id,
        SUM(
          es.score_closing +
          es.score_content +
          es.score_presentation +
          es.score_starting
        ) AS e_score
      FROM e_detailing_score es
      JOIN e_detailing_video ev ON ev.id = es.video_id
      JOIN e_detailing e ON e.id = ev.e_detailing_id
      ${edQuarterWhere}
      GROUP BY ev.team_member_id
    ),
    ranked AS (
      SELECT
        u.full_name,
        u.sap_id,
        u.mobile,
        tm.team_id,
        t.title AS team_title,
        COALESCE(qs.quiz_score,0) AS quiz_score,
        COALESCE(qd.duration_s,0) AS duration_s,
        COALESCE(ed.e_score,0) AS e_score,
        CASE WHEN COALESCE(qd.duration_s,0) > 0 THEN 1 ELSE 0 END AS is_completed,
        RANK() OVER (
          ORDER BY
            (COALESCE(qs.quiz_score,0)+COALESCE(ed.e_score,0)) DESC,
            CASE WHEN COALESCE(qd.duration_s,0) > 0 THEN 1 ELSE 0 END DESC,
            COALESCE(qd.duration_s,999999) ASC,
            u.full_name ASC
        ) AS rank
      FROM users u
      JOIN team_members tm ON tm.user_id = u.sap_id
      LEFT JOIN teams t ON t.id = tm.team_id
      LEFT JOIN quiz_scores qs ON qs.team_member_id = tm.id
      LEFT JOIN quiz_duration qd ON qd.team_member_id = tm.id
      LEFT JOIN edetail_scores ed ON ed.team_member_id = tm.id
      ${rankedWhere}
    )
    SELECT *,
           COUNT(*) OVER() AS total_count
    FROM ranked
  `;

  // Search
  if (queries.search?.trim()) {
    query += `
      WHERE (
        mobile LIKE ? OR
        full_name LIKE ? OR
        sap_id LIKE ?
      )
    `;
    const term = `%${queries.search}%`;
    params.push(term, term, term);
  }

  query += ` ORDER BY rank ASC LIMIT ?, ?`;
  params.push(offset, size);

  const res = await db.$queryRawUnsafe(query, ...params);

  return {
    data: res as any[],
    page,
    size,
  };
};

export = { getMulti };