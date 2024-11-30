import { redirect } from "next/navigation";
import { getCurrentSession } from "../../lib/session";
import RegisterPage from "./cpage";

export default async function page() {
    return <RegisterPage />;
}
