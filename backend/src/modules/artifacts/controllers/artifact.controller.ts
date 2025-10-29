import { FileInterceptor } from "@nestjs/platform-express"
import { diskStorage } from "multer"
import { extname, join } from "path"
import * as fs from "fs"
import * as express from "express"
import {
    BadRequestException,
    Body,
    Controller,
    Delete,
    Get,
    InternalServerErrorException,
    Param,
    Post,
    Put,
    Query,
    Request,
    Res,
    Response,
    UploadedFile,
    UseFilters,
    UseGuards,
    UseInterceptors,
} from "@nestjs/common"
import { ApiCreatedResponse, ApiNoContentResponse, ApiOkResponse, ApiTags } from "@nestjs/swagger"
import { BaseResDto } from "../../../common/types/dtos/base-res.dto"
import { PaginationResDto } from "src/common/types/dtos/pagination-res.dto"
import { PoliciesGuard } from "src/common/guards/policies.guard"
import { CheckPolicies } from "src/common/decorators/check-policies.decorator"
import { AppAbility } from "src/modules/casl/casl-ability.factory"
import { Action } from "src/common/enums/action.enum"
import { CustomLoggerService } from "src/common/logger"
import { RequestDto } from "src/modules/authentication/types/dtos/requests/request.dto"
import { ArtifactService } from "../services/artifact.service"
import { ArtifactResDto } from "../types/dtos/responses/artifact-res.dto"
import {
    GetAllArtifactByGroupParamsReqDto,
    GetAllArtifactByProjectParamsReqDto,
    GetAllArtifactReqDto,
} from "../types/dtos/requests/get-all-req.dto"
import { GetByIdArtifactReqDto } from "../types/dtos/requests/get-by-id-artifact-req.dto"
import { DeleteArtifactReqDto } from "../types/dtos/requests/delete-artifact-req.dto"
import {
    CreateArtifactDeliverableParamsReqDto,
    CreateArtifactDeliverableReqDto,
    CreateArtifactProjectParamsReqDto,
    CreateArtifactProjectReqDto,
} from "../types/dtos/requests/create-artifact-req.dto"
import { FileCleanupFilter } from "src/common/filters/file-cleanup.filter"
import { ArtifactNotFoundException } from "src/common/exceptions/artifact-not-found.exception"
import { BLOCKED_FILE_EXTENSION, MAX_ARTIFACT_SIZE } from "src/common/constants"
import { UpdateByIdArtifactReqDto } from "../types/dtos/requests/update.req.dto"
import { FileCannotBeViewedException } from "src/common/exceptions/file-cannot-be-viewed.exception"
import { InvalidInputException } from "src/common/exceptions/invalid-input.exception"

@ApiTags("artifacts")
@Controller("artifacts")
export class ArtifactController {
    constructor(
        private readonly artifactService: ArtifactService,
        private readonly loggerService: CustomLoggerService,
    ) {}

    @Post("/project/:projectId")
    @ApiCreatedResponse({
        type: ArtifactResDto,
    })
    @UseGuards(PoliciesGuard)
    @UseFilters(FileCleanupFilter)
    @CheckPolicies((ability: AppAbility) => ability.can(Action.Create, "ARTIFACT"))
    @UseInterceptors(
        FileInterceptor("file", {
            storage: diskStorage({
                destination: (req, file, cb) => {
                    const projectId = req.params.projectId
                    const uploadPath = join("./uploads/projects", projectId)
                    fs.mkdirSync(uploadPath, { recursive: true })
                    cb(null, uploadPath)
                },
                filename: (req, file, cb) => {
                    const ext = extname(file.originalname)
                    const fileName = `${crypto.randomUUID()}${ext}`
                    cb(null, fileName)
                },
            }),
            limits: { fileSize: MAX_ARTIFACT_SIZE },
            fileFilter: (req, file, cb) => {
                const ext = extname(file.originalname).toLowerCase()
                if (BLOCKED_FILE_EXTENSION.includes(ext)) {
                    return cb(new BadRequestException("Invalid file type"), false)
                }
                cb(null, true)
            },
        }),
    )
    async createArtifactProject(
        @UploadedFile() file: Express.Multer.File,
        @Param() param: CreateArtifactProjectParamsReqDto,
        @Body() dto: CreateArtifactProjectReqDto,
        @Request() request: RequestDto,
    ): Promise<BaseResDto<ArtifactResDto>> {
        this.loggerService.info(this.constructor.name, this.createArtifactProject.name, `user: ${request.user.sub}`)
        if (!file) {
            throw new InvalidInputException(["File is required"])
        }
        const fileInfo = {
            fileName: file.filename,
            mimeType: file.mimetype,
            path: file.path,
            size: file.size,
        }

        const response = await this.artifactService.createArtifactProject(
            param.projectId,
            dto,
            fileInfo,
            request.user.mainCourseId,
            request.user.sub,
            request.user.mainRole,
        )
        return {
            message: "Artifact saved successfully",
            data: response,
        }
    }

    @Post("/deliverable/:deliverableId")
    @ApiCreatedResponse({
        type: ArtifactResDto,
    })
    @UseGuards(PoliciesGuard)
    @UseFilters(FileCleanupFilter)
    @CheckPolicies((ability: AppAbility) => ability.can(Action.UploadFile, "ARTIFACT"))
    @UseInterceptors(
        FileInterceptor("file", {
            storage: diskStorage({
                destination: (req, file, cb) => {
                    const deliverableId = req.params.deliverableId
                    const uploadPath = join("./uploads/deliverables", deliverableId)
                    fs.mkdirSync(uploadPath, { recursive: true })
                    cb(null, uploadPath)
                },
                filename: (req, file, cb) => {
                    const ext = extname(file.originalname)
                    const fileName = `${crypto.randomUUID()}${ext}`
                    cb(null, fileName)
                },
            }),
            limits: { fileSize: MAX_ARTIFACT_SIZE },
            fileFilter: (req, file, cb) => {
                const ext = extname(file.originalname).toLowerCase()
                if (BLOCKED_FILE_EXTENSION.includes(ext)) {
                    return cb(new BadRequestException("Invalid file type"), false)
                }
                cb(null, true)
            },
        }),
    )
    async createArtifactDeliverable(
        @UploadedFile() file: Express.Multer.File,
        @Param() param: CreateArtifactDeliverableParamsReqDto,
        @Body() dto: CreateArtifactDeliverableReqDto,
        @Request() request: RequestDto,
    ): Promise<BaseResDto<ArtifactResDto>> {
        this.loggerService.info(this.constructor.name, this.createArtifactDeliverable.name, `user: ${request.user.sub}`)
        if (!file) {
            throw new InvalidInputException(["File is required"])
        }
        const fileInfo = {
            fileName: file.filename,
            mimeType: file.mimetype,
            path: file.path,
            size: file.size,
        }
        const response = await this.artifactService.createArtifactDeliverable(
            param.deliverableId,
            dto,
            fileInfo,
            request.user.mainCourseId,
            request.user.sub,
        )
        return {
            message: "Artifact saved successfully",
            data: response,
        }
    }

    @Get(":id")
    @UseGuards(PoliciesGuard)
    @CheckPolicies((ability: AppAbility) => ability.can(Action.Read, "ARTIFACT"))
    async getById(@Param() param: GetByIdArtifactReqDto, @Res() res: express.Response, @Request() request: RequestDto) {
        this.loggerService.info(this.constructor.name, this.getById.name, `user: ${request.user.sub}`)

        const response = await this.artifactService.getById(
            param.id,
            request.user.mainCourseId,
            request.user.sub,
            request.user.mainRole,
        )

        if (!fs.existsSync(response.filePath)) {
            throw new ArtifactNotFoundException()
        }

        const viewable = ["image/", "video/", "application/pdf"]
        if (!viewable.some((prefix) => response.data.mimeType.startsWith(prefix))) {
            throw new FileCannotBeViewedException()
        }

        res.setHeader("Content-Type", response.data.mimeType)
        res.setHeader("Content-Disposition", `inline; filename="${response.data.name}"`)

        const stream = fs.createReadStream(response.filePath)
        stream.on("error", (err) => {
            this.loggerService.error(this.constructor.name, this.getById.name, err.message)
            throw new InternalServerErrorException()
        })

        stream.pipe(res)
    }

    @Get(":id/download")
    @UseGuards(PoliciesGuard)
    @CheckPolicies((ability: AppAbility) => ability.can(Action.Read, "ARTIFACT"))
    async downloadById(
        @Param() param: GetByIdArtifactReqDto,
        @Res() res: express.Response,
        @Request() request: RequestDto,
    ) {
        this.loggerService.info(this.constructor.name, this.downloadById.name, `user: ${request.user.sub}`)

        const response = await this.artifactService.getById(
            param.id,
            request.user.mainCourseId,
            request.user.sub,
            request.user.mainRole,
        )

        if (!fs.existsSync(response.filePath)) {
            throw new ArtifactNotFoundException()
        }

        const encodedFileName = encodeURIComponent(response.data.fileName)

        res.set({
            "Content-Type": response.data.mimeType || "application/octet-stream",
            "Content-Disposition": `attachment; filename="${response.data.fileName}"; filename*=UTF-8''${encodedFileName}`,
        })

        fs.createReadStream(response.filePath).pipe(res)
    }

    @Get("/project/:projectId")
    @ApiOkResponse({
        type: PaginationResDto<ArtifactResDto[]>,
    })
    @UseGuards(PoliciesGuard)
    @CheckPolicies((ability: AppAbility) => ability.can(Action.Read, "ARTIFACT"))
    async getAllByProjectId(
        @Param() param: GetAllArtifactByProjectParamsReqDto,
        @Query() queryParams: GetAllArtifactReqDto,
        @Request() request: RequestDto,
    ): Promise<BaseResDto<PaginationResDto<ArtifactResDto[]>>> {
        this.loggerService.info(this.constructor.name, this.getAllByProjectId.name, `user: ${request.user.sub}`)

        const response = await this.artifactService.getAllByProjectId(
            param.projectId,
            queryParams,
            request.user.mainCourseId,
        )
        return {
            message: "Artifacts found successfully",
            data: response,
        }
    }

    @Get("/group/:groupId")
    @ApiOkResponse({
        type: PaginationResDto<ArtifactResDto[]>,
    })
    @UseGuards(PoliciesGuard)
    @CheckPolicies((ability: AppAbility) => ability.can(Action.Read, "ARTIFACT"))
    async getAllByGroupId(
        @Param() param: GetAllArtifactByGroupParamsReqDto,
        @Query() queryParams: GetAllArtifactReqDto,
        @Request() request: RequestDto,
    ): Promise<BaseResDto<PaginationResDto<ArtifactResDto[]>>> {
        this.loggerService.info(this.constructor.name, this.getAllByGroupId.name, `user: ${request.user.sub}`)

        const response = await this.artifactService.getAllByGroupId(
            param.groupId,
            queryParams,
            request.user.mainCourseId,
        )
        return {
            message: "Artifacts found successfully",
            data: response,
        }
    }

    @Put(":id/deliverable/:deliverableId")
    @ApiOkResponse({
        type: ArtifactResDto,
    })
    @UseGuards(PoliciesGuard)
    @CheckPolicies((ability: AppAbility) => ability.can(Action.Update, "ARTIFACT"))
    @UseFilters(FileCleanupFilter)
    @UseInterceptors(
        FileInterceptor("file", {
            storage: diskStorage({
                destination: (req, file, cb) => {
                    const deliverableId = req.params.deliverableId
                    const uploadPath = join("./uploads/deliverables", deliverableId)
                    fs.mkdirSync(uploadPath, { recursive: true })
                    cb(null, uploadPath)
                },
                filename: (req, file, cb) => {
                    const ext = extname(file.originalname)
                    const fileName = `${crypto.randomUUID()}${ext}`
                    cb(null, fileName)
                },
            }),
            limits: { fileSize: MAX_ARTIFACT_SIZE },
            fileFilter: (req, file, cb) => {
                const ext = extname(file.originalname).toLowerCase()
                if (BLOCKED_FILE_EXTENSION.includes(ext)) {
                    return cb(new BadRequestException("Invalid file type"), false)
                }
                cb(null, true)
            },
        }),
    )
    async updateFile(
        @UploadedFile() file: Express.Multer.File,
        @Param() param: UpdateByIdArtifactReqDto,
        @Request() request: RequestDto,
    ): Promise<BaseResDto<ArtifactResDto>> {
        this.loggerService.info(this.constructor.name, this.updateFile.name, `user: ${request.user.sub}`)
        const fileInfo = {
            fileName: file.filename,
            mimeType: file.mimetype,
            path: file.path,
            size: file.size,
        }
        const response = await this.artifactService.updateFileById(
            param.id,
            param.deliverableId,
            fileInfo,
            request.user.mainCourseId,
            request.user.sub,
            request.user.mainRole,
        )

        return {
            message: "Artifact updated successfully",
            data: response,
        }
    }

    @Delete(":id")
    @ApiNoContentResponse()
    @UseGuards(PoliciesGuard)
    @CheckPolicies((ability: AppAbility) => ability.can(Action.Delete, "ARTIFACT"))
    async delete(@Param() param: DeleteArtifactReqDto, @Request() request: RequestDto): Promise<void> {
        this.loggerService.info(this.constructor.name, this.delete.name, `user: ${request.user.sub}`)

        await this.artifactService.deleteById(
            param.id,
            request.user.mainCourseId,
            request.user.sub,
            request.user.mainRole,
        )
    }
}
