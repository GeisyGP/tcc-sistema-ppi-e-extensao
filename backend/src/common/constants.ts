export const jwtConstants = {
    secret: process.env.JWT_SECRET,
    expiresTime: process.env.JWT_EXPIRES_TIME || "3600s",
}
