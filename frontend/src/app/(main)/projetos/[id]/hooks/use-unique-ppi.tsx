import { useCallback, useState } from "react"
import toast from "react-hot-toast"
import { ApiError } from "@/exceptions/api-error.exception"
import { GENERIC_ERROR_MESSAGE } from "@/constants"
import { getPPIById } from "@/services/ppis.service"
import { PPI, PPIRes } from "@/types/ppi.type"
import { formatPPI } from "@/app/(main)/ppis/utils/format-ppi"

export function useUniquePPI() {
    const [ppiRawData, setPPIRawData] = useState<PPIRes>()
    const [ppiFormattedData, setPPIFormattedData] = useState<PPI>()
    const [ppiLoading, setPPILoading] = useState(false)

    const fetchPPI = useCallback(async (ppiId: string) => {
        setPPILoading(true)
        try {
            const response = await getPPIById(ppiId)
            if (response) {
                setPPIRawData(response)
                setPPIFormattedData(formatPPI(response))
            }
        } catch (error: any) {
            const errorMessage = error instanceof ApiError ? error.message : GENERIC_ERROR_MESSAGE
            toast.error(errorMessage)
        } finally {
            setPPILoading(false)
        }
    }, [])

    return {
        fetchPPI,
        ppiRawData,
        ppiFormattedData,
        ppiLoading,
    }
}
