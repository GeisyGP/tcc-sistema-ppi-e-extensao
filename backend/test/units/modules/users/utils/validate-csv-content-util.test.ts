import { validateCsvContent } from "src/modules/users/utils/validate-csv-content.util"
import { makeMockFile } from "../mocks/user.mock"

describe("validateCsvContent", () => {
    it("should validate a correct CSV with comma", async () => {
        const file = makeMockFile("name,registration,password\nJohn,123,abc\nJane,456,def")
        const result = await validateCsvContent(file)
        expect(result.valid).toBe(true)
        expect(result.data).toEqual([
            { name: "John", registration: "123", password: "abc" },
            { name: "Jane", registration: "456", password: "def" },
        ])
    })

    it("should fail if required columns are missing", async () => {
        const file = makeMockFile("name,registration\nJohn,123")
        const result = await validateCsvContent(file)
        expect(result.valid).toBe(false)
        expect(result.message).toMatch(/required columns/i)
    })

    it("should fail for empty file", async () => {
        const file = makeMockFile("")
        const result = await validateCsvContent(file)
        expect(result.valid).toBe(false)
        expect(result.message).toBe("Invalid file")
    })

    it("should validate a correct CSV with semicolon", async () => {
        const file = makeMockFile("name;registration;password\nJohn;123;abc")
        const result = await validateCsvContent(file)
        expect(result.valid).toBe(true)
        expect(result.data).toEqual([{ name: "John", registration: "123", password: "abc" }])
    })
})
