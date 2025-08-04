import { BaseResDto } from "src/common/types/dtos/base-res.dto"
import { PaginationResDto } from "src/common/types/dtos/pagination-res.dto"

export const paginationMock = <T>(items: Array<T>): PaginationResDto<T[]> => {
    return {
        items,
        metadata: {
            page: 1,
            itemsPerPage: 30,
            totalPages: 1,
            totalItems: items.length,
        },
    }
}

export const baseResponseMock = <T>(
    message: string,
    data: T,
): BaseResDto<T> => {
    return {
        message,
        data,
    }
}
