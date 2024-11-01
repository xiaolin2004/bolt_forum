import { PrismaClient } from "@prisma/client";
import { NextRequest } from "next/server";

const prisma = new PrismaClient();

interface RegisterRequest {
  name: string;
  email: string;
  password: string;
}
export async function POST(req: NextRequest) {
  const { name, email, password }: RegisterRequest = await req.json();
  const user = await prisma.user.findUnique({
    where: {
      email: email,
    },
  });
if (user) {
    return new Response(JSON.stringify({ message: "User already exists" }), {
        status: 400,
        headers: { "Content-Type": "application/json" },
    });
}
await prisma.user.create({
    data: {
        name,
        email,
        password,
        created_at: new Date(),
        updated_at: new Date(),
    },
});
return new Response(JSON.stringify({ message: "注册成功" }), {
    status: 200,
    headers: { "Content-Type": "application/json" },
});
}
