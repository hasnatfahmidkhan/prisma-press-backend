import type { Res } from "../types";

export const setAuthCookies = (
  res: Res,
  name: "accessToken" | "refreshToken",
  token: string,
) => {
  res.cookie(name, token, {
    httpOnly: true,
    secure: false,
    sameSite: "none",
    maxAge:
      name === "accessToken"
        ? 1000 * 60 * 60 * 24 * 1
        : 1000 * 60 * 60 * 24 * 7,
  });
};
