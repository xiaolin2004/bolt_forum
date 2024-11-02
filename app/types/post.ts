export type PostForm = {
  title: string;
  content: string;
};

export type Reply = {
  id: number;
  author: string;
  content: string;
  avatar: string;
  timestamp: string;
};

export type Post = {
  id: string;
  title: string;
  content: string;
  author: string;
  avatar: string;
  timestamp: string;
  replies: Reply[];
};

export type ListPost = {
  id: number;
  title: string;
  author: string;
  replies: number;
  lastReply: string;
};