import type { ContactRecord } from '@/lib/product-demo-service';

export type ParsedContactRow = {
  contact: ContactRecord;
  errors: string[];
  duplicate: boolean;
};

export type ContactCsvResult = {
  rows: ParsedContactRow[];
  emptyRows: number;
  acceptedCount: number;
  invalidCount: number;
  duplicateCount: number;
};

type ParsedCsvRecord = { values: string[]; sourceRow: number };

function parseRows(source: string): { rows: ParsedCsvRecord[]; emptyRows: number } {
  const rows: ParsedCsvRecord[] = [];
  let row: string[] = [];
  let field = '';
  let quoted = false;
  let quoteClosed = false;
  let emptyRows = 0;
  let lineNumber = 1;
  let rowStartLine = 1;

  for (let index = 0; index < source.length; index += 1) {
    const character = source[index];
    const next = source[index + 1];

    if (quoted && (character === '\n' || (character === '\r' && next !== '\n'))) lineNumber += 1;

    if (character === '"' && quoted && next === '"') {
      field += '"';
      index += 1;
    } else if (character === '"') {
      if (quoted) {
        quoted = false;
        quoteClosed = true;
      } else if (!quoteClosed && field.trim() === '') {
        field = '';
        quoted = true;
      } else {
        throw new Error('The CSV has a quote in an unexpected position. Check the quotes and preview again.');
      }
    } else if (character === ',' && !quoted) {
      row.push(field.trim());
      field = '';
      quoteClosed = false;
    } else if ((character === '\n' || character === '\r') && !quoted) {
      if (character === '\r' && next === '\n') index += 1;
      row.push(field.trim());
      if (row.some(Boolean)) rows.push({ values: row, sourceRow: rowStartLine });
      else emptyRows += 1;
      row = [];
      field = '';
      quoteClosed = false;
      lineNumber += 1;
      rowStartLine = lineNumber;
    } else if (quoteClosed && !quoted && !/\s/.test(character)) {
      throw new Error('The CSV has text after a closing quote. Check the quotes and preview again.');
    } else if (quoteClosed && !quoted) {
      continue;
    } else {
      field += character;
    }
  }

  if (quoted) throw new Error('The CSV has an unfinished quoted field. Check the quotes and preview again.');
  row.push(field.trim());
  if (row.some(Boolean)) rows.push({ values: row, sourceRow: rowStartLine });
  return { rows, emptyRows };
}

function findColumn(headers: string[], aliases: string[]) {
  return headers.findIndex((header) => aliases.includes(header.toLowerCase().replace(/[\s_-]+/g, '')));
}

function emailIsValid(email: string) {
  return /^[^\s@,;]+@[^\s@,;]+\.[^\s@,;]+$/.test(email);
}

export function parseContactsCsv(source: string): ContactCsvResult {
  if (!source.trim()) throw new Error('Add CSV content or choose a CSV file first.');
  if (source.length > 1_000_000) throw new Error('The CSV exceeds the 1 MB demo limit.');

  const parsed = parseRows(source.replace(/^\uFEFF/, ''));
  const [headerRecord, ...dataRows] = parsed.rows;
  const headerRow = headerRecord?.values;
  if (!headerRow || dataRows.length === 0) {
    throw new Error('Include a header row and at least one contact.');
  }

  const headers = headerRow.map((header) => header.toLowerCase().replace(/[\s_-]+/g, ''));
  const nameColumn = findColumn(headers, ['firstname', 'name', 'contactname']);
  const companyColumn = findColumn(headers, ['company', 'organization', 'account']);
  const roleColumn = findColumn(headers, ['title', 'role', 'jobtitle', 'position']);
  const emailColumn = findColumn(headers, ['email', 'emailaddress']);
  const contextColumn = findColumn(headers, ['context', 'notes', 'personalization', 'personalisation']);

  if (nameColumn === -1 && companyColumn === -1) {
    throw new Error('Include a name or company column. Supported headers include name, company, title, email, and context.');
  }
  if (dataRows.length > 100) throw new Error('The demo accepts up to 100 contact rows.');

  const seenEmails = new Set<string>();
  const rows = dataRows.map(({ values, sourceRow }): ParsedContactRow => {
    const errors: string[] = [];
    if (values.length !== headerRow.length) {
      errors.push(`Expected ${headerRow.length} columns but found ${values.length}.`);
    }
    const valueAt = (column: number) => (column >= 0 ? values[column] || '' : '');
    const contact: ContactRecord = {
      firstName: valueAt(nameColumn),
      company: valueAt(companyColumn),
      role: valueAt(roleColumn),
      email: valueAt(emailColumn),
      context: valueAt(contextColumn),
      sourceRow,
    };

    if (!contact.firstName && !contact.company) errors.push('Add a name or company.');
    if (contact.email && !emailIsValid(contact.email)) errors.push('Email format is invalid.');

    const normalizedEmail = contact.email.trim().toLowerCase();
    const duplicate = Boolean(normalizedEmail && seenEmails.has(normalizedEmail));
    if (normalizedEmail) seenEmails.add(normalizedEmail);

    return { contact, errors, duplicate };
  });
  const invalidCount = rows.filter((row) => row.errors.length > 0).length;
  const duplicateCount = rows.filter((row) => row.duplicate && row.errors.length === 0).length;

  return {
    rows,
    emptyRows: parsed.emptyRows,
    invalidCount,
    duplicateCount,
    acceptedCount: rows.filter((row) => row.errors.length === 0 && !row.duplicate).length,
  };
}
