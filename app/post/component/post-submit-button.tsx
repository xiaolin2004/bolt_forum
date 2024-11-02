'use client';

// @ts-expect-error
import { useFormStatus } from "react-dom";

export default function PostSubmitButton(){
    const {pending} = useFormStatus();
    return (
      <button
        type="submit"
        disabled={pending}
        className={`px-6 py-2 bg-blue-500 text-white rounded-md hover:bg-blue-600 transition-colors ${
          pending ? "opacity-50 cursor-not-allowed" : ""
        }`}
      >
        {pending ? "发布中..." : "发布"}
      </button>
    );
}

