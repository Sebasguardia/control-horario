export interface ApiResponse<T> {
    data: T | null;
    error: string | null;
    status: number;
}

export interface PaginatedResponse<T> {
    data: T[];
    count: number;
    page: number;
    pageSize: number;
}
