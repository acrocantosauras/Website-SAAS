import type { OutreachDraft, Prospect } from '@/lib/product-demo-service';

const prospectHeaders = [
  'Fictional demo data',
  'Company',
  'Description',
  'Industry',
  'Employee range',
  'Geography',
  'Contact',
  'Title',
  'Website',
  'Company type',
  'Match score',
  'Qualified',
  'Match rationale',
];

export const outreachHeaders = ['Name', 'Company', 'Email', 'Subject', 'Draft', 'Review status', 'Quality notes'];

export function prospectingCsvRows(prospects: Prospect[]): string[][] {
  return [
    prospectHeaders,
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

/**
 * Single source of truth for outreach exports. The outreach workflow and the
 * batch history both call this, so an identical run always yields an identical
 * file — including user-edited subject/body, review status and quality notes.
 */
export function outreachCsvRows(drafts: OutreachDraft[]): string[][] {
  return [
    outreachHeaders,
    ...drafts.map(({ contact, subject, body, status, qualityChecks }) => [
      contact.firstName,
      contact.company,
      contact.email,
      subject,
      body,
      status,
      qualityChecks.join('; '),
    ]),
  ];
}

const asciiFallbacks: Record<string, string> = {
  'ß': 'ss',
  'æ': 'ae',
  'Æ': 'AE',
  'œ': 'oe',
  'Œ': 'OE',
  'ø': 'o',
  'Ø': 'O',
  'đ': 'd',
  'Đ': 'D',
  'ð': 'd',
  'Ð': 'D',
  'ł': 'l',
  'Ł': 'L',
  'þ': 'th',
  'Þ': 'TH',
};

export function csvFilename(name: string, suffix: string): string {
  const slug = name
    .replace(/[ßæÆœŒøØđĐðÐłŁþÞ]/g, (character) => asciiFallbacks[character] || character)
    .normalize('NFKD')
    .replace(/[\u0300-\u036f]/g, '')
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-+|-+$/g, '')
    .slice(0, 60);

  return `${slug || 'demo-run'}-${suffix}.csv`;
}

export function escapeCsvCell(value: string): string {
  const safeValue = /^[\s]*[=+\-@]/.test(value) ? `'${value}` : value;
  return `"${safeValue.replace(/"/g, '""')}"`;
}

export function buildCsv(rows: string[][]): string {
  return rows.map((row) => row.map(escapeCsvCell).join(',')).join('\r\n');
}

export function downloadCsv(filename: string, rows: string[][]) {
  const blob = new Blob([buildCsv(rows)], { type: 'text/csv;charset=utf-8' });
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
