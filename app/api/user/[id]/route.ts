"use client";
import { PrismaClient } from "@prisma/client";
import { NextRequest } from "next/server";
import { getUser } from "@prisma/client/sql";
import { useRouter } from "next/router";
const prisma = new PrismaClient();

interface UserPostRequest {
  userId?: number;
  username?: string;
  email?: string;
}

interface UserResponse {
  id: number;
  name: string;
  email: string;
  phone: string|undefined;
  tags: string[];
}



export async function GET(req: NextRequest) {
  const router = useRouter();
  const userId = router.query.id;

  return new Response(JSON.stringify({ id:userId }), {
    status: 400,
    headers: { "Content-Type": "application/json" },
  });
}
