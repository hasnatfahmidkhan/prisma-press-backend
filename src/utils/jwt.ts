import jwt, { type JwtPayload, type SignOptions } from "jsonwebtoken";
import config from "../config";

const createJWTToken = (
  payload: JwtPayload,
  secret: string,
  expiresIn: SignOptions,
) => {
  const token = jwt.sign(payload, secret, {
    expiresIn,
  } as SignOptions);

  return token;
};

const verifyJWTToken = (accessToken: string, secret: string) => {
  try {
    const payload = jwt.verify(accessToken, secret);
    return payload;
  } catch (error: any) {
    console.log("Token verification failed!");
    throw new Error(error.message);
  }
};

export const jwtUtils = {
  createJWTToken,
  verifyJWTToken,
};
