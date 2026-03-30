import { BaseError } from './base-error';
import { UnexpectedError } from './unexpected-error';

export function toBaseError(error: unknown): BaseError {
  if (error instanceof BaseError) {
    return error;
  }

  if (error instanceof Error) {
    return new UnexpectedError(error.message, error);
  }

  return new UnexpectedError(String(error), error);
}
