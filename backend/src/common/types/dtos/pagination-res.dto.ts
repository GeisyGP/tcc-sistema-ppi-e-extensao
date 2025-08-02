export class PaginationResDto<T> {
    items: T
    metadata: {
        page: number
        itemsPerPage: number
        totalPages: number
        totalItems: number
    }
}
