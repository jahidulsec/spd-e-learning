import { $Enums, category, Prisma } from "@prisma/client";

type Role = $Enums.role;

export type User = Prisma.usersGetPayload<{
  include: { team_members: { select: { team_id: true; id: true, user_id: true } } };
}>;

type Category = Prisma.categoryGetPayload<{}>;

type Folder = Prisma.folderGetPayload<{
  include: {
    category: true;
  };
}>;

type File = Prisma.fileGetPayload<{
  include: {
    folder: {
      include: {
        category: true;
      };
    };
  };
}>;

type Quater = Prisma.quaterGetPayload<{}>;
type Quiz = Prisma.quizGetPayload<{}>;
type QuizMember = Prisma.quiz_memberGetPayload<{}>;
type Question = Prisma.questionGetPayload<{
  include: {
    quiz: true;
  };
}>;
type Option = Prisma.quiz_optionGetPayload<{}>;
type Result = Prisma.resultGetPayload<{
  include: {
    team_member: true;
  };
}>;

type QuestionAnswers = Prisma.quizGetPayload<{
  include: {
    question: {
      include: {
        quiz_option: {
          include: {
            result: true;
          };
        };
      };
    };
  };
}>;

type EDetailing = Prisma.e_detailingGetPayload<{}>;
type EDetailingVideo = Prisma.e_detailing_videoGetPayload<{
  include: {
    team_member: true;
    e_detailing: true;
  };
}>;

type PermissionCheck<Key extends keyof Permissions> =
  | boolean
  | ((user: User, data: Permissions[Key]["dataType"]) => boolean);

type RolesWithPermissions = {
  [R in Role]: Partial<{
    [Key in keyof Permissions]: Partial<{
      [Action in Permissions[Key]["action"]]: PermissionCheck<Key>;
    }>;
  }>;
};

export type Permissions = {
  categories: {
    dataType: Category;
    action: "view" | "create" | "update" | "delete";
  };
  folders: {
    dataType: Folder;
    action: "view" | "create" | "update" | "delete";
  };
  files: {
    dataType: File;
    action: "view" | "create" | "update" | "delete";
  };
  quater: {
    dataType: Quater;
    action: "view" | "create" | "update" | "delete";
  };
  quiz: {
    dataType: Quiz;
    action: "view" | "create" | "update" | "delete";
  };
  quiz_member: {
    dataType: QuizMember;
    action: "create";
  };
  question: {
    dataType: Question;
    action: "view" | "create" | "update" | "delete";
  };
  option: {
    dataType: Option;
    action: "view" | "create" | "update" | "delete";
  };
  result: {
    dataType: Result;
    action: "view" | "create" | "update" | "delete";
  };
  question_answer: {
    dataType: Question;
    action: "view";
  };
  question_answers: {
    dataType: QuestionAnswers;
    action: "view";
  };
  e_detailing: {
    dataType: EDetailing;
    action: "view" | "create" | "update" | "delete";
  };
  e_detailing_video: {
    dataType: EDetailingVideo;
    action: "view" | "create" | "update" | "delete";
  };
};

const ROLES = {
  superadmin: {
    categories: {
      create: true,
      view: true,
      update: true,
      delete: true,
    },
    folders: {
      create: true,
      view: true,
      update: true,
      delete: true,
    },
    files: {
      create: true,
      view: true,
      update: true,
      delete: true,
    },
    quater: {
      create: true,
      view: true,
      update: true,
      delete: true,
    },
    quiz: {
      create: true,
      view: true,
      update: true,
      delete: true,
    },
    quiz_member: {
      create: false,
    },
    question: {
      create: true,
      view: true,
      update: true,
      delete: true,
    },
    option: {
      create: true,
      view: true,
      update: true,
      delete: true,
    },
    result: {
      create: false,
      view: true,
      update: false,
      delete: false,
    },
    question_answer: {
      view: true,
    },
    question_answers: {
      view: false,
    },
    e_detailing: {
      create: true,
      view: true,
      update: true,
      delete: true,
    },
    e_detailing_video: {
      create: false,
      view: true,
      update: false,
      delete: false,
    },
  },
  team_lead: {
    categories: {
      create: true,
      view: (user, category) => {
        const userList = user.team_members.filter(
          (item) => item.team_id === category.team_id
        );
        if (userList.length === 0) return false;
        return true;
      },
      update: (user, category) => {
        const userList = user.team_members.filter(
          (item) => item.team_id === category.team_id
        );

        if (userList.length === 0) return false;
        return true;
      },
      delete: (user, category) => {
        const userList = user.team_members.filter(
          (item) => item.team_id === category.team_id
        );

        if (userList.length === 0) return false;
        return true;
      },
    },
    folders: {
      create: true,
      view: (user, folder) => {
        const userList = user.team_members.filter(
          (item) => item.team_id === folder.category?.team_id
        );

        if (userList?.length === 0) return false;
        return true;
      },
      update: (user, folder) => {
        const userList = user.team_members.filter(
          (item) => item.team_id === folder.category?.team_id
        );

        if (userList?.length === 0) return false;
        return true;
      },
      delete: (user, folder) => {
        const userList = user.team_members.filter(
          (item) => item.team_id === folder.category?.team_id
        );

        if (userList?.length === 0) return false;
        return true;
      },
    },
    files: {
      create: true,
      view: (user, file) => {
        const userList = user.team_members.filter(
          (item) => item.team_id === file.folder.category?.team_id
        );

        if (userList?.length === 0) return false;

        return true;
      },
      update: (user, file) => {
        const userList = user.team_members.filter(
          (item) => item.team_id === file.folder.category?.team_id
        );

        if (userList?.length === 0) return false;

        return true;
      },
      delete: (user, file) => {
        const userList = user.team_members.filter(
          (item) => item.team_id === file.folder.category?.team_id
        );

        if (userList?.length === 0) return false;

        return true;
      },
    },
    quater: {
      create: true,
      view: true,
      update: true,
      delete: true,
    },
    quiz: {
      create: true,
      view: (user, quiz) => {
        const userList = user.team_members.filter(
          (item) => item.team_id === quiz.team_id
        );

        if (userList.length === 0) return false;

        return true;
      },
      update: (user, quiz) => {
        const userList = user.team_members.filter(
          (item) => item.team_id === quiz.team_id
        );

        if (userList.length === 0) return false;

        return true;
      },
      delete: (user, quiz) => {
        const userList = user.team_members.filter(
          (item) => item.team_id === quiz.team_id
        );

        if (userList.length === 0) return false;

        return true;
      },
    },
    quiz_member: {
      create: false,
    },
    question: {
      create: true,
      view: (user, question) => {
        const userList = user.team_members.filter(
          (item) => item.team_id === question.quiz.team_id
        );

        if (userList.length === 0) return false;
        return true;
      },
      update: (user, question) => {
        const userList = user.team_members.filter(
          (item) => item.team_id === question.quiz.team_id
        );

        if (userList.length === 0) return false;
        return true;
      },
      delete: (user, question) => {
        const userList = user.team_members.filter(
          (item) => item.team_id === question.quiz.team_id
        );

        if (userList.length === 0) return false;
        return true;
      },
    },
    option: {
      create: true,
      view: true,
      update: true,
      delete: true,
    },
    result: {
      create: false,
      view: (user, result) => {
        const userList = user.team_members.filter(
          (item) => item.team_id === result.team_member.team_id
        );

        if (userList.length === 0) return false;

        return true;
      },
      update: false,
      delete: false,
    },
    question_answer: {
      view: (user, question) => {
        const userList = user.team_members.filter(
          (item) => item.team_id === question.quiz.team_id
        );

        if (userList.length === 0) return false;
        return true;
      },
    },
    question_answers: {
      view: false,
    },
    e_detailing: {
      create: true,
      view: (user, topic) => {
        const userList = user.team_members.filter(
          (item) => item.team_id === topic.team_id
        );
        if (userList.length === 0) return false;
        return true;
      },
      update: (user, topic) => {
        const userList = user.team_members.filter(
          (item) => item.team_id === topic.team_id
        );

        if (userList.length === 0) return false;
        return true;
      },
      delete: (user, topic) => {
        const userList = user.team_members.filter(
          (item) => item.team_id === topic.team_id
        );

        if (userList.length === 0) return false;
        return true;
      },
    },
    e_detailing_video: {
      create: false,
      view: (user, video) => {
        const userList = user.team_members.filter(
          (item) => item.team_id === video.e_detailing.team_id
        );

        if (userList.length === 0) return false;
        return true;
      },
      update: false,
      delete: false,
    },
  },
  mios: {
    categories: {
      create: false,
      view: (user, category) => {
        const userList = user.team_members.filter(
          (item) => item.team_id === category.team_id
        );

        if (userList.length === 0) return false;
        return true;
      },
      update: false,
      delete: false,
    },
    folders: {
      create: false,
      view: (user, folder) => {
        const userList = user.team_members.filter(
          (item) => item.team_id === folder.category?.team_id
        );

        if (userList?.length === 0) return false;
        return true;
      },
      update: false,
      delete: false,
    },
    files: {
      create: false,
      view: (user, file) => {
        const userList = user.team_members.filter(
          (item) => item.team_id === file.folder.category?.team_id
        );

        if (userList?.length === 0) return false;

        return true;
      },
      update: false,
      delete: false,
    },
    quater: {
      create: false,
      view: true,
      update: false,
      delete: false,
    },
    quiz: {
      create: false,
      view: (user, quiz) => {
        const userList = user.team_members.filter(
          (item) => item.team_id === quiz.team_id
        );

        if (userList.length === 0) return false;

        return true;
      },
      update: false,
      delete: false,
    },
    quiz_member: {
      create: true,
    },
    question: {
      create: false,
      view: (user, question) => {
        const userList = user.team_members.filter(
          (item) => item.team_id === question.quiz.team_id
        );

        if (userList.length === 0) return false;
        return true;
      },
      update: false,
      delete: false,
    },
    option: {
      create: false,
      view: true,
      update: false,
      delete: false,
    },
    result: {
      create: true,
      view: (user, result) => result.team_member.user_id === user.sap_id,
      update: (user, result) => result.team_member.user_id === user.sap_id,
      delete: (user, result) => result.team_member.user_id === user.sap_id,
    },
    question_answer: {
      view: (user, question) => {
        const userList = user.team_members.filter(
          (item) => item.team_id === question.quiz.team_id
        );

        if (userList.length === 0) return false;
        return true;
      },
    },
    question_answers: {
      view: true,
    },
    e_detailing: {
      create: false,
      view: (user, topic) => {
        const userList = user.team_members.filter(
          (item) => item.team_id === topic.team_id
        );

        if (userList.length === 0) return false;
        return true;
      },
      update: false,
      delete: false,
    },
    e_detailing_video: {
      create: false,
      view: (user, video) => {
        const userList = user.team_members.filter(
          (item) => item.user_id === video.team_member.user_id
        );

        if (userList.length === 0) return false;
        return true;
      },
      update: (user, video) => {
        const userList = user.team_members.filter(
          (item) => item.user_id === video.team_member.user_id
        );

        if (userList.length === 0) return false;
        return true;
      },
      delete: (user, video) => {
        const userList = user.team_members.filter(
          (item) => item.user_id === video.team_member.user_id
        );

        if (userList.length === 0) return false;
        return true;
      },
    },
  },
  director: {
    categories: {
      create: false,
      view: true,
      update: false,
      delete: false,
    },
    folders: {
      create: false,
      view: true,
      update: false,
      delete: false,
    },
    files: {
      create: false,
      view: true,
      update: false,
      delete: false,
    },
    quater: {
      create: false,
      view: true,
      update: false,
      delete: false,
    },
    quiz: {
      create: false,
      view: true,
      update: false,
      delete: false,
    },
    quiz_member: {
      create: false,
    },
    question: {
      create: false,
      view: true,
      update: false,
      delete: false,
    },
    option: {
      create: false,
      view: true,
      update: false,
      delete: false,
    },
    result: {
      create: false,
      view: true,
      update: false,
      delete: false,
    },
    question_answer: {
      view: true,
    },
    question_answers: {
      view: false,
    },
    e_detailing: {
      create: false,
      view: true,
      update: false,
      delete: false,
    },
    e_detailing_video: {
      create: false,
      view: true,
      update: false,
      delete: false,
    },
  },
} as const satisfies RolesWithPermissions;

export function hasPermission<Resource extends keyof Permissions>(
  user: User,
  resource: Resource,
  action: Permissions[Resource]["action"],
  data?: Permissions[Resource]["dataType"]
) {
  const roles = [user.role] as Role[];

  return roles.some((role) => {
    const permission = (ROLES as RolesWithPermissions)[role][resource]?.[
      action
    ];
    if (permission == null) return false;

    if (typeof permission === "boolean") return permission;
    return data != null && permission(user, data);
  });
}

// Can create a comment
// hasPermission(user, "comments", "create")

// Can view the `todo` Todo with specific data
// hasPermission(user, "todos", "view", todo)
