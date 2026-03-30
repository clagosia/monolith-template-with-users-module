import { Logger } from '@nestjs/common';
import { BaseError } from '../errors/base-error';
import { toBaseError } from '../errors/to-base-error';
import { UnexpectedError } from '../errors/unexpected-error';

type BaseErrorConstructor = new (...args: never[]) => BaseError;

export function HandleErrors(
  handledErrors: BaseErrorConstructor[] = [],
): MethodDecorator {
  return (
    target: object,
    propertyKey: string | symbol,
    descriptor: PropertyDescriptor,
  ) => {
    const className = target.constructor.name;
    const methodName = String(propertyKey);
    const originalMethod = descriptor.value as (
      ...args: unknown[]
    ) => Promise<unknown>;

    descriptor.value = async function (
      this: unknown,
      ...args: unknown[]
    ): Promise<unknown> {
      try {
        const result: unknown = await originalMethod.apply(this, args);
        return result;
      } catch (error: unknown) {
        const baseError = toBaseError(error);

        const isHandled = handledErrors.some(
          (errorClass) => baseError instanceof errorClass,
        );

        const logger = new Logger(className);

        if (isHandled) {
          logger.log(
            `Handled error in ${className}.${methodName}: [${baseError.errorCode}] ${baseError.message}`,
          );
          throw baseError;
        }

        logger.warn(
          `Unhandled error in ${className}.${methodName}: [${baseError.errorCode}] ${baseError.message}`,
        );
        throw new UnexpectedError(
          `Unexpected error in ${className}.${methodName}: ${baseError.message}`,
          error,
        );
      }
    };

    return descriptor;
  };
}
