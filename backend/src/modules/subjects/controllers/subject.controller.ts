import {
    Body,
    Controller,
    Delete,
    Get,
    Param,
    Post,
    Put,
    Query,
    UseGuards,
} from "@nestjs/common"
import { ApiTags } from "@nestjs/swagger"
import { BaseResDto } from "../../../common/types/dtos/base-res.dto"
import { PaginationResDto } from "src/common/types/dtos/pagination-res.dto"
import { PoliciesGuard } from "src/common/guards/policies.guard"
import { CheckPolicies } from "src/common/decorators/check-policies.decorator"
import { AppAbility } from "src/modules/casl/casl-ability.factory"
import { Action } from "src/common/enums/action.enum"
import { SubjectService } from "../services/subject.service"
import { CreateSubjectReqDto } from "../types/dtos/requests/create-subject-req.dto"
import { SubjectWithTeacherResDto } from "../types/dtos/responses/subject-with-teacher-res.dto"
import { GetByIdSubjectReqDto } from "../types/dtos/requests/get-by-id-subject.dto"
import { GetAllSubjectsReqDto } from "../types/dtos/requests/get-all-subjects-req.dto"
import { SubjectResDto } from "../types/dtos/responses/subject-res.dto"
import {
    UpdateSubjectParamsReqDto,
    UpdateSubjectReqDto,
} from "../types/dtos/requests/update-subject-req.dto"
import { DeleteSubjectReqDto } from "../types/dtos/requests/delete-subject-req.dto"
import { SubjectEntity } from "../types/entities/subject.entity"

@ApiTags("subjects")
@Controller("subjects")
export class SubjectController {
    constructor(private readonly subjectService: SubjectService) {}

    @Post()
    @UseGuards(PoliciesGuard)
    @CheckPolicies((ability: AppAbility) =>
        ability.can(Action.Create, SubjectEntity),
    )
    async create(
        @Body() dto: CreateSubjectReqDto,
    ): Promise<BaseResDto<SubjectWithTeacherResDto>> {
        const subject = await this.subjectService.create(dto)

        return {
            message: "Subject created successfully",
            data: subject,
        }
    }

    @Get(":id")
    @UseGuards(PoliciesGuard)
    @CheckPolicies((ability: AppAbility) =>
        ability.can(Action.Read, SubjectEntity),
    )
    async getById(
        @Param() param: GetByIdSubjectReqDto,
    ): Promise<BaseResDto<SubjectWithTeacherResDto>> {
        const subject = await this.subjectService.getById(param.id)

        return {
            message: "Subject found successfully",
            data: subject,
        }
    }

    @Get()
    @UseGuards(PoliciesGuard)
    @CheckPolicies((ability: AppAbility) =>
        ability.can(Action.Read, SubjectEntity),
    )
    async getAll(
        @Query() queryParams: GetAllSubjectsReqDto,
    ): Promise<BaseResDto<PaginationResDto<SubjectResDto[]>>> {
        const response = await this.subjectService.getAll(queryParams)
        return {
            message: "Subjects found successfully",
            data: response,
        }
    }

    @Put(":id")
    @UseGuards(PoliciesGuard)
    @CheckPolicies((ability: AppAbility) =>
        ability.can(Action.Update, SubjectEntity),
    )
    async update(
        @Param() param: UpdateSubjectParamsReqDto,
        @Body() dto: UpdateSubjectReqDto,
    ): Promise<BaseResDto<SubjectWithTeacherResDto>> {
        const subject = await this.subjectService.updateById(param.id, dto)

        return {
            message: "Subject updated successfully",
            data: subject,
        }
    }

    @Delete(":id")
    @UseGuards(PoliciesGuard)
    @CheckPolicies((ability: AppAbility) =>
        ability.can(Action.Delete, SubjectEntity),
    )
    async delete(@Param() param: DeleteSubjectReqDto): Promise<void> {
        await this.subjectService.delete(param.id)
    }
}
