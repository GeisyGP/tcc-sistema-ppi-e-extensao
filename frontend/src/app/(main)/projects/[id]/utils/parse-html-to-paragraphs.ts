import { Paragraph, TextRun, HeadingLevel, AlignmentType } from "docx"

export const parseHtmlToParagraphs = (html: string): Paragraph[] => {
    const parser = new DOMParser()
    const doc = parser.parseFromString(html, "text/html")
    const paragraphs: Paragraph[] = []

    const createRuns = (
        node: ChildNode,
        formatting: {
            bold?: boolean
            italics?: boolean
            underline?: boolean
            strike?: boolean
            highlight?: string
        } = {},
    ): TextRun[] => {
        if (node.nodeType === Node.TEXT_NODE) {
            return [
                new TextRun({
                    text: node.textContent || "",
                    bold: formatting.bold,
                    italics: formatting.italics,
                    underline: formatting.underline ? {} : undefined,
                    strike: formatting.strike,
                    size: 24,
                }),
            ]
        }

        if (node.nodeType !== Node.ELEMENT_NODE) return []

        const el = node as HTMLElement
        const newFormatting = { ...formatting }

        switch (el.tagName) {
            case "STRONG":
            case "B":
                newFormatting.bold = true
                break
            case "EM":
            case "I":
                newFormatting.italics = true
                break
            case "U":
                newFormatting.underline = true
                break
            case "S":
                newFormatting.strike = true
                break
            case "MARK":
                newFormatting.highlight = "yellow"
                break
        }

        const runs: TextRun[] = []
        el.childNodes.forEach((child) => {
            runs.push(...createRuns(child, newFormatting))
        })

        return runs
    }

    const parseElement = (el: HTMLElement) => {
        switch (el.tagName) {
            case "P":
                paragraphs.push(
                    new Paragraph({
                        children: createRuns(el),
                        alignment: AlignmentType.JUSTIFIED,
                        spacing: { after: 200 },
                    }),
                )
                break
            case "H1":
                paragraphs.push(
                    new Paragraph({
                        children: createRuns(el),
                        heading: HeadingLevel.HEADING_1,
                        alignment: AlignmentType.CENTER,
                        spacing: { after: 200 },
                    }),
                )
                break
            case "H2":
                paragraphs.push(
                    new Paragraph({
                        children: createRuns(el),
                        heading: HeadingLevel.HEADING_2,
                        alignment: AlignmentType.CENTER,
                        spacing: { after: 150 },
                    }),
                )
                break
            case "H3":
                paragraphs.push(
                    new Paragraph({
                        children: createRuns(el),
                        heading: HeadingLevel.HEADING_3,
                        alignment: AlignmentType.CENTER,
                        spacing: { after: 100 },
                    }),
                )
                break
            case "UL":
                el.querySelectorAll("li").forEach((li) => {
                    paragraphs.push(
                        new Paragraph({
                            children: createRuns(li),
                            bullet: { level: 0 },
                            alignment: AlignmentType.JUSTIFIED,
                            spacing: { after: 100 },
                        }),
                    )
                })
                break
            case "OL":
                el.querySelectorAll("li").forEach((li) => {
                    paragraphs.push(
                        new Paragraph({
                            children: createRuns(li),
                            numbering: { reference: "numbered", level: 0 },
                            alignment: AlignmentType.JUSTIFIED,
                            spacing: { after: 100 },
                        }),
                    )
                })
                break
            default:
                el.childNodes.forEach((child) => {
                    if (child.nodeType === Node.ELEMENT_NODE) parseElement(child as HTMLElement)
                })
        }
    }

    doc.body.childNodes.forEach((node) => {
        if (node.nodeType === Node.ELEMENT_NODE) parseElement(node as HTMLElement)
    })

    return paragraphs
}
