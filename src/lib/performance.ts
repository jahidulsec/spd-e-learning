import db from "../db/db";
import { requiredIdTypes } from "../schemas/required-id";
import { usersQueryInputTypes } from "../schemas/user";

const getMulti = async (queries: usersQueryInputTypes) => {
  const size = queries?.size ?? 20;
  const page = queries?.page ?? 1;
  const sort = queries?.sort ?? "desc";

  const [data, count] = await Promise.all([
    db.users.findMany({
      where: {
        full_name: {
          startsWith: queries.search || undefined,
        },
        mobile: {
          startsWith: queries.search || undefined,
        },
      },
      take: size,
      skip: size * (page - 1),
      orderBy: {
        created_at: sort,
      },
    }),
    db.users.count({
      where: {
        full_name: {
          startsWith: queries.search || undefined,
        },
        mobile: {
          startsWith: queries.search || undefined,
        },
      },
    }),
  ]);

  return { data, count, page, size };
};

const getUserStats = async () => {
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
      GROUP BY
          tm.team_id;
    `,
  ]);

  return { e_detailing_stats, quiz_stats };
};

const getSingle = async (idObj: requiredIdTypes) => {
  const { id } = idObj;

  //extract id from validated id by zod
  const data = await db.users.findUnique({
    where: { sap_id: id },
    include: {
      team_members: {
        include: {
          team: true,
        },
      },
    },
  });

  return data;
};

export = {
  getMulti,
  getSingle,
  getUserStats,
};
