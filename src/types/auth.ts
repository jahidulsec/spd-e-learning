import { $Enums } from "@prisma/client";

export interface AuthUser {
  id: string;
  teamMemberId?:string,
  name?: string;
  role: $Enums.role;
  mobile?: string;
  iat: number;
}
