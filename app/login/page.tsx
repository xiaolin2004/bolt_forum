import { redirect } from "next/navigation";
import { getCurrentSession } from "../lib/session";
import LoginPage from "./cpage";

export default async function page() {
  const session = await getCurrentSession();
  if (session != null) {
    redirect("/");
  }else{
    return (
      <LoginPage />
    )
  }
};
