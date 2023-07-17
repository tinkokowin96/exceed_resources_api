import {
  ValidationArguments,
  ValidationOptions,
  ValidatorConstraint,
  ValidatorConstraintInterface,
  registerDecorator,
} from 'class-validator';

@ValidatorConstraint({ name: 'isEmoji', async: false })
class IsEmojiConstraint implements ValidatorConstraintInterface {
  validate(text: string): boolean {
    const emojiRegex =
      /(\u00a9|\u00ae|[\u2000-\u3300]|\ud83c[\ud000-\udfff]|\ud83d[\ud000-\udfff]|\ud83e[\ud000-\udfff])/gi;
    return emojiRegex.test(text);
  }

  defaultMessage?(arg?: ValidationArguments): string {
    return `${arg.value} don't contain emoji`;
  }
}

export function IsEmoji(validationOptions?: ValidationOptions) {
  return function (object: any, propertyName: string): void {
    registerDecorator({
      name: 'isYear',
      target: object.constructor,
      propertyName: propertyName,
      options: validationOptions,
      validator: IsEmojiConstraint,
    });
  };
}
