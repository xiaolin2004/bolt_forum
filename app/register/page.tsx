import { redirect } from "next/navigation";
import { getCurrentSession } from "../../lib/session";
import RegisterPage from "./cpage";

export default async function page() {
  const session = await getCurrentSession();
  if (session.session != null) {
    redirect("/");
  } else {
    return <RegisterPage />;
  }
}
