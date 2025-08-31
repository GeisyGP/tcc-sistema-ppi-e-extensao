import { ApiProperty } from "@nestjs/swagger"

class MetadataDto {
    @ApiProperty()
    page: number

    @ApiProperty()
    itemsPerPage: number

    @ApiProperty()
    totalPages: number

    @ApiProperty()
    totalItems: number
}

export class PaginationResDto<T> {
    @ApiProperty({ isArray: true })
    items: T

    @ApiProperty({ type: () => MetadataDto })
    metadata: MetadataDto
}
