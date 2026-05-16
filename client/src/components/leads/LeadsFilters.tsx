import { Search, X } from 'lucide-react';
import { LeadFilters, LeadSource, LeadStatus, SortOrder } from '@/types';
import { LEAD_SOURCES, LEAD_STATUSES } from '@/constants';
import { Input } from '@/components/ui/Input';
import { Select } from '@/components/ui/Select';
import { Button } from '@/components/ui/Button';

interface LeadsFiltersProps {
  filters: LeadFilters;
  searchInput: string;
  onSearchChange: (value: string) => void;
  onFilterChange: (updates: Partial<LeadFilters>) => void;
  onClear: () => void;
}

export function LeadsFilters({
  filters,
  searchInput,
  onSearchChange,
  onFilterChange,
  onClear,
}: LeadsFiltersProps) {
  const hasFilters = filters.status || filters.source || filters.search;

  return (
    <div className="card space-y-4">
      <div className="flex flex-col gap-4 lg:flex-row lg:items-end">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400" />
          <Input
            placeholder="Search by name or email..."
            value={searchInput}
            onChange={(e) => onSearchChange(e.target.value)}
            className="pl-9"
          />
        </div>
        <Select
          label="Status"
          value={filters.status || ''}
          onChange={(e) =>
            onFilterChange({
              status: e.target.value ? (e.target.value as LeadStatus) : undefined,
            })
          }
          options={[
            { value: '', label: 'All statuses' },
            ...LEAD_STATUSES.map((s) => ({ value: s, label: s })),
          ]}
          className="min-w-[160px]"
        />
        <Select
          label="Source"
          value={filters.source || ''}
          onChange={(e) =>
            onFilterChange({
              source: e.target.value ? (e.target.value as LeadSource) : undefined,
            })
          }
          options={[
            { value: '', label: 'All sources' },
            ...LEAD_SOURCES.map((s) => ({ value: s, label: s })),
          ]}
          className="min-w-[160px]"
        />
        <Select
          label="Sort"
          value={filters.sort || SortOrder.LATEST}
          onChange={(e) => onFilterChange({ sort: e.target.value as SortOrder })}
          options={[
            { value: SortOrder.LATEST, label: 'Latest first' },
            { value: SortOrder.OLDEST, label: 'Oldest first' },
          ]}
          className="min-w-[160px]"
        />
      </div>
      {hasFilters && (
        <Button variant="ghost" onClick={onClear} className="text-sm">
          <X className="h-4 w-4" />
          Clear filters
        </Button>
      )}
    </div>
  );
}
