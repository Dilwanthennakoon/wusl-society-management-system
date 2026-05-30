import Link from "next/link";

const menuItems = [
  { name: "Dashboard", href: "/dashboard" },
  { name: "Societies", href: "/dashboard/societies" },
  { name: "Registrations", href: "/dashboard/registrations" },
  { name: "Members", href: "/dashboard/members" },
  { name: "Events", href: "/dashboard/events" },
  { name: "Tasks", href: "/dashboard/tasks" },
  { name: "Finance", href: "/dashboard/finance" },
  { name: "Reports", href: "/dashboard/reports" },
];

export default function Sidebar() {
  return (
    <aside className="hidden min-h-screen w-64 bg-slate-900 text-white md:block">
      <div className="border-b border-slate-700 p-6">
        <h1 className="text-xl font-bold">WUSL Societies</h1>
        <p className="mt-1 text-sm text-slate-300">Management System</p>
      </div>

      <nav className="p-4">
        {menuItems.map((item) => (
          <Link
            key={item.href}
            href={item.href}
            className="mb-2 block rounded-lg px-4 py-3 text-sm font-medium text-slate-200 hover:bg-slate-800 hover:text-white"
          >
            {item.name}
          </Link>
        ))}
      </nav>
    </aside>
  );
}
