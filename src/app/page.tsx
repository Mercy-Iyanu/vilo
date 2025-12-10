import Link from "next/link";

export default function Home() {
  return (
    <Link className="hover:underline" href="/owner/dashboard">
      Create an event
    </Link>
  );
}
