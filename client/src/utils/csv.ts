import { Lead } from '@/types';

export const generateCSVContent = (leads: Lead[]): string => {
  const headers = ['ID', 'Name', 'Email', 'Phone', 'Company', 'Status', 'Source', 'Value', 'Created At'];
  
  const rows = leads.map((lead) => [
    lead.id,
    lead.name,
    lead.email,
    lead.phone,
    lead.company,
    lead.status,
    lead.source,
    lead.value,
    lead.createdAt,
  ]);

  const csvContent = [
    headers.join(','),
    ...rows.map((row) => row.map((cell) => `"${cell}"`).join(',')),
  ].join('\n');

  return csvContent;
};

export const downloadCSV = (content: string, filename: string): void => {
  const element = document.createElement('a');
  element.setAttribute('href', `data:text/csv;charset=utf-8,${encodeURIComponent(content)}`);
  element.setAttribute('download', filename);
  element.style.display = 'none';

  document.body.appendChild(element);
  element.click();
  document.body.removeChild(element);
};

export const exportLeadsToCSV = (leads: Lead[], filename = 'leads.csv'): void => {
  const csvContent = generateCSVContent(leads);
  downloadCSV(csvContent, filename);
};
