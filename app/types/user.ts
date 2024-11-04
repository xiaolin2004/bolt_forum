export type cardUser = {
  id: number | undefined;
  name: string;
  avatar: string;
  isLoggedIn: boolean;
};

export type UserProfile = {
  id: number;
  name: string;
  avatar: string;
  email: string;
  phone: string;
  tags: string[];
  createdAt: string;
  updatedAt: string;
}