import db from "../db/db";
import { performanceMioQueryInputTypes } from "../schemas/performance";

const getMultiMioPerformance = async (
  queries: performanceMioQueryInputTypes,
) => {
  const size = queries?.size ?? 20;
  const page = queries?.page ?? 1;

  const year = new Date().getFullYear();

  const [data]: any = await Promise.all([
    db.$queryRawUnsafe(`
        SELECT
            u.sap_id,
            u.full_name,
            t.title AS team_title,
            tm.team_id,
            COALESCE(r.score,0) + COALESCE(e.score,0) AS total_score,
            count(u.sap_id) over () total_count
        FROM users u
        LEFT JOIN team_members tm ON tm.user_id = u.sap_id
        LEFT JOIN teams t ON t.id = tm.team_id

        LEFT JOIN (
            SELECT
                team_member_id,
                SUM(score) score
            FROM result
            WHERE EXTRACT(YEAR FROM created_at) = ${year}
            GROUP BY team_member_id
        ) r ON r.team_member_id = tm.id

        LEFT JOIN (
            SELECT
                ev.team_member_id,
                SUM(es.score_closing + es.score_content + es.score_presentation + es.score_starting) score
            FROM e_detailing_score es
            LEFT JOIN e_detailing_video ev ON ev.id = es.video_id
            WHERE EXTRACT(YEAR FROM ev.created_at) = ${year}
            GROUP BY ev.team_member_id
        ) e ON e.team_member_id = tm.id

        WHERE u.role = 'mios'
        ${queries.team_id ? ` AND tm.team_id='${queries.team_id}' ` : ""}

        GROUP BY
            u.sap_id,
            u.full_name,
            t.title,
            tm.team_id

        ORDER BY total_score DESC
        LIMIT ${size} OFFSET ${(page - 1) * size}`),
  ]);

  return { data, page, size };
};

const getUserStats = async () => {
  const year = new Date().getFullYear();

  const [e_detailing_stats, quiz_stats]: any[] = await Promise.all([
    db.$queryRaw`
      select
        t.id team_id,
        t.title team_title,
        COALESCE(SUM(es.score_closing), 0) + COALESCE(SUM(es.score_content), 0) + COALESCE(SUM(es.score_presentation), 0) + COALESCE(SUM(es.score_starting), 0) as total 
      from
          users u
          LEFT JOIN team_members tm on tm.user_id = u.sap_id
          LEFT JOIN teams t on t.id = tm.team_id
          LEFT JOIN e_detailing_video ev on ev.team_member_id = tm.id
          LEFT JOIN e_detailing_score es on es.video_id = ev.id
      WHERE
          u.role = 'mios'
          and tm.team_id is not null
          and EXTRACT(
                YEAR
                FROM ev.created_at
            ) = ${year}
      GROUP BY
          tm.team_id;
    `,
    db.$queryRaw`
      select  
        t.id team_id,
        t.title team_title,
        sum(r.score) as total
      from
          users u
          LEFT JOIN team_members tm on tm.user_id = u.sap_id
          LEFT JOIN teams t on t.id = tm.team_id
          LEFT JOIN result r on r.team_member_id = tm.id
      WHERE
          u.role = 'mios'
          and tm.team_id is not null
           and EXTRACT(
                YEAR
                FROM r.created_at
            ) = ${year}
      GROUP BY
          tm.team_id;
    `,
  ]);

  return { e_detailing_stats, quiz_stats };
};

export = {
  getMultiMioPerformance,
  getUserStats,
};
