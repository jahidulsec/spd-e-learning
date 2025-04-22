import { $Enums, category, Prisma } from "@prisma/client";

type Role = $Enums.role;

export type User = Prisma.usersGetPayload<{
  include: { team_members: { select: { team_id: true; id: true } } };
}>;

type Folder = Prisma.folderGetPayload<{
  include: { category: true };
}>;

type File = Prisma.fileGetPayload<{
  include: {
    folder: {
      include: { category: true };
    };
  };
}>;

type Quater = Prisma.quaterGetPayload<{}>;
type Quiz = Prisma.quizGetPayload<{}>;
type QuizMember = Prisma.quiz_memberGetPayload<{}>;
type Question = Prisma.questionGetPayload<{ include: { quiz: true } }>;
type Option = Prisma.quiz_optionGetPayload<{}>;
type Result = Prisma.resultGetPayload<{
  include: {
    team_member: {
      include: {
        team: true;
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
    dataType: category;
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
      view: (user, category) => user.team_members?.team_id === category.team_id,
      update: (user, category) =>
        user.team_members?.team_id === category.team_id,
      delete: (user, category) =>
        user.team_members?.team_id === category.team_id,
    },
    folders: {
      create: true,
      view: (user, folder) =>
        user.team_members?.team_id === folder.category?.team_id,
      update: (user, folder) =>
        user.team_members?.team_id === folder.category?.team_id,
      delete: (user, folder) =>
        user.team_members?.team_id === folder.category?.team_id,
    },
    files: {
      create: true,
      view: (user, file) =>
        user.team_members?.team_id === file.folder.category?.team_id,
      update: (user, file) =>
        user.team_members?.team_id === file.folder.category?.team_id,
      delete: (user, file) =>
        user.team_members?.team_id === file.folder.category?.team_id,
    },
    quater: {
      create: true,
      view: true,
      update: true,
      delete: true,
    },
    quiz: {
      create: true,
      view: (user, quiz) => user.team_members?.team_id === quiz.team_id,
      update: (user, quiz) => user.team_members?.team_id === quiz.team_id,
      delete: (user, quiz) => user.team_members?.team_id === quiz.team_id,
    },
    quiz_member: {
      create: false,
    },
    question: {
      create: true,
      view: (user, question) =>
        user.team_members?.team_id === question.quiz.team_id,
      update: (user, question) =>
        user.team_members?.team_id === question.quiz.team_id,
      delete: (user, question) =>
        user.team_members?.team_id === question.quiz.team_id,
    },
    option: {
      create: true,
      view: true,
      update: true,
      delete: true,
    },
    result: {
      create: false,
      view: (user, result) =>
        user.team_members?.team_id === result.team_member.team_id,
      update: false,
      delete: false,
    },
    question_answer: {
      view: (user, question) =>
        user.team_members?.team_id === question.quiz.team_id,
    },
    question_answers: {
      view: false,
    },
  },
  mios: {
    categories: {
      create: false,
      view: (user, category) => {
        console.log(category);
        console.log(user);
        return user.team_members?.team_id === category.team_id;
      },
      update: false,
      delete: false,
    },
    folders: {
      create: false,
      view: (user, folder) =>
        user.team_members?.team_id === folder.category?.team_id,
      update: false,
      delete: false,
    },
    files: {
      create: false,
      view: (user, file) =>
        user.team_members?.team_id === file.folder.category?.team_id,
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
      view: (user, quiz) => user.team_members?.team_id === quiz.team_id,
      update: false,
      delete: false,
    },
    quiz_member: {
      create: true,
    },
    question: {
      create: false,
      view: (user, question) =>
        user.team_members?.team_id === question.quiz.team_id,
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
      view: (user, result) => user.team_members?.id === result.team_member_id,
      update: (user, result) => user.team_members?.id === result.team_member_id,
      delete: (user, result) => user.team_members?.id === result.team_member_id,
    },
    question_answer: {
      view: (user, question) =>
        user.team_members?.team_id === question.quiz.team_id,
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
