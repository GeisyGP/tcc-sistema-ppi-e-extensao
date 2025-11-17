import {
    Document,
    Packer,
    Paragraph,
    TextRun,
    AlignmentType,
    Table,
    TableRow,
    TableCell,
    WidthType,
    BorderStyle,
} from "docx"
import { parseHtmlToParagraphs } from "./parse-html-to-paragraphs"
import { generateProjectOverviewTable } from "./course-table"
import { ProjectOverview } from "@/types/project.type"

export const generateDocx = async (
    overviewData: ProjectOverview,
    projectData: Record<string, string>,
    fileName: string,
) => {
    const table = generateProjectOverviewTable(overviewData)

    const contentTables = Object.entries(projectData)
        .map(([title, content]) => {
            const paragraphs = parseHtmlToParagraphs(content)
            return [
                new Paragraph({
                    children: [new TextRun({ text: title, bold: true, size: 28 })],
                    alignment: AlignmentType.START,
                    spacing: { after: 100 },
                }),
                new Table({
                    width: { size: 100, type: WidthType.PERCENTAGE },
                    borders: {
                        top: { style: BorderStyle.SINGLE, size: 2, color: "000000" },
                        bottom: { style: BorderStyle.SINGLE, size: 2, color: "000000" },
                        left: { style: BorderStyle.SINGLE, size: 2, color: "000000" },
                        right: { style: BorderStyle.SINGLE, size: 2, color: "000000" },
                        insideHorizontal: { style: BorderStyle.SINGLE, size: 1, color: "000000" },
                        insideVertical: { style: BorderStyle.SINGLE, size: 1, color: "000000" },
                    },
                    rows: [
                        new TableRow({
                            children: [
                                new TableCell({
                                    children: paragraphs,
                                }),
                            ],
                        }),
                    ],
                }),
                new Paragraph({ children: [new TextRun("")], spacing: { after: 200 } }),
            ]
        })
        .flat()

    const doc = new Document({
        sections: [
            {
                children: [
                    new Paragraph({
                        alignment: AlignmentType.CENTER,
                        spacing: { after: 300 },
                        children: [
                            new TextRun({
                                text: "PROJETO DE PRÁTICA PROFISSIONAL INTEGRADA - PPI",
                                bold: true,
                                size: 32,
                            }),
                        ],
                    }),
                    table,
                    new Paragraph({ children: [new TextRun("")], spacing: { after: 200 } }),
                    ...contentTables,
                ],
            },
        ],
    })

    const blob = await Packer.toBlob(doc)
    const url = window.URL.createObjectURL(blob)
    const a = document.createElement("a")
    a.href = url
    a.download = fileName
    document.body.appendChild(a)
    a.click()
    document.body.removeChild(a)
    window.URL.revokeObjectURL(url)
}
