import { createUser } from "./user/create";
import { getUsers } from "./user/get-multi";
import { getUser } from "./user/get-single";
import { delUser } from "./user/delete";
import { updateUser } from "./user/update";

// team
import { createTeam } from "./team/create";
import { delTeam } from "./team/delete";
import { getTeams } from "./team/get-multi";
import { getTeam } from "./team/get-single";
import { updateTeam } from "./team/update";

// team member
import { createTeamMember } from "./team-member/create";
import { delTeamMember } from "./team-member/delete";
import { getTeamMembers } from "./team-member/get-multi";
import { getTeamMember } from "./team-member/get-single";
import { updateTeamMember } from "./team-member/update";

export = {
  createUser,
  getUser,
  getUsers,
  delUser,
  updateUser,
  createTeam,
  delTeam,
  getTeam,
  getTeams,
  updateTeam,
  createTeamMember,
  getTeamMember,
  getTeamMembers,
  delTeamMember,
  updateTeamMember,
};
