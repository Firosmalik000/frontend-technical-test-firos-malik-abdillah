export function DashboardPage() {
  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-semibold tracking-tight">Dashboard</h1>

        <p className="mt-1 text-sm text-muted-foreground">Overview of procurement and inventory activity.</p>
      </div>

      <section>
        <h2 className="text-sm font-semibold">Procurement Overview</h2>
      </section>

      <section>
        <h2 className="text-sm font-semibold">Recent Purchase Requests</h2>
      </section>
    </div>
  );
}
