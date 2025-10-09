export const ProjectStatus = {
    NOT_STARTED: "NOT_STARTED",
    STARTED: "STARTED",
    FINISHED: "FINISHED",
} as const
export type ProjectStatus = (typeof ProjectStatus)[keyof typeof ProjectStatus]
