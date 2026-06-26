import bcrypt from "bcryptjs";
import { prisma } from "../../lib/prisma";
import type { IUser } from "./user.interface";
import config from "../../config";
import type { IProfileUpdatePayload } from "../auth/auth.interface";

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
      updatedAt: true,
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

const getUserProfileFromDB = async (userId: string) => {
  const userProfile = await prisma.user.findFirstOrThrow({
    where: {
      id: userId,
    },
    omit: {
      password: true,
      createdAt: true,
      updatedAt: true,
    },
    include: {
      profile: true,
    },
  });

  return userProfile;
};

const updateProfileIntoDB = async (
  userId: string,
  payload: IProfileUpdatePayload,
) => {
  const { name, email, profilePhoto, bio } = payload;

  const user = await prisma.user.update({
    where: {
      id: userId,
    },
    data: {
      name,
      email,
      profile: {
        update: {
          bio,
          profilePhoto,
        },
      },
    },
    omit: {
      password: true,
    },
    include: {
      profile: true,
    },
  });

  return user;
};

export const userService = {
  createUser,
  getUserProfileFromDB,
  updateProfileIntoDB,
};
