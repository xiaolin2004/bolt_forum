import { redirect } from "next/navigation";
import { getCurrentSession } from "@/lib/session";
import InvitationsClient from "./InvitationsClient";
import { getInvitationsByUserId } from "../action/Invitation";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "邀请回答",
  description: "邀请回答",
};

export default async function InvitationsPage() {
  // 模拟从数据库或 API 获取邀请数据
  const session = await getCurrentSession();
  if (!session?.user) {
    return redirect("/login");
  }

  const invitations = await getInvitationsByUserId(session.user.id);

  return (
    <div className="min-h-screen bg-gray-100 py-8">
      <div className="max-w-4xl mx-auto">
        <div className="bg-white rounded-lg shadow-md p-6">
          <h1 className="text-2xl font-bold mb-6">邀请回答</h1>
          <InvitationsClient initialInvitations={invitations} />
        </div>
      </div>
    </div>
  );
}
