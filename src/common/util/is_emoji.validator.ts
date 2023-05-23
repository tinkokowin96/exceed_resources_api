import { ValidationArguments, ValidatorConstraint, ValidatorConstraintInterface } from 'class-validator';

@ValidatorConstraint({ name: 'validateEmoji', async: false })
export class IsEmoji implements ValidatorConstraintInterface {
  validate(text: string): boolean {
    const emojiRegex =
      /(\u00a9|\u00ae|[\u2000-\u3300]|\ud83c[\ud000-\udfff]|\ud83d[\ud000-\udfff]|\ud83e[\ud000-\udfff])/gi;
    return emojiRegex.test(text);
  }

  defaultMessage?(arg?: ValidationArguments): string {
    return `${arg.value} don't contain emoji`;
  }
}
