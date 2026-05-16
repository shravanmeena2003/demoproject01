import { useCallback, useMemo } from 'react';
import { useSearchParams } from 'react-router-dom';
import { LeadFilters, LeadSource, LeadStatus, SortOrder } from '@/types';

export function useLeadFilters() {
  const [searchParams, setSearchParams] = useSearchParams();

  const filters: LeadFilters = useMemo(() => {
    const status = searchParams.get('status') as LeadStatus | null;
    const source = searchParams.get('source') as LeadSource | null;
    const search = searchParams.get('search') || undefined;
    const sort = (searchParams.get('sort') as SortOrder) || SortOrder.LATEST;
    const page = parseInt(searchParams.get('page') || '1', 10);

    return {
      ...(status && Object.values(LeadStatus).includes(status) ? { status } : {}),
      ...(source && Object.values(LeadSource).includes(source) ? { source } : {}),
      ...(search ? { search } : {}),
      sort,
      page: isNaN(page) ? 1 : page,
    };
  }, [searchParams]);

  const setFilters = useCallback(
    (updates: Partial<LeadFilters>, resetPage = true) => {
      setSearchParams((prev) => {
        const next = new URLSearchParams(prev);

        const apply = (key: string, value: string | undefined) => {
          if (value === undefined || value === '') {
            next.delete(key);
          } else {
            next.set(key, value);
          }
        };

        if ('status' in updates) apply('status', updates.status);
        if ('source' in updates) apply('source', updates.source);
        if ('search' in updates) apply('search', updates.search);
        if ('sort' in updates) apply('sort', updates.sort);
        if ('page' in updates) apply('page', updates.page?.toString());
        else if (resetPage) next.set('page', '1');

        return next;
      });
    },
    [setSearchParams]
  );

  const clearFilters = useCallback(() => {
    setSearchParams({});
  }, [setSearchParams]);

  return { filters, setFilters, clearFilters };
}
