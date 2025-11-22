export interface CsvParseOptions {
  delimiter?: string;
  headers?: boolean;
}

export function parseCsv(content: string, options: CsvParseOptions = {}): Record<string, string>[] {
  const delimiter = options.delimiter ?? ',';
  const lines = content.split(/\r?\n/).filter((line) => line.trim().length > 0);
  if (lines.length === 0) return [];
  const [headerLine, ...rows] = lines;
  const headers = options.headers ? headerLine.split(delimiter).map((h) => h.trim()) : undefined;

  return rows.map((row) => {
    const columns = row.split(delimiter);
    if (headers) {
      return headers.reduce<Record<string, string>>((acc, header, index) => {
        acc[header] = columns[index]?.trim() ?? '';
        return acc;
      }, {});
    }
    return columns.reduce<Record<string, string>>((acc, value, index) => {
      acc[index.toString()] = value.trim();
      return acc;
    }, {});
  });
}

export function toCsv(records: Record<string, any>[], delimiter = ','): string {
  if (!records.length) return '';
  const headers = Object.keys(records[0]);
  const lines = [headers.join(delimiter)];
  for (const record of records) {
    lines.push(headers.map((header) => escapeValue(record[header], delimiter)).join(delimiter));
  }
  return lines.join('\n');
}

function escapeValue(value: any, delimiter: string): string {
  if (value === null || value === undefined) return '';
  const stringValue = String(value);
  if (stringValue.includes(delimiter) || stringValue.includes('"')) {
    return `"${stringValue.replace(/"/g, '""')}"`;
  }
  return stringValue;
}
