"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.normalizePagination = normalizePagination;
exports.buildPaginationMeta = buildPaginationMeta;
function normalizePagination(options) {
    let page = Number(options.page || 1);
    let limit = Number(options.limit || 25);
    page = page < 1 ? 1 : page;
    limit = limit < 1 ? 1 : limit;
    limit = limit > 100 ? 100 : limit;
    return { page, limit };
}
function buildPaginationMeta(totalItems, options) {
    const { page, limit } = normalizePagination(options);
    const totalPages = Math.ceil(totalItems / limit) || 1;
    return { page, limit, totalItems, totalPages };
}
//# sourceMappingURL=pagination.utils.js.map