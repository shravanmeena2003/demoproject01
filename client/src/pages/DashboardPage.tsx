import { StatsCards } from '@/components/leads/StatsCards';
import { Button } from '@/components/ui/Button';
import { useLeadStats } from '@/hooks/useLeads';
import { LeadSource, LeadStatus } from '@/types';

export function DashboardPage() {
  const { data: stats, isLoading, isError, refetch } = useLeadStats();

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-lg font-semibold">Overview</h2>
        <p className="text-sm text-slate-500">Your lead pipeline at a glance</p>
      </div>

      {isError ? (
        <div className="card flex flex-col items-center gap-3 text-center text-rose-600">
          <p>Failed to load dashboard stats.</p>
          <Button variant="secondary" onClick={() => refetch()}>
            Retry
          </Button>
        </div>
      ) : (
        <StatsCards stats={stats} isLoading={isLoading} />
      )}

      {stats && !isError && (
        <div className="grid gap-6 lg:grid-cols-2">
          <div className="card">
            <h3 className="mb-4 font-semibold">Leads by Status</h3>
            <div className="space-y-3">
              {Object.values(LeadStatus).map((status) => {
                const count = stats.byStatus[status];
                const pct = stats.total ? Math.round((count / stats.total) * 100) : 0;
                return (
                  <div key={status}>
                    <div className="mb-1 flex justify-between text-sm">
                      <span>{status}</span>
                      <span className="text-slate-500">
                        {count} ({pct}%)
                      </span>
                    </div>
                    <div className="h-2 overflow-hidden rounded-full bg-slate-100 dark:bg-slate-800">
                      <div
                        className="h-full rounded-full bg-brand-500 transition-all"
                        style={{ width: `${pct}%` }}
                      />
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

          <div className="card">
            <h3 className="mb-4 font-semibold">Leads by Source</h3>
            <div className="space-y-3">
              {Object.values(LeadSource).map((source) => {
                const count = stats.bySource[source];
                return (
                  <div
                    key={source}
                    className="flex items-center justify-between rounded-lg bg-slate-50 px-4 py-3 dark:bg-slate-800/50"
                  >
                    <span className="text-sm font-medium">{source}</span>
                    <span className="text-lg font-bold">{count}</span>
                  </div>
                );
              })}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
