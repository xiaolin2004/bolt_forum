import Image from "next/image";
import { Reply } from "@/types/post";
export default function ReplyList({replies}:{replies:Reply[]}) {
  return (
    <div className="space-y-6">
      {replies.map((reply) => (
        <div key={reply.id} className="border-b pb-4 last:border-0">
          <div className="flex items-center mb-2">
            <div className="relative w-8 h-8 rounded-full overflow-hidden mr-2">
              <Image
                src={reply.avatar}
                alt={reply.author}
                fill
                className="object-cover"
              />
            </div>
            <div>
              <p className="font-medium">{reply.author}</p>
              <p className="text-sm text-gray-500">{reply.timestamp}</p>
            </div>
          </div>
          <p className="text-gray-800 ml-10">{reply.content}</p>
        </div>
      ))}
    </div>
  );
    
}
