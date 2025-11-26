import { ProjectOverview } from "@/types/project.type"
import { Paragraph, Table, TableRow, TableCell, TextRun, WidthType } from "docx"

export const generateProjectOverviewTable = (data: ProjectOverview) => {
    const table = new Table({
        width: { size: 100, type: WidthType.PERCENTAGE },
        rows: [
            new TableRow({
                children: [
                    new TableCell({
                        children: [
                            new Paragraph({
                                children: [
                                    new TextRun({
                                        text: "Eixo Tecnológico: ",
                                        bold: true,
                                        size: 24,
                                    }),
                                    new TextRun({
                                        text: data.technologicalAxis,
                                        size: 24,
                                    }),
                                ],
                            }),
                        ],
                        columnSpan: 3,
                    }),
                ],
            }),
            new TableRow({
                children: [
                    new TableCell({
                        children: [
                            new Paragraph({
                                children: [
                                    new TextRun({ text: "Curso / Forma ou Grau / Modalidade: ", bold: true, size: 24 }),
                                ],
                            }),
                            new Paragraph({
                                children: [new TextRun({ text: ` Curso: ${data.courseName}`, size: 24 })],
                            }),
                            new Paragraph({
                                children: [
                                    new TextRun({
                                        text: ` Forma/Grau: ${data.educationLevel}/${data.degree}`,
                                        size: 24,
                                    }),
                                ],
                            }),
                            new Paragraph({
                                children: [new TextRun({ text: ` Modalidade: ${data.modality}`, size: 24 })],
                            }),
                        ],
                        columnSpan: 3,
                    }),
                ],
            }),
            new TableRow({
                children: [
                    new TableCell({
                        children: [
                            new Paragraph({
                                children: [
                                    new TextRun({
                                        text: "Ano/Semestre: ",
                                        bold: true,
                                        size: 24,
                                    }),
                                    new TextRun({
                                        text: data.executionPeriod,
                                        size: 24,
                                    }),
                                ],
                            }),
                        ],
                    }),
                    new TableCell({
                        children: [
                            new Paragraph({
                                children: [
                                    new TextRun({
                                        text: "Semestre ou ano da turma: ",
                                        bold: true,
                                        size: 24,
                                    }),
                                    new TextRun({
                                        text: data.ppiClassPeriod,
                                        size: 24,
                                    }),
                                ],
                            }),
                        ],
                    }),
                    new TableCell({
                        children: [
                            new Paragraph({
                                children: [
                                    new TextRun({
                                        text: "Carga Horária: ",
                                        bold: true,
                                        size: 24,
                                    }),
                                    new TextRun({
                                        text: `${data.workload}`,
                                        size: 24,
                                    }),
                                ],
                            }),
                        ],
                    }),
                ],
            }),
            new TableRow({
                children: [
                    new TableCell({
                        children: [
                            new Paragraph({
                                children: [
                                    new TextRun({
                                        text: "Turno: ",
                                        bold: true,
                                        size: 24,
                                    }),
                                    new TextRun({
                                        text: data.shift,
                                        size: 24,
                                    }),
                                ],
                            }),
                        ],
                    }),
                    new TableCell({
                        children: [
                            new Paragraph({
                                children: [
                                    new TextRun({
                                        text: "Turma: ",
                                        bold: true,
                                        size: 24,
                                    }),
                                    new TextRun({
                                        text: data.class,
                                        size: 24,
                                    }),
                                ],
                            }),
                        ],
                        columnSpan: 2,
                    }),
                ],
            }),
            new TableRow({
                children: [
                    new TableCell({
                        children: [
                            new Paragraph({
                                children: [
                                    new TextRun({
                                        text: "Diretor(a) Geral do Campus: ",
                                        bold: true,
                                        size: 24,
                                    }),
                                    new TextRun({
                                        text: data.campusDirector,
                                        size: 24,
                                    }),
                                ],
                            }),
                        ],
                        columnSpan: 3,
                    }),
                ],
            }),
            new TableRow({
                children: [
                    new TableCell({
                        children: [
                            new Paragraph({
                                children: [
                                    new TextRun({
                                        text: "Diretor(a) de Ensino: ",
                                        bold: true,
                                        size: 24,
                                    }),
                                    new TextRun({
                                        text: data.academicDirector,
                                        size: 24,
                                    }),
                                ],
                            }),
                        ],
                        columnSpan: 3,
                    }),
                ],
            }),
            new TableRow({
                children: [
                    new TableCell({
                        columnSpan: 3,
                        children: [
                            new Paragraph({
                                children: [
                                    new TextRun({
                                        text: "Componentes Curriculares Envolvidos (com detalhamento de carga horária): ",
                                        bold: true,
                                        size: 24,
                                    }),
                                ],
                                spacing: { after: 100 },
                            }),
                            ...data.subjects.map(
                                (subject) =>
                                    new Paragraph({
                                        text:
                                            `${subject.name ?? "Disciplina"} (${subject.workload}h)` +
                                            (subject.isCoordinator ? " — Coordenadora" : ""),
                                        bullet: { level: 0 },
                                    }),
                            ),
                        ],
                    }),
                ],
            }),
        ],
    })

    return table
}
