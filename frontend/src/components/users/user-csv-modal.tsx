"use client"

import { useState } from "react"
import { Button } from "@/components/buttons/default.button"
import { UserRole } from "@/types/user.type"
import { roleMap } from "@/app/(main)/users/utils/format-user"

type UploadCsvModalProps = {
    isOpen: boolean
    onClose: () => void
    onUpload: (file: File) => Promise<void>
    role: UserRole
}

export function UploadCsvModal({ isOpen, onClose, onUpload, role }: UploadCsvModalProps) {
    const [selectedFile, setSelectedFile] = useState<File | null>(null)
    const [loading, setLoading] = useState(false)

    if (!isOpen) return null

    const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        if (e.target.files?.[0]) {
            setSelectedFile(e.target.files[0])
        }
    }

    const handleUpload = async () => {
        if (!selectedFile) return
        setLoading(true)
        try {
            await onUpload(selectedFile)
            setSelectedFile(null)
        } finally {
            setLoading(false)
            onClose()
        }
    }

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 px-4">
            <div className="bg-white rounded-lg p-6 w-full max-w-md max-h-[80vh] overflow-y-auto">
                <h2 className="text-lg font-semibold text-gray-900 mb-4">
                    Importar {roleMap[role].toLowerCase()}s via arquivo
                </h2>

                <p className="text-sm text-gray-600 mb-4">
                    Selecione um arquivo <b>.csv</b> ou <b>.txt</b> que contenha as colunas <b>name</b>,{" "}
                    <b>registration</b>, <b>email</b> e <b>password</b> no cabeçalho do arquivo.
                </p>

                <input
                    type="file"
                    accept=".csv,.txt"
                    onChange={handleFileChange}
                    className="block w-full mb-4 text-sm text-gray-700 file:border file:border-gray-300 file:rounded-lg file:px-3 file:py-2 file:bg-gray-50 hover:file:bg-gray-100"
                />

                <div className="flex justify-end gap-3">
                    <Button variant="secondary" onClick={onClose} disabled={loading}>
                        Cancelar
                    </Button>
                    <Button variant="primary" onClick={handleUpload} disabled={!selectedFile || loading}>
                        {loading ? "Enviando..." : "Importar"}
                    </Button>
                </div>
            </div>
        </div>
    )
}
