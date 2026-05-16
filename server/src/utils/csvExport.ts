import { ILead } from '../interfaces';

const CSV_HEADERS = ['Name', 'Email', 'Status', 'Source', 'Created At', 'Updated At'];

const escapeCsvField = (value: string): string => {
  if (value.includes(',') || value.includes('"') || value.includes('\n')) {
    return `"${value.replace(/"/g, '""')}"`;
  }
  return value;
};

export const leadsToCsv = (leads: ILead[]): string => {
  const rows = leads.map((lead) =>
    [
      escapeCsvField(lead.name),
      escapeCsvField(lead.email),
      escapeCsvField(lead.status),
      escapeCsvField(lead.source),
      escapeCsvField(new Date(lead.createdAt).toISOString()),
      escapeCsvField(new Date(lead.updatedAt).toISOString()),
    ].join(',')
  );

  return [CSV_HEADERS.join(','), ...rows].join('\n');
};

export const generateCsvFilename = (): string => {
  const timestamp = new Date().toISOString().replace(/[:.]/g, '-').slice(0, 19);
  return `leads-export-${timestamp}.csv`;
};
