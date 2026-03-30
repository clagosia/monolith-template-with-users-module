import {
  ExceptionFilter,
  Catch,
  ArgumentsHost,
  HttpException,
  HttpStatus,
} from '@nestjs/common';
import { Response } from 'express';
import { BaseError } from '../errors/base-error';
import {
  CredentialNotFoundError,
  UserNotFoundError,
  RoleNotFoundError,
  PermissionNotFoundError,
  ActionNotFoundError,
  SourceNotFoundError,
  AssociationNotFoundError,
  InvalidCredentialsError,
  InvalidCurrentPasswordError,
  InvalidResetTokenError,
  ResetTokenExpiredError,
  UsernameConflictError,
  EmailConflictError,
  UserOrEmailConflictError,
  DuplicateRoleError,
  DuplicatePermissionError,
  DuplicateActionError,
  DuplicateSourceError,
  DuplicateAssignmentError,
} from '../errors/domain-errors';
import { UnexpectedError } from '../errors/unexpected-error';

const NOT_FOUND_ERRORS = [
  CredentialNotFoundError,
  UserNotFoundError,
  RoleNotFoundError,
  PermissionNotFoundError,
  ActionNotFoundError,
  SourceNotFoundError,
  AssociationNotFoundError,
];

const CONFLICT_ERRORS = [
  UsernameConflictError,
  EmailConflictError,
  UserOrEmailConflictError,
  DuplicateRoleError,
  DuplicatePermissionError,
  DuplicateActionError,
  DuplicateSourceError,
  DuplicateAssignmentError,
];

const BAD_REQUEST_ERRORS = [InvalidResetTokenError, ResetTokenExpiredError];

const UNAUTHORIZED_ERRORS = [
  InvalidCredentialsError,
  InvalidCurrentPasswordError,
];

function getHttpStatusFromBaseError(error: BaseError): number {
  if (NOT_FOUND_ERRORS.some((cls) => error instanceof cls)) {
    return HttpStatus.NOT_FOUND;
  }
  if (CONFLICT_ERRORS.some((cls) => error instanceof cls)) {
    return HttpStatus.CONFLICT;
  }
  if (BAD_REQUEST_ERRORS.some((cls) => error instanceof cls)) {
    return HttpStatus.BAD_REQUEST;
  }
  if (UNAUTHORIZED_ERRORS.some((cls) => error instanceof cls)) {
    return HttpStatus.UNAUTHORIZED;
  }
  if (error instanceof UnexpectedError) {
    return HttpStatus.INTERNAL_SERVER_ERROR;
  }
  return HttpStatus.INTERNAL_SERVER_ERROR;
}

@Catch()
export class AllExceptionsFilter implements ExceptionFilter {
  catch(exception: unknown, host: ArgumentsHost) {
    const ctx = host.switchToHttp();
    const response = ctx.getResponse<Response>();

    if (exception instanceof BaseError) {
      const status = getHttpStatusFromBaseError(exception);
      response.status(status).json({
        statusCode: status,
        errorCode: exception.errorCode,
        message: exception.message,
        timestamp: new Date().toISOString(),
      });
      return;
    }

    const status =
      exception instanceof HttpException
        ? exception.getStatus()
        : HttpStatus.INTERNAL_SERVER_ERROR;

    const message =
      exception instanceof HttpException
        ? exception.getResponse()
        : 'Internal server error';

    response.status(status).json({
      statusCode: status,
      message:
        typeof message === 'string'
          ? message
          : (message as Record<string, unknown>).message || message,
      timestamp: new Date().toISOString(),
    });
  }
}
