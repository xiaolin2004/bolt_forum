"use server";
import {prisma} from "@/prisma/client";
import { Invitation } from "../../types/invitation";

export async function setInvitationStatus(invitationId: string, status: "accepted" | "declined") {
  // Update the status of the invitation
}