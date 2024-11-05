"use client";

// @ts-expect-error
import { useFormStatus } from "react-dom";

export default function EditSubmitButton() {
  const { pending } = useFormStatus();
  return (
    <button
      type="submit"
      disabled={pending}
      className="px-4 py-2 bg-blue-500 text-white rounded-md hover:bg-blue-600"
    >
      {pending ? "保存中..." : "保存修改"}
    </button>
  );
}