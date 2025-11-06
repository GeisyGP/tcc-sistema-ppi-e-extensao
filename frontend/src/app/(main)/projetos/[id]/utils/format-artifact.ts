import { Artifact, ArtifactRes } from "@/types/artifact.type"

export function formatArtifact(res: ArtifactRes): Artifact {
    return {
        id: res.id,
        name: res.name,
        fileName: res.fileName,
        mimeType: res.mimeType,
        size: res.size,
        groupId: res.groupId,
        createdBy: res.createdBy,
        updatedBy: res.updatedBy,
        createdAt: new Date(res.createdAt).toLocaleDateString(),
        updatedAt: new Date(res.updatedAt).toLocaleDateString(),
    }
}
