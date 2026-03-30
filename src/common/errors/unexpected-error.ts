import { BaseError } from './base-error';

export class UnexpectedError extends BaseError {
  readonly errorCode = 'UNEXPECTED_ERROR';
  readonly description: string;

  constructor(
    message?: string,
    public readonly originalError?: unknown,
  ) {
    super(message ?? 'An unexpected error occurred');
    this.description = message ?? 'An unexpected error occurred';
  }
}
