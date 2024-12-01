"use server";

import { prisma } from "@/prisma/client";
import { Invitation } from "@/types/invitation";

/**
 * Update the status of a specific invitation.
 * @param invitationId - The ID of the invitation to update.
 * @param status - The new status ("accepted" or "declined").
 */
export async function setInvitationStatus(
  invitationId: string,
  status: "accepted" | "declined"
): Promise<void> {
  try {
    const statusId = status === "accepted" ? 2 : 3; // Map status to ID

    await prisma.post_invite_user.update({
      where: { id: parseInt(invitationId, 10) }, // Ensure the ID is an integer
      data: { status_id: statusId },
    });
  } catch (error) {
    console.error("Failed to update invitation status:", error);
    throw new Error("Failed to update invitation status");
  }
}

/**
 * Send invitations for a specific post to multiple users.
 * @param postId - The ID of the post for which invitations are sent.
 * @param userIds - An array of user IDs to invite.
 */
export async function sendInvitations(
  postId: number,
  userIds: number[]
): Promise<void> {
  try {
    await prisma.post_invite_user.createMany({
      data: userIds.map((userId) => ({
        post_id: postId,
        invitee_id: userId,
        status_id: 1, // Default status: "pending"
        timestamp: new Date(),
      })),
      skipDuplicates: true, // Avoid duplicate invitations
    });
  } catch (error) {
    console.error("Error sending invitations:", error);
    throw new Error("Failed to send invitations");
  }
}

/**
 * Get all invitations for a specific user.
 * @param userId - The ID of the user whose invitations are retrieved.
 * @returns A list of invitations with post and inviter details.
 */
export async function getInvitationsByUserId(
  userId: number
): Promise<Invitation[]> {
  try {
    const invitations = await prisma.post_invite_user.findMany({
      where: { invitee_id: userId },
      include: {
        post: {
          select: {
            id: true,
            title: true,
            user: {
              select: { name: true, avatar: true }, // Inviter details
            },
          },
        },
        status: {
          select: { value: true }, // Invitation status
        },
      },
    });

    return invitations.map((invitation) => ({
      id: invitation.id.toString(),
      postId: invitation.post.id.toString(),
      postTitle: invitation.post.title,
      inviter: {
        name: invitation.post.user.name,
        avatar: invitation.post.user.avatar || "", // Default avatar fallback
      },
      timestamp: invitation.timestamp.toISOString(),
      status: invitation.status.value as "pending" | "accepted" | "declined", // Type-safe mapping
    }));
  } catch (error) {
    console.error("Failed to fetch invitations:", error);
    throw new Error("Failed to fetch invitations");
  }
}
