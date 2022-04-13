type User = {
  permissions: string[];
  roles: string[];
};

type validateUserPermissionParams = {
  user: User;
  permissions?: string[];
  roles?: string[];
};

export function validateUserPermission({
  user,
  permissions = [],
  roles = [],
}: validateUserPermissionParams) {
  if (permissions.length > 0) {
    const hasAllPermission = permissions.every((permission) =>
      user.permissions.includes(permission)
    );

    if (!hasAllPermission) return false;
  }
  if (roles.length > 0) {
    const hasAllRoles = roles.some((roles) => user.roles.includes(roles));

    if (!hasAllRoles) return false;
  }

  return true;
}
