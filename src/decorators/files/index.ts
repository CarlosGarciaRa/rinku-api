import {
  registerDecorator,
  ValidationOptions,
  ValidationArguments,
} from 'class-validator';

export function IsFileType(
  allowedTypes: string[],
  validationOptions?: ValidationOptions,
) {
  return function (object: unknown, propertyName: string) {
    registerDecorator({
      name: 'isFileType',
      target: object.constructor,
      propertyName: propertyName,
      options: validationOptions,
      validator: {
        validate(file: Express.Multer.File, args: ValidationArguments) {
          if (file) {
            const fileType = file.mimetype;
            if (!allowedTypes.includes(fileType)) {
              args.value = file;
              return false;
            }
            return true;
          }
          return false;
        },
        defaultMessage(args: ValidationArguments) {
          return `${args.property} must be type: ${allowedTypes.join(', ')}`;
        },
      },
    });
  };
}
export function MaxFileSize(
  maxSize: number,
  validationOptions?: ValidationOptions,
) {
  return function (object: unknown, propertyName: string) {
    registerDecorator({
      name: 'isMaxFileSize',
      target: object.constructor,
      propertyName: propertyName,
      options: validationOptions,
      validator: {
        validate(file: Express.Multer.File, args: ValidationArguments) {
          if (file) {
            return file.size <= maxSize;
          }
          return true; // Skip validation if file is not provided
        },
        defaultMessage(args: ValidationArguments) {
          return `${args.property} must be a file with a maximum size of ${maxSize} bytes`;
        },
      },
    });
  };
}
