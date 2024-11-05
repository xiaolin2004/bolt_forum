import { redirect } from "next/navigation";

export default function EditAvatarButton({ user_id }: { user_id: number }) {
  return (
    <button
      onClick={() => redirect(`/user/${user_id.toString()}/edit/avatar`)}
      className="mt-2 px-4 py-2 bg-blue-500 text-white rounded-md hover:bg-blue-600"
    >
      更换头像
    </button>
  );
}