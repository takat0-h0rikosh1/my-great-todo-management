import {
  ValidatorConstraint,
  ValidatorConstraintInterface,
  ValidationOptions,
  registerDecorator,
  ValidationArguments,
} from 'class-validator';
import { getTodayString } from '../utils/date.utility';

@ValidatorConstraint({ name: 'isFuture', async: false })
class IsFutureConstraint implements ValidatorConstraintInterface {
  validate(value: Date) {
    const today = new Date(getTodayString());
    return new Date(value).getTime() >= today.getTime();
  }
}

export function IsFuture(validationOptions?: ValidationOptions) {
  return function (object: any, propertyName: string) {
    registerDecorator({
      target: object.constructor,
      propertyName: propertyName,
      options: validationOptions,
      validator: IsFutureConstraint,
    });
  };
}

export function IsBefore(
  property: string,
  validationOptions?: ValidationOptions,
) {
  return function (object: object, propertyName: string) {
    registerDecorator({
      name: 'isBefore',
      target: object.constructor,
      propertyName: propertyName,
      constraints: [property],
      options: validationOptions,
      validator: {
        validate(value: any, args: ValidationArguments) {
          const [relatedPropertyName] = args.constraints;
          const relatedValue = (args.object as any)[relatedPropertyName];
          if (value && relatedValue) {
            return value < relatedValue;
          }
          return true;
        },
        defaultMessage(args: ValidationArguments) {
          const [relatedPropertyName] = args.constraints;
          return `${relatedPropertyName} must be after ${args.property}`;
        },
      },
    });
  };
}
