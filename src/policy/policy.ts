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
type Campaign = Prisma.campaignGetPayload<{}>;

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
  campaign: {
    dataType: Campaign;
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
    campaign: {
      create: true,
      view: true,
      update: true,
      delete: true,
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
    campaign: {
      create: true,
      view: (user, campaign) => user.team_members?.team_id === campaign.team_id,
      update: (user, campaign) =>
        user.team_members?.team_id === campaign.team_id,
      delete: (user, campaign) =>
        user.team_members?.team_id === campaign.team_id,
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
    campaign: {
      create: false,
      view: (user, campaign) => user.team_members?.team_id === campaign.team_id,
      update: false,
      delete: false,
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
    campaign: {
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
