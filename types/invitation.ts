export type Invitation = {
  id: string;
  postId: string;
  postTitle: string;
  inviter: {
    name: string;
    avatar: string;
  };
  timestamp: string;
  status: "pending" | "accepted" | "declined";
};
