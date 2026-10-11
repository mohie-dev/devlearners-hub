export interface ApiResponse<T> {
    status: 'success';
    code: number;
    data: T;
}