import { FilterQuery } from 'mongoose';
import { Lead, ILeadDocument } from '../models/Lead';
import { LeadFilters, PaginationMeta } from '../interfaces';
import { buildLeadQuery } from '../utils/queryBuilder';
import { CreateLeadInput, UpdateLeadInput } from '../validators/lead.validator';
import { LeadSource, LeadStatus } from '../constants';

export class LeadRepository {
  async findAll(filters: LeadFilters): Promise<{
    leads: ILeadDocument[];
    pagination: PaginationMeta;
  }> {
    const { filter, sort, skip, limit, page } = buildLeadQuery(filters);

    const [leads, total] = await Promise.all([
      Lead.find(filter).sort(sort).skip(skip).limit(limit).populate('createdBy', 'name email'),
      Lead.countDocuments(filter),
    ]);

    return {
      leads,
      pagination: {
        total,
        page,
        limit,
        totalPages: Math.ceil(total / limit) || 1,
      },
    };
  }

  async findAllForExport(filter: FilterQuery<ILeadDocument>): Promise<ILeadDocument[]> {
    return Lead.find(filter).sort({ createdAt: -1 });
  }

  async findById(id: string): Promise<ILeadDocument | null> {
    return Lead.findById(id).populate('createdBy', 'name email');
  }

  async create(data: CreateLeadInput, userId: string): Promise<ILeadDocument> {
    return Lead.create({
      ...data,
      createdBy: userId,
    });
  }

  async update(id: string, data: UpdateLeadInput): Promise<ILeadDocument | null> {
    return Lead.findByIdAndUpdate(id, data, { new: true, runValidators: true }).populate(
      'createdBy',
      'name email'
    );
  }

  async delete(id: string): Promise<ILeadDocument | null> {
    return Lead.findByIdAndDelete(id);
  }

  async getStats(): Promise<{
    total: number;
    byStatus: Record<LeadStatus, number>;
    bySource: Record<LeadSource, number>;
  }> {
    const [total, statusAgg, sourceAgg] = await Promise.all([
      Lead.countDocuments(),
      Lead.aggregate<{ _id: LeadStatus; count: number }>([
        { $group: { _id: '$status', count: { $sum: 1 } } },
      ]),
      Lead.aggregate<{ _id: LeadSource; count: number }>([
        { $group: { _id: '$source', count: { $sum: 1 } } },
      ]),
    ]);

    const byStatus = Object.values(LeadStatus).reduce(
      (acc, status) => {
        acc[status] = statusAgg.find((s) => s._id === status)?.count ?? 0;
        return acc;
      },
      {} as Record<LeadStatus, number>
    );

    const bySource = Object.values(LeadSource).reduce(
      (acc, source) => {
        acc[source] = sourceAgg.find((s) => s._id === source)?.count ?? 0;
        return acc;
      },
      {} as Record<LeadSource, number>
    );

    return { total, byStatus, bySource };
  }
}

export const leadRepository = new LeadRepository();
