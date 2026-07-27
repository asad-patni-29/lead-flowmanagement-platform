import { PaginationMeta } from '../types';
import { Model, Document } from 'mongoose';

export interface PaginationParams {
  page: number;
  limit: number;
  skip: number;
}

export interface PaginateOptions {
  page: number;
  limit: number;
  sort?: any;
}

export interface PaginateResult<T> {
  data: T[];
  meta: PaginationMeta;
}

const DEFAULT_PAGE = 1;
const DEFAULT_LIMIT = 10;
const MAX_LIMIT = 100;

export const parsePagination = (query: Record<string, unknown>): PaginationParams => {
  let page = parseInt(String(query.page ?? DEFAULT_PAGE), 10);
  let limit = parseInt(String(query.limit ?? DEFAULT_LIMIT), 10);

  if (!Number.isFinite(page) || page < 1) page = DEFAULT_PAGE;
  if (!Number.isFinite(limit) || limit < 1) limit = DEFAULT_LIMIT;
  if (limit > MAX_LIMIT) limit = MAX_LIMIT;

  return { page, limit, skip: (page - 1) * limit };
};

export const buildMeta = (
  page: number,
  limit: number,
  total: number
): PaginationMeta => ({
  page,
  limit,
  total,
  totalPages: Math.max(1, Math.ceil(total / limit)),
});

export const paginate = async <T extends Document>(
  model: Model<T>,
  query: any,
  options: PaginateOptions
): Promise<PaginateResult<T>> => {
  const { page, limit, sort } = options;
  const skip = (page - 1) * limit;

  const [data, total] = await Promise.all([
    model.find(query).sort(sort).skip(skip).limit(limit),
    model.countDocuments(query),
  ]);

  return {
    data: data.map((doc) => doc.toJSON()) as T[],
    meta: buildMeta(page, limit, total),
  };
};
