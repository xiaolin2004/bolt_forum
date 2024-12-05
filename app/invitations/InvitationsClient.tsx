"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Image from "next/image";
import Link from "next/link";
import { Invitation } from "../../types/invitation";
import { setInvitationStatus } from "../action/Invitation";

interface InvitationsClientProps {
  initialInvitations: Invitation[];
}

export default function InvitationsClient({
  initialInvitations,
}: InvitationsClientProps) {
  const router = useRouter();
  const [invitations, setInvitations] =
    useState<Invitation[]>(initialInvitations);
  const [activeTab, setActiveTab] = useState<"pending" | "accepted">("pending");

  const handleInvitationResponse = async (
    invitationId: string,
    accept: boolean
  ) => {
    try {
      // 调用 Server Action 更新状态
      const status = accept ? "accepted" : "declined";
      await setInvitationStatus(invitationId, status);

      // 更新本地状态
      setInvitations((invitations) =>
        invitations.map((inv) =>
          inv.id === invitationId ? { ...inv, status } : inv
        )
      );

      // 接受邀请时跳转到需求详情
      if (accept) {
        const invitation = invitations.find((inv) => inv.id === invitationId);
        if (invitation) {
          router.push(`/post/${invitation.postId}`);
        }
      }
    } catch (error) {
      console.error("Failed to respond to invitation:", error);
    }
  };

  const pendingInvitations = invitations.filter(
    (inv) => inv.status === "pending"
  );
  const acceptedInvitations = invitations.filter(
    (inv) => inv.status === "accepted"
  );

  return (
    <>
      <div className="flex mb-6">
        <button
          onClick={() => setActiveTab("pending")}
          className={`px-4 py-2 rounded-t-md ${
            activeTab === "pending"
              ? "bg-blue-500 text-white"
              : "bg-gray-200 text-gray-700"
          }`}
        >
          待处理邀请
        </button>
        <button
          onClick={() => setActiveTab("accepted")}
          className={`px-4 py-2 rounded-t-md ${
            activeTab === "accepted"
              ? "bg-blue-500 text-white"
              : "bg-gray-200 text-gray-700"
          }`}
        >
          已接受邀请
        </button>
      </div>

      {activeTab === "pending" && (
        <div className="space-y-6">
          {pendingInvitations.length === 0 ? (
            <div className="text-center py-8 text-gray-500">暂无待处理邀请</div>
          ) : (
            pendingInvitations.map((invitation) => (
              <div
                key={invitation.id}
                className="border rounded-lg p-4 bg-white"
              >
                <div className="flex items-center mb-3">
                  <div className="relative w-8 h-8 rounded-full overflow-hidden mr-3">
                    <Image
                      src="https://api.dicebear.com/9.x/pixel-art/svg"
                      alt={invitation.inviter.name}
                      fill
                      className="object-cover"
                    />
                  </div>
                  <div className="flex-1">
                    <p className="text-sm text-gray-600">
                      <span className="font-medium text-gray-900">
                        {invitation.inviter.name}
                      </span>{" "}
                      邀请你回答
                    </p>
                    <p className="text-sm text-gray-500">
                      {invitation.timestamp}
                    </p>
                  </div>
                </div>

                <h2 className="text-lg font-medium mb-3 hover:text-blue-600">
                  <Link href={`/post/${invitation.postId}`}>
                    {invitation.postTitle}
                  </Link>
                </h2>

                <div className="flex space-x-3">
                  <button
                    onClick={() =>
                      handleInvitationResponse(invitation.id, true)
                    }
                    className="px-4 py-2 bg-blue-500 text-white rounded-md hover:bg-blue-600"
                  >
                    接受邀请
                  </button>
                  <button
                    onClick={() =>
                      handleInvitationResponse(invitation.id, false)
                    }
                    className="px-4 py-2 border border-gray-300 rounded-md hover:bg-gray-50"
                  >
                    婉拒
                  </button>
                </div>
              </div>
            ))
          )}
        </div>
      )}

      {activeTab === "accepted" && (
        <div className="space-y-6">
          {acceptedInvitations.length === 0 ? (
            <div className="text-center py-8 text-gray-500">暂无已接受邀请</div>
          ) : (
            acceptedInvitations.map((invitation) => (
              <div
                key={invitation.id}
                className="border rounded-lg p-4 bg-gray-50"
              >
                <div className="flex items-center mb-3">
                  <div className="relative w-8 h-8 rounded-full overflow-hidden mr-3">
                    <Image
                      src={
                        invitation.inviter.avatar ||
                        "https://api.dicebear.com/9.x/pixel-art/svg"
                      }
                      alt={invitation.inviter.name}
                      fill
                      className="object-cover"
                    />
                  </div>
                  <div className="flex-1">
                    <p className="text-sm text-gray-600">
                      <span className="font-medium text-gray-900">
                        {invitation.inviter.name}
                      </span>{" "}
                      邀请你回答
                    </p>
                    <p className="text-sm text-gray-500">
                      {invitation.timestamp}
                    </p>
                  </div>
                </div>

                <h2 className="text-lg font-medium mb-3 hover:text-blue-600">
                  <Link href={`/post/${invitation.postId}`}>
                    {invitation.postTitle}
                  </Link>
                </h2>
              </div>
            ))
          )}
        </div>
      )}
    </>
  );
}
