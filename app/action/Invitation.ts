"use server";
import { prisma } from "@/prisma/client";
import { Invitation } from "../../types/invitation";

export async function setInvitationStatus(
  invitationId: string,
  status: "accepted" | "declined"
) {
  // Update the status of the invitation
}

async function sendInvitations(postId: number, userIds: number[]) {
  try {
    await prisma.post_invite_user.createMany({
      data: userIds.map((userId) => ({
        post_id: Number(postId),
        invitee_id: Number(userId),
        status_id: 1, // 默认状态为 "pending"
        timestamp: new Date(),
      })),
      skipDuplicates: true, // 避免重复邀请同一用户
    });
  } catch (error) {
    console.error("Error sending invitations:", error);
    throw new Error("Failed to send invitations");
  }
}

export async function getInvitationsByUserId(
  userId: number
): Promise<Invitation[]> {
  const invitations = await prisma.post_invite_user.findMany({
    where: { invitee_id: userId }, // 查询被邀请的用户
    include: {
      post: {
        select: {
          id: true,
          title: true,
          user: {
            select: { name: true, avatar: true }, // 邀请者信息
          },
        },
      },
      status: {
        select: { value: true }, // 邀请状态
      },
    },
  });

  return invitations.map((invitation) => ({
    id: invitation.id.toString(),
    postId: invitation.post.id.toString(),
    postTitle: invitation.post.title,
    inviter: {
      name: invitation.post.user.name,
      avatar: invitation.post.user.avatar || "@/public/default_avatar.png", // 设置默认头像
    },
    timestamp: invitation.timestamp.toISOString(),
    status: invitation.status.value as "pending" | "accepted" | "declined", // 确保类型匹配
  }));
}
