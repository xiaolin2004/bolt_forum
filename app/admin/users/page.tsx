import { getUserList } from "@/app/action/User";
import UserManagement from "./cpage";
export default async function page() {
  const users = await getUserList();
  return (
    <UserManagement users={users} />
  );
};
