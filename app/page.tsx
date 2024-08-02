import Link from "next/link";

type linkListType = {
  url: string;
  name: string;
};

export default function Home() {
  const linkList: linkListType[] = [
    { url: "/delivery", name: "Delivery" },
    { url: "/material", name: "T-1 Report Receipt" },
    // { url: "/material-issue", name: "T-1 Report Issue" },
    { url: "/attendance", name: "Attendance" },
    { url: "/production", name: "CompleteRate" },
    { url: "/mainlayout", name: "MainLayout" },
    { url: "/repair", name: "Repair Rate" },
    // { url: "/dashboard", name: "Dashboard" },
  ];
  return (
    <main className="bg-[url('/assets/images/mainbg.png')] bg-cover aspect-auto w-full h-screen text-white">
      <ul className="flex flex-col">
        {linkList.map(({ url, name }) => (
          <LinkItem url={url} name={name} key={url} />
        ))}
      </ul>
    </main>
  );
}

function LinkItem({ url, name }: linkListType) {
  return (
    <li>
      <Link href={url}>{name}</Link>
    </li>
  );
}
