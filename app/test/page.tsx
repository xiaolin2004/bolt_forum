import Image from "next/image";

export default function Avatar() {
  const baseURL = "https://avatars.dicebear.com/api/adventurer";
  const randomAvatarURL = `${baseURL}/random.svg`;

  return (
    <div>
      <Image
        src="https://api.dicebear.com/9.x/pixel-art/svg"
        alt="Random Avatar"
        width={100}
        height={100}
      />
    </div>
  );
}
