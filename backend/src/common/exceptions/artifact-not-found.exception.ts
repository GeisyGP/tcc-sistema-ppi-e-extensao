import { NotFoundException } from "@nestjs/common"
import { ApiStatus } from "../enums/api-status.enum"

export class ArtifactNotFoundException extends NotFoundException {
    constructor() {
        super("Artifact not found", ApiStatus.ARTIFACT_NOT_FOUND)
    }
}
