export interface IJwtData {
  id: string;
}
export interface IJwtPayload extends IJwtData {
  iat: number;
  exp: number;
}
