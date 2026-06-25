import bcrypt from "bcryptjs";
import { prisma } from "../../lib/prisma";
import type { ILoginPayload } from "./auth.interface";

const loginUser = async (payload: ILoginPayload) => {
  const { email, password } = payload;
  if (!email || !password) {
    throw new Error("Please Provide Email & password");
  }

  //   is the user exists
  const user = await prisma.user.findFirstOrThrow({
    where: {
      email,
    },
    omit: {
      createdAt: true,
      udpatedAt: true,
    },
  });

  const isPasswordMatched = await bcrypt.compare(password, user.password);

  if (!isPasswordMatched) {
    throw new Error("Incorrect Password");
  }

  return user;
};

export const authService = {
  loginUser,
};
