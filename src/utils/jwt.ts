import jwt from "jsonwebtoken";
import type { SignOptions } from "jsonwebtoken";
import config from "../config/env";

export const signAccessToken = (userId: string): string => {
  return jwt.sign({ userId }, config.jwt.accessSecret as string, {
    expiresIn: config.jwt.accessExpiresIn as SignOptions["expiresIn"],
  });
};

export const signRefreshToken = (userId: string): string => {
  return jwt.sign({ userId }, config.jwt.refreshSecret as string, {
    expiresIn: config.jwt.refreshExpiresIn as SignOptions["expiresIn"],
  });
};

export const verifyAccessToken = (token: string): { userId: string } => {
  return jwt.verify(token, config.jwt.accessSecret as string) as { userId: string };
};

export const verifyRefreshToken = (token: string): { userId: string } => {
  return jwt.verify(token, config.jwt.refreshSecret as string) as { userId: string };
};