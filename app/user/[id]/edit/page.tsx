import EditProfilePage from "./c-page";
import { getProfileUser } from "@/app/action/User";
import { getCurrentSession } from "@/app/lib/session";
import { redirect } from "next/navigation";

export default async function page() {
  let session = await getCurrentSession();
  if(session.user == null){
    redirect("/login")
  }
  let profile1 = await getProfileUser(session.user.id)
  if(profile1 == null){
    return <div>用户不存在</div>
  }
  return  (
      <EditProfilePage profile1={profile1}/>
  );
};
