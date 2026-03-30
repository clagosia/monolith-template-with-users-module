import { BaseError } from './base-error';

// ─── Auth Domain Errors ──────────────────────────────────────

export class CredentialNotFoundError extends BaseError {
  readonly errorCode = 'CREDENTIAL_NOT_FOUND';
  readonly description = 'User credentials were not found';

  constructor(message = 'User credentials not found') {
    super(message);
  }
}

export class InvalidCredentialsError extends BaseError {
  readonly errorCode = 'INVALID_CREDENTIALS';
  readonly description = 'The provided credentials are invalid';

  constructor(message = 'Invalid credentials') {
    super(message);
  }
}

export class InvalidCurrentPasswordError extends BaseError {
  readonly errorCode = 'INVALID_CURRENT_PASSWORD';
  readonly description = 'The current password provided is incorrect';

  constructor(message = 'Current password is incorrect') {
    super(message);
  }
}

export class InvalidResetTokenError extends BaseError {
  readonly errorCode = 'INVALID_RESET_TOKEN';
  readonly description = 'The password reset token is invalid or expired';

  constructor(message = 'Invalid or expired reset token') {
    super(message);
  }
}

export class ResetTokenExpiredError extends BaseError {
  readonly errorCode = 'RESET_TOKEN_EXPIRED';
  readonly description = 'The password reset token has expired';

  constructor(message = 'Reset token has expired') {
    super(message);
  }
}

// ─── User Domain Errors ──────────────────────────────────────

export class UserNotFoundError extends BaseError {
  readonly errorCode = 'USER_NOT_FOUND';
  readonly description = 'The requested user was not found';

  constructor(message = 'User not found') {
    super(message);
  }
}

export class UsernameConflictError extends BaseError {
  readonly errorCode = 'USERNAME_CONFLICT';
  readonly description = 'The username is already taken';

  constructor(message = 'Username already exists') {
    super(message);
  }
}

export class EmailConflictError extends BaseError {
  readonly errorCode = 'EMAIL_CONFLICT';
  readonly description = 'The email is already in use';

  constructor(message = 'Email already exists') {
    super(message);
  }
}

export class UserOrEmailConflictError extends BaseError {
  readonly errorCode = 'USER_OR_EMAIL_CONFLICT';
  readonly description = 'The username or email is already in use';

  constructor(message = 'Username or email already exists') {
    super(message);
  }
}

// ─── Access Control Domain Errors ────────────────────────────

export class RoleNotFoundError extends BaseError {
  readonly errorCode = 'ROLE_NOT_FOUND';
  readonly description = 'The requested role was not found';

  constructor(message = 'Role not found') {
    super(message);
  }
}

export class PermissionNotFoundError extends BaseError {
  readonly errorCode = 'PERMISSION_NOT_FOUND';
  readonly description = 'The requested permission was not found';

  constructor(message = 'Permission not found') {
    super(message);
  }
}

export class ActionNotFoundError extends BaseError {
  readonly errorCode = 'ACTION_NOT_FOUND';
  readonly description = 'The requested action was not found';

  constructor(message = 'Action not found') {
    super(message);
  }
}

export class SourceNotFoundError extends BaseError {
  readonly errorCode = 'SOURCE_NOT_FOUND';
  readonly description = 'The requested source was not found';

  constructor(message = 'Source not found') {
    super(message);
  }
}

export class DuplicateRoleError extends BaseError {
  readonly errorCode = 'DUPLICATE_ROLE';
  readonly description = 'A role with this name already exists';

  constructor(name: string) {
    super(`Role "${name}" already exists`);
  }
}

export class DuplicatePermissionError extends BaseError {
  readonly errorCode = 'DUPLICATE_PERMISSION';
  readonly description = 'A permission with this name already exists';

  constructor(name: string) {
    super(`Permission "${name}" already exists`);
  }
}

export class DuplicateActionError extends BaseError {
  readonly errorCode = 'DUPLICATE_ACTION';
  readonly description = 'An action with this name already exists';

  constructor(name: string) {
    super(`Action "${name}" already exists`);
  }
}

export class DuplicateSourceError extends BaseError {
  readonly errorCode = 'DUPLICATE_SOURCE';
  readonly description = 'A source with this name already exists';

  constructor(name: string) {
    super(`Source "${name}" already exists`);
  }
}

export class DuplicateAssignmentError extends BaseError {
  readonly errorCode = 'DUPLICATE_ASSIGNMENT';
  readonly description = 'This association already exists';

  constructor(message = 'Association already exists') {
    super(message);
  }
}

export class AssociationNotFoundError extends BaseError {
  readonly errorCode = 'ASSOCIATION_NOT_FOUND';
  readonly description = 'The requested association was not found';

  constructor(message = 'Association not found') {
    super(message);
  }
}
