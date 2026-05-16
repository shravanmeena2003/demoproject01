import { useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { Modal } from '@/components/ui/Modal';
import { Input } from '@/components/ui/Input';
import { Select } from '@/components/ui/Select';
import { Button } from '@/components/ui/Button';
import { leadFormSchema, LeadFormData } from '@/schemas/lead.schema';
import { Lead, LeadSource, LeadStatus } from '@/types';
import { LEAD_SOURCES, LEAD_STATUSES } from '@/constants';

interface LeadFormModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (data: LeadFormData) => void;
  lead?: Lead | null;
  isLoading?: boolean;
}

export function LeadFormModal({
  isOpen,
  onClose,
  onSubmit,
  lead,
  isLoading,
}: LeadFormModalProps) {
  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm<LeadFormData>({
    resolver: zodResolver(leadFormSchema),
    defaultValues: {
      name: '',
      email: '',
      status: LeadStatus.NEW,
      source: LeadSource.WEBSITE,
    },
  });

  useEffect(() => {
    if (lead) {
      reset({
        name: lead.name,
        email: lead.email,
        status: lead.status,
        source: lead.source,
      });
    } else {
      reset({
        name: '',
        email: '',
        status: LeadStatus.NEW,
        source: LeadSource.WEBSITE,
      });
    }
  }, [lead, reset, isOpen]);

  return (
    <Modal isOpen={isOpen} onClose={onClose} title={lead ? 'Edit Lead' : 'Create Lead'}>
      <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
        <Input label="Name" {...register('name')} error={errors.name?.message} />
        <Input label="Email" type="email" {...register('email')} error={errors.email?.message} />
        <Select
          label="Status"
          {...register('status')}
          error={errors.status?.message}
          options={LEAD_STATUSES.map((s) => ({ value: s, label: s }))}
        />
        <Select
          label="Source"
          {...register('source')}
          error={errors.source?.message}
          options={LEAD_SOURCES.map((s) => ({ value: s, label: s }))}
        />
        <div className="flex justify-end gap-2 pt-2">
          <Button type="button" variant="secondary" onClick={onClose}>
            Cancel
          </Button>
          <Button type="submit" isLoading={isLoading}>
            {lead ? 'Save changes' : 'Create lead'}
          </Button>
        </div>
      </form>
    </Modal>
  );
}
