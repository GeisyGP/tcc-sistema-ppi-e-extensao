export const jwtConstants = {
    secret: process.env.JWT_SECRET,
    expiresTime: process.env.JWT_EXPIRES_TIME || "3600s",
}
export const ROOT_COURSE_ID = "4c4d352b-6bd6-4cd7-8862-4d156d5a99d6"
export const ONE_MB_IN_BYTES = 1_000_000
