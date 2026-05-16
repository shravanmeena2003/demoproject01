import { LeadSource, LeadStatus } from '@/types';

export const LEAD_STATUSES = Object.values(LeadStatus);
export const LEAD_SOURCES = Object.values(LeadSource);
export const PAGE_SIZE = 10;

export const STATUS_COLORS: Record<LeadStatus, string> = {
  [LeadStatus.NEW]: 'bg-blue-100 text-blue-700 dark:bg-blue-900/40 dark:text-blue-300',
  [LeadStatus.CONTACTED]: 'bg-amber-100 text-amber-700 dark:bg-amber-900/40 dark:text-amber-300',
  [LeadStatus.QUALIFIED]: 'bg-emerald-100 text-emerald-700 dark:bg-emerald-900/40 dark:text-emerald-300',
  [LeadStatus.LOST]: 'bg-rose-100 text-rose-700 dark:bg-rose-900/40 dark:text-rose-300',
};
