/**
 * Utility for generating clean, well-structured multi-column CSV files
 * compatible with Microsoft Excel (Italian/European semicolon delimiter + UTF-8 BOM)
 * as well as LibreOffice Calc and standard CSV importers.
 */

export interface CsvColumn<T = any> {
  header: string;
  key?: string;
  accessor?: (row: T) => string | number | boolean | null | undefined;
}

/**
 * Formats a single cell value so it never breaks columns or rows in Excel:
 * - Collapse multiline strings into a single clean line
 * - Escape double quotes (" -> "")
 * - Wrap in quotes if it contains the delimiter, quotes, or spaces
 */
function formatCsvCell(
  value: string | number | boolean | null | undefined,
  delimiter: string
): string {
  if (value === null || value === undefined) return "";

  const clean = String(value)
    .replace(/\r?\n|\r/g, " ")
    .replace(/\s+/g, " ")
    .trim();

  if (
    clean.includes(delimiter) ||
    clean.includes('"') ||
    clean.includes(",") ||
    clean.includes(";")
  ) {
    return `"${clean.replace(/"/g, '""')}"`;
  }

  return clean;
}

/**
 * Builds a complete CSV string with UTF-8 BOM (\uFEFF) and semicolon (;) delimiter
 * so Excel on Italian/European Windows automatically splits every column and row properly.
 */
export function buildCsvString<T>(
  rows: T[],
  columns: CsvColumn<T>[],
  delimiter: ";" | "," = ";"
): string {
  const headerLine = columns
    .map((col) => formatCsvCell(col.header, delimiter))
    .join(delimiter);

  const dataLines = rows.map((row) =>
    columns
      .map((col) => {
        const rawValue = col.accessor
          ? col.accessor(row)
          : col.key
          ? (row as any)?.[col.key]
          : "";
        return formatCsvCell(rawValue, delimiter);
      })
      .join(delimiter)
  );

  // Use CRLF (\r\n) and UTF-8 BOM (\uFEFF) for native Excel column/row recognition
  return "\uFEFF" + [headerLine, ...dataLines].join("\r\n") + "\r\n";
}

/**
 * Triggers a browser download of a well-formatted CSV file.
 */
export function downloadCsvFile<T>(
  filename: string,
  rows: T[],
  columns: CsvColumn<T>[],
  delimiter: ";" | "," = ";"
): void {
  const csvContent = buildCsvString(rows, columns, delimiter);
  const blob = new Blob([csvContent], {
    type: "text/csv;charset=utf-8;",
  });
  const url = window.URL.createObjectURL(blob);
  const a = document.createElement("a");
  a.href = url;
  a.download = filename.endsWith(".csv") ? filename : `${filename}.csv`;
  document.body.appendChild(a);
  a.click();
  document.body.removeChild(a);
  window.URL.revokeObjectURL(url);
}
