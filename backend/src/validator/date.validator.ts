import {
  ValidatorConstraint,
  ValidatorConstraintInterface,
  ValidationOptions,
  registerDecorator,
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
