import { FilterQuery } from 'mongoose';
import { SortOrder } from '../constants';
import { LeadFilters } from '../interfaces';
import { ILeadDocument } from '../models/Lead';

export interface BuiltLeadQuery {
  filter: FilterQuery<ILeadDocument>;
  sort: Record<string, 1 | -1>;
  skip: number;
  limit: number;
  page: number;
}

export const buildLeadQuery = (filters: LeadFilters): BuiltLeadQuery => {
  const page = Math.max(1, filters.page ?? 1);
  const limit = Math.min(50, Math.max(1, filters.limit ?? 10));
  const skip = (page - 1) * limit;

  const filter: FilterQuery<ILeadDocument> = {};

  if (filters.status) {
    filter.status = filters.status;
  }

  if (filters.source) {
    filter.source = filters.source;
  }

  if (filters.search?.trim()) {
    const searchRegex = new RegExp(filters.search.trim(), 'i');
    filter.$or = [{ name: searchRegex }, { email: searchRegex }];
  }

  const sort: Record<string, 1 | -1> =
    filters.sort === SortOrder.OLDEST ? { createdAt: 1 } : { createdAt: -1 };

  return { filter, sort, skip, limit, page };
};
