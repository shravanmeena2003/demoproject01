import { Request, Response } from 'express';
import { leadService } from '../services/lead.service';
import { asyncHandler } from '../utils/asyncHandler';

export const getLeads = asyncHandler(async (req: Request, res: Response) => {
  const { data, pagination } = await leadService.getLeads(req.query);
  res.status(200).json({
    success: true,
    data,
    pagination,
  });
});

export const getLead = asyncHandler(async (req: Request, res: Response) => {
  const id = req.params.id as string;
  const lead = await leadService.getLeadById(id);
  res.status(200).json({
    success: true,
    data: lead,
  });
});

export const createLead = asyncHandler(async (req: Request, res: Response) => {
  const lead = await leadService.createLead(req.body, req.user!.id);
  res.status(201).json({
    success: true,
    message: 'Lead created successfully',
    data: lead,
  });
});

export const updateLead = asyncHandler(async (req: Request, res: Response) => {
  const id = req.params.id as string;
  const lead = await leadService.updateLead(id, req.body);
  res.status(200).json({
    success: true,
    message: 'Lead updated successfully',
    data: lead,
  });
});

export const deleteLead = asyncHandler(async (req: Request, res: Response) => {
  const id = req.params.id as string;
  await leadService.deleteLead(id);
  res.status(200).json({
    success: true,
    message: 'Lead deleted successfully',
  });
});

export const exportLeads = asyncHandler(async (req: Request, res: Response) => {
  const { csv, filename } = await leadService.exportLeads(req.query);
  res.setHeader('Content-Type', 'text/csv');
  res.setHeader('Content-Disposition', `attachment; filename="${filename}"`);
  res.status(200).send(csv);
});

export const getStats = asyncHandler(async (_req: Request, res: Response) => {
  const stats = await leadService.getStats();
  res.status(200).json({
    success: true,
    data: stats,
  });
});
