"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.parseCsv = parseCsv;
exports.toCsv = toCsv;
function parseCsv(content, options = {}) {
    var _a;
    const delimiter = (_a = options.delimiter) !== null && _a !== void 0 ? _a : ',';
    const lines = content.split(/\r?\n/).filter((line) => line.trim().length > 0);
    if (lines.length === 0)
        return [];
    const [headerLine, ...rows] = lines;
    const headers = options.headers ? headerLine.split(delimiter).map((h) => h.trim()) : undefined;
    return rows.map((row) => {
        const columns = row.split(delimiter);
        if (headers) {
            return headers.reduce((acc, header, index) => {
                var _a, _b;
                acc[header] = (_b = (_a = columns[index]) === null || _a === void 0 ? void 0 : _a.trim()) !== null && _b !== void 0 ? _b : '';
                return acc;
            }, {});
        }
        return columns.reduce((acc, value, index) => {
            acc[index.toString()] = value.trim();
            return acc;
        }, {});
    });
}
function toCsv(records, delimiter = ',') {
    if (!records.length)
        return '';
    const headers = Object.keys(records[0]);
    const lines = [headers.join(delimiter)];
    for (const record of records) {
        lines.push(headers.map((header) => escapeValue(record[header], delimiter)).join(delimiter));
    }
    return lines.join('\n');
}
function escapeValue(value, delimiter) {
    if (value === null || value === undefined)
        return '';
    const stringValue = String(value);
    if (stringValue.includes(delimiter) || stringValue.includes('"')) {
        return `"${stringValue.replace(/"/g, '""')}"`;
    }
    return stringValue;
}
//# sourceMappingURL=csv.utils.js.map