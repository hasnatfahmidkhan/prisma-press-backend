export interface ILoginPayload {
  email: string;
  password: string;
}

export interface IProfileUpdatePayload {
  name: string;
  email: string;
  bio: string;
  profilePhoto: string;
}
