export const jwtConstants = {
    secret: process.env.JWT_SECRET,
    expiresTime: process.env.JWT_EXPIRES_TIME || "3600s",
}
export const ROOT_COURSE_ID = "4c4d352b-6bd6-4cd7-8862-4d156d5a99d6"
export const ONE_MB_IN_BYTES = 1024 * 1024
export const MAX_ARTIFACT_SIZE = 200 * ONE_MB_IN_BYTES
export const BLOCKED_FILE_EXTENSION = [".exe", ".bat", ".cmd", ".sh", ".msi", ".dll", ".com"]
