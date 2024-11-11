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
}

export type User = {
  id: string;
  name: string;
  email: string;
  role: string;
  status: string;
  joinDate: string;
}

export type ListUser = {
  id: number;
  name: string;
  avatar: string;
  email: string;
  created_at: string;
  user_type_id: number;
}