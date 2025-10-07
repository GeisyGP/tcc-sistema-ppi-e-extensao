import { ApiProperty } from "@nestjs/swagger"
import { IsArray, IsNotEmpty, ValidateNested } from "class-validator"
import { SubjectPPIReq } from "./create-ppi-req.dto"

export class UpdateSubjectPPIReqDto {
    @ApiProperty()
    @IsArray()
    @IsNotEmpty()
    @ValidateNested()
    subjects: Array<SubjectPPIReq>
}
