import { redirect } from "next/navigation";
import { getCurrentSession } from "../../lib/session";
import LoginPage from "./cpage";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "登录",
  description: "登录",
};

export default async function page() {
  const session = await getCurrentSession();
  if (session.session != null) {
    redirect("/");
  } else {
    return <LoginPage />;
  }
}
