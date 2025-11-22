export interface PaginationOptions {
  page?: number;
  limit?: number;
}

export interface PaginationMeta {
  page: number;
  limit: number;
  totalItems: number;
  totalPages: number;
}

export function normalizePagination(options: PaginationOptions): Required<PaginationOptions> {
  let page = Number(options.page || 1);
  let limit = Number(options.limit || 25);
  page = page < 1 ? 1 : page;
  limit = limit < 1 ? 1 : limit;
  limit = limit > 100 ? 100 : limit;
  return { page, limit };
}

export function buildPaginationMeta(totalItems: number, options: PaginationOptions): PaginationMeta {
  const { page, limit } = normalizePagination(options);
  const totalPages = Math.ceil(totalItems / limit) || 1;
  return { page, limit, totalItems, totalPages };
}
