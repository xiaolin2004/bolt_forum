import { getUserList } from "@/app/action/User";
import UserManagement from "./cpage";
import type { Metadata } from "next";

const metadata: Metadata = {
  title: "用户管理",
  description: "用户管理",
};
export default async function page() {
  const users = await getUserList();
  return <UserManagement users={users} />;
}
