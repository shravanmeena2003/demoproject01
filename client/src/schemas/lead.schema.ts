import { z } from 'zod';
import { LeadSource, LeadStatus } from '@/types';

export const leadFormSchema = z.object({
  name: z.string().min(2, 'Name must be at least 2 characters'),
  email: z.string().email('Enter a valid email'),
  status: z.nativeEnum(LeadStatus),
  source: z.nativeEnum(LeadSource),
});

export type LeadFormData = z.infer<typeof leadFormSchema>;
