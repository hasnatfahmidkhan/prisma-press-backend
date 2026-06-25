import bcrypt from "bcryptjs";
import { prisma } from "../../lib/prisma";
import type { IUser } from "./user.interface";
import config from "../../config";

const createUser = async (payload: IUser) => {
  const { name, email, password, profilePhoto } = payload;
  // is user exists
  const isUserExists = await prisma.user.findUnique({
    where: {
      email,
    },
  });

  if (isUserExists) {
    throw new Error("User already exists");
  }

  const hashPassword = await bcrypt.hash(
    password,
    Number(config.bcrypt_salt_rounds),
  );

  const createdUser = await prisma.user.create({
    data: {
      name,
      email,
      password: hashPassword,
      profile: {
        create: { profilePhoto },
      },
    },
  });

  //   await prisma.profile.create({
  //     data: {
  //       userId: createdUser.id,
  //       profilePhoto: profilePhoto,
  //     },
  //   });

  const user = await prisma.user.findUnique({
    where: {
      id: createdUser.id,
      email: createdUser.email || email,
    },
    omit: {
      password: true,
      createdAt: true,
      udpatedAt: true,
    },
    include: {
      profile: {
        omit: {
          createdAt: true,
          updatedAt: true,
        },
      },
    },
  });
  return user;
};

export const userService = {
  createUser,
};
