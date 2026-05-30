import StatCard from "@/components/statcard";
import PageHeader from "@/components/pageheader";

async function getDashboardSummary() {
  const res = await fetch("http://localhost:3000/api/dashboard/summary", {
    cache: "no-store",
  });

  if (!res.ok) {
    throw new Error("Failed to fetch dashboard summary");
  }

  return res.json();
}

export default async function DashboardPage() {
  const data = await getDashboardSummary();
  const summary = data.summary;

  return (
    <div>
      <PageHeader
        title="Dashboard"
        description="Overview of university society activities"
      />

      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4">
        <StatCard title="Total Societies" value={summary.totalSocieties} />
        <StatCard title="Total Members" value={summary.totalMembers} />
        <StatCard title="Total Events" value={summary.totalEvents} />
        <StatCard
          title="Pending Registrations"
          value={summary.pendingRegistrations}
        />
        <StatCard title="Total Tasks" value={summary.totalTasks} />
        <StatCard title="Pending Tasks" value={summary.pendingTasks} />
        <StatCard title="Total Income" value={`Rs. ${summary.totalIncome}`} />
        <StatCard title="Balance" value={`Rs. ${summary.balance}`} />
      </div>
    </div>
  );
}
