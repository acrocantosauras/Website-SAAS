import type { Prospect } from '@/lib/product-demo-service';

export function prospectingCsvRows(prospects: Prospect[]) {
  return [
    ['Fictional demo data', 'Company', 'Description', 'Industry', 'Employee range', 'Geography', 'Contact', 'Title', 'Website', 'Company type', 'Match score', 'Qualified', 'Match rationale'],
    ...prospects.map((prospect) => [
      'Illustrative only',
      prospect.company,
      prospect.description,
      prospect.industry,
      prospect.employeeRange,
      prospect.geography,
      prospect.contactName,
      prospect.title,
      prospect.website,
      prospect.companyType,
      String(prospect.matchScore),
      prospect.qualified ? 'Yes' : 'No',
      prospect.matchReasons.join('; '),
    ]),
  ];
}

export function downloadCsv(filename: string, rows: string[][]) {
  const escapeCell = (value: string) => {
    const safeValue = /^[\s]*[=+\-@]/.test(value) ? `'${value}` : value;
    return `"${safeValue.replace(/"/g, '""')}"`;
  };
  const csv = rows.map((row) => row.map(escapeCell).join(',')).join('\r\n');
  const blob = new Blob([csv], { type: 'text/csv;charset=utf-8' });
  const url = URL.createObjectURL(blob);
  const anchor = document.createElement('a');
  anchor.href = url;
  anchor.download = filename;
  anchor.style.position = 'fixed';
  anchor.style.left = '-9999px';
  document.body.appendChild(anchor);
  anchor.click();
  anchor.remove();
  window.setTimeout(() => URL.revokeObjectURL(url), 1000);
}
