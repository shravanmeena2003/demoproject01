import { Users, TrendingUp, Target, AlertCircle } from 'lucide-react';
import { LeadStats, LeadStatus } from '@/types';
import { Skeleton } from '@/components/ui/Skeleton';

interface StatsCardsProps {
  stats?: LeadStats;
  isLoading: boolean;
}

export function StatsCards({ stats, isLoading }: StatsCardsProps) {
  const cards = [
    {
      label: 'Total Leads',
      value: stats?.total ?? 0,
      icon: Users,
      color: 'bg-brand-50 text-brand-600 dark:bg-brand-900/30 dark:text-brand-400',
    },
    {
      label: 'Qualified',
      value: stats?.byStatus[LeadStatus.QUALIFIED] ?? 0,
      icon: Target,
      color: 'bg-emerald-50 text-emerald-600 dark:bg-emerald-900/30 dark:text-emerald-400',
    },
    {
      label: 'Contacted',
      value: stats?.byStatus[LeadStatus.CONTACTED] ?? 0,
      icon: TrendingUp,
      color: 'bg-amber-50 text-amber-600 dark:bg-amber-900/30 dark:text-amber-400',
    },
    {
      label: 'Lost',
      value: stats?.byStatus[LeadStatus.LOST] ?? 0,
      icon: AlertCircle,
      color: 'bg-rose-50 text-rose-600 dark:bg-rose-900/30 dark:text-rose-400',
    },
  ];

  if (isLoading) {
    return (
      <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
        {Array.from({ length: 4 }).map((_, i) => (
          <Skeleton key={i} className="h-28" />
        ))}
      </div>
    );
  }

  return (
    <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
      {cards.map(({ label, value, icon: Icon, color }) => (
        <div key={label} className="card flex items-start gap-4">
          <div className={`rounded-lg p-2.5 ${color}`}>
            <Icon className="h-5 w-5" />
          </div>
          <div>
            <p className="text-sm text-slate-500">{label}</p>
            <p className="mt-1 text-2xl font-bold">{value}</p>
          </div>
        </div>
      ))}
    </div>
  );
}
