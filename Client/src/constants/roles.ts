export const ROLE = {
  ADMIN: 'admin',
  MEMBER: 'member',
} as const;

export type Role = typeof ROLE[keyof typeof ROLE];

export const ROLES: Role[] = [ROLE.ADMIN, ROLE.MEMBER];

export default ROLE;
