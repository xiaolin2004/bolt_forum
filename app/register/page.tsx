import { redirect } from "next/navigation";
import { getCurrentSession } from "../../lib/session";
import RegisterPage from "./cpage";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "注册",
  description: "注册",
};

export default async function page() {
  const session = await getCurrentSession();
  if (session.session != null) {
    redirect("/");
  } else {
    return <RegisterPage />;
  }
}
