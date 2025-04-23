import { $Enums, category, Prisma } from "@prisma/client";

type Role = $Enums.role;

export type User = Prisma.usersGetPayload<{
  include: { team_members: { select: { team_id: true; id: true } } };
}>;

type Category = Prisma.categoryGetPayload<{}>;

type Folder = Prisma.folderGetPayload<{
  include: {
    category: {
      include: {
        team: {
          include: {
            team_members: true;
          };
        };
      };
    };
  };
}>;

type File = Prisma.fileGetPayload<{
  include: {
    folder: {
      include: {
        category: {
          include: {
            team: {
              include: {
                team_members: true;
              };
            };
          };
        };
      };
    };
  };
}>;

type Quater = Prisma.quaterGetPayload<{}>;
type Quiz = Prisma.quizGetPayload<{
  include: {
    team: {
      include: {
        team_members: true;
      };
    };
  };
}>;
type QuizMember = Prisma.quiz_memberGetPayload<{}>;
type Question = Prisma.questionGetPayload<{
  include: {
    quiz: {
      include: {
        team: {
          include: {
            team_members: true;
          };
        };
      };
    };
  };
}>;
type Option = Prisma.quiz_optionGetPayload<{}>;
type Result = Prisma.resultGetPayload<{
  include: {
    team_member: {
      include: {
        team: {
          include: {
            team_members: true;
          };
        };
      };
    };
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
        const userList = folder.category?.team.team_members.filter(
          (item) => item.user_id === user.sap_id
        );

        if (userList?.length === 0) return false;
        return true;
      },
      update: (user, folder) => {
        const userList = folder.category?.team.team_members.filter(
          (item) => item.user_id === user.sap_id
        );

        if (userList?.length === 0) return false;
        return true;
      },
      delete: (user, folder) => {
        const userList = folder.category?.team.team_members.filter(
          (item) => item.user_id === user.sap_id
        );

        if (userList?.length === 0) return false;
        return true;
      },
    },
    files: {
      create: true,
      view: (user, file) => {
        const userList = file.folder.category?.team.team_members.filter(
          (item) => item.user_id === user.sap_id
        );

        if (userList?.length === 0) return false;

        return true;
      },
      update: (user, file) => {
        const userList = file.folder.category?.team.team_members.filter(
          (item) => item.user_id === user.sap_id
        );

        if (userList?.length === 0) return false;

        return true;
      },
      delete: (user, file) => {
        const userList = file.folder.category?.team.team_members.filter(
          (item) => item.user_id === user.sap_id
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
        const userList = quiz.team.team_members.filter(
          (item) => item.user_id === user.sap_id
        );

        if (userList.length === 0) return false;

        return true;
      },
      update: (user, quiz) => {
        const userList = quiz.team.team_members.filter(
          (item) => item.user_id === user.sap_id
        );

        if (userList.length === 0) return false;

        return true;
      },
      delete: (user, quiz) => {
        const userList = quiz.team.team_members.filter(
          (item) => item.user_id === user.sap_id
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
        const userList = question.quiz.team.team_members.filter(
          (item) => item.user_id === user.sap_id
        );

        if (userList.length === 0) return false;
        return true;
      },
      update: (user, question) => {
        const userList = question.quiz.team.team_members.filter(
          (item) => item.user_id === user.sap_id
        );

        if (userList.length === 0) return false;
        return true;
      },
      delete: (user, question) => {
        const userList = question.quiz.team.team_members.filter(
          (item) => item.user_id === user.sap_id
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
        const userList = result.team_member.team.team_members.filter(
          (item) => item.user_id === user.sap_id
        );

        if (userList.length === 0) return false;

        return true;
      },
      update: false,
      delete: false,
    },
    question_answer: {
      view: (user, question) => {
        const userList = question.quiz.team.team_members.filter(
          (item) => item.user_id === user.sap_id
        );

        if (userList.length === 0) return false;
        return true;
      },
    },
    question_answers: {
      view: false,
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
        const userList = folder.category?.team.team_members.filter(
          (item) => item.user_id === user.sap_id
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
        const userList = file.folder.category?.team.team_members.filter(
          (item) => item.user_id === user.sap_id
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
        const userList = quiz.team.team_members.filter(
          (item) => item.user_id === user.sap_id
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
        const userList = question.quiz.team.team_members.filter(
          (item) => item.user_id === user.sap_id
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
        const userList = question.quiz.team.team_members.filter(
          (item) => item.user_id === user.sap_id
        );

        if (userList.length === 0) return false;
        return true;
      },
    },
    question_answers: {
      view: true,
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
