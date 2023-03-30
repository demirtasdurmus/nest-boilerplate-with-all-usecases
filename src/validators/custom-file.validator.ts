import { FileValidator } from '@nestjs/common';

export type TValidationOptions = Record<string, any>;

export class CustomFileValidator extends FileValidator<TValidationOptions> {
  constructor(protected readonly validationOptions: TValidationOptions) {
    super(validationOptions);
  }

  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  isValid(file?: Express.Multer.File): boolean | Promise<boolean> {
    console.log('Custom Validating file', this.validationOptions);
    // do some validation here
    return true;
  }
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  buildErrorMessage(file: any): string {
    throw new Error('Method not implemented.');
  }
}
