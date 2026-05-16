import { AppError } from '../errors/AppError';
import { leadRepository } from '../repositories/lead.repository';
import { CreateLeadInput, UpdateLeadInput, LeadQueryInput } from '../validators/lead.validator';
import { buildLeadQuery } from '../utils/queryBuilder';
import { leadsToCsv, generateCsvFilename } from '../utils/csvExport';
import { ILead } from '../interfaces';

const toLeadDto = (lead: {
  _id: { toString(): string };
  name: string;
  email: string;
  status: ILead['status'];
  source: ILead['source'];
  createdBy: unknown;
  createdAt: Date;
  updatedAt: Date;
}): ILead & { createdBy: unknown } => ({
  _id: lead._id.toString(),
  name: lead.name,
  email: lead.email,
  status: lead.status,
  source: lead.source,
  createdBy:
    typeof lead.createdBy === 'object' && lead.createdBy !== null
      ? (lead.createdBy as { _id?: { toString(): string } })._id?.toString() ??
        String(lead.createdBy)
      : String(lead.createdBy),
  createdAt: lead.createdAt,
  updatedAt: lead.updatedAt,
});

export class LeadService {
  async getLeads(query: LeadQueryInput) {
    const { leads, pagination } = await leadRepository.findAll(query);
    return {
      data: leads.map(toLeadDto),
      pagination,
    };
  }

  async getLeadById(id: string) {
    const lead = await leadRepository.findById(id);
    if (!lead) {
      throw new AppError('Lead not found', 404);
    }
    return toLeadDto(lead);
  }

  async createLead(data: CreateLeadInput, userId: string) {
    const lead = await leadRepository.create(data, userId);
    const populated = await leadRepository.findById(lead._id.toString());
    return toLeadDto(populated ?? lead);
  }

  async updateLead(id: string, data: UpdateLeadInput) {
    const lead = await leadRepository.update(id, data);
    if (!lead) {
      throw new AppError('Lead not found', 404);
    }
    return toLeadDto(lead);
  }

  async deleteLead(id: string) {
    const lead = await leadRepository.delete(id);
    if (!lead) {
      throw new AppError('Lead not found', 404);
    }
    return { id };
  }

  async exportLeads(query: LeadQueryInput) {
    const { filter, sort } = buildLeadQuery({ ...query, page: 1, limit: 10000 });
    const leads = await leadRepository.findAllForExport(filter);
    const sorted = [...leads].sort((a, b) => {
      const order = sort.createdAt ?? -1;
      return order === -1
        ? b.createdAt.getTime() - a.createdAt.getTime()
        : a.createdAt.getTime() - b.createdAt.getTime();
    });

    const csv = leadsToCsv(sorted.map(toLeadDto));
    return {
      csv,
      filename: generateCsvFilename(),
    };
  }

  async getStats() {
    return leadRepository.getStats();
  }
}

export const leadService = new LeadService();
