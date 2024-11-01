import { PrismaClient } from "@prisma/client";
import { NextRequest } from "next/server";

const prisma = new PrismaClient();

interface LogInRequest {
  email: string;
  password: string;
}
export async function POST(req: NextRequest) {
  const { email, password }: LogInRequest = await req.json();
  const user = await prisma.user.findUnique({
    where: {
      email:email
    },
  });
if (!user) {
    return new Response("User not found", { status: 404 });
}
if (user.password !== password) {
    return new Response(JSON.stringify({ message: "Incorrect password" }), {
        status: 401,
        headers: { "Content-Type": "application/json" },
    });
}
return new Response(JSON.stringify({ message: "Logged in" }), {
    status: 200,
    headers: { "Content-Type": "application/json" },
});
}
