import { IResponseMessage } from '../interfaces/response-message.interface';

export function ResponseMessage(message: string): IResponseMessage {
  return {
    message,
  };
}
