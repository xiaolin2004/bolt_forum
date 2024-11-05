"use client";
import { redirect } from "next/navigation";

export default function EditButton({user_id}:{user_id:number}) {
  return (
    <button
      onClick={() => redirect(`/user/${user_id.toString()}/edit`)}
      className="mt-2 px-4 py-2 bg-blue-500 text-white rounded-md hover:bg-blue-600"
    >
      编辑资料
    </button>
  );
}

