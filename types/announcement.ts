
export type Announcement = {
  title: string;
  content: string;
  createAt: string;
  updateAt: string;
  author: number;
};

export type BriefAnnouncement = {
  title: string;
  date: string;
  id: number;
}


export type ManageAnnouncement = {
  id: string;
  title: string;
  content: string;
  createAt: string;
  updateAt: string;
  author: number;
};