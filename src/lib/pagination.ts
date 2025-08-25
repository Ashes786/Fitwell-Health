import { NextRequest } from 'next/server'

export interface PaginationParams {
  page: number
  limit: number
  skip: number
  search?: string
  status?: string
  [key: string]: any
}

export interface PaginationResult<T> {
  data: T[]
  pagination: {
    page: number
    limit: number
    total: number
    pages: number
  }
}

export function getPaginationParams(request: NextRequest, defaultLimit: number = 10): PaginationParams {
  const { searchParams } = new URL(request.url)
  const page = parseInt(searchParams.get('page') || '1')
  const limit = parseInt(searchParams.get('limit') || defaultLimit.toString())
  const skip = (page - 1) * limit

  return {
    page,
    limit,
    skip,
    search: searchParams.get('search') || '',
    status: searchParams.get('status') || 'all'
  }
}

export function buildSearchWhereClause(search: string, searchFields: string[]): any {
  if (!search) return {}
  
  return {
    OR: searchFields.map(field => ({
      [field]: { contains: search, mode: 'insensitive' }
    }))
  }
}

export function buildStatusWhereClause(status: string, statusField: string = 'isActive'): any {
  if (status === 'all') return {}
  
  return {
    [statusField]: status === 'active'
  }
}

export async function createPaginatedResponse<T>(
  dataPromise: Promise<T[]>,
  countPromise: Promise<number>,
  pagination: PaginationParams
): Promise<PaginationResult<T>> {
  const [data, total] = await Promise.all([dataPromise, countPromise])
  
  return {
    data,
    pagination: {
      page: pagination.page,
      limit: pagination.limit,
      total,
      pages: Math.ceil(total / pagination.limit)
    }
  }
}