export default function HomeSkeleton() {
    return (
        <main className="flex flex-col items-center w-full py-10 animate-pulse">
            <div className="h-8 bg-gray-200 rounded w-40 mb-8" />

            <div className="w-full max-w-6xl p-8 rounded-xl border border-gray-200 shadow-sm space-y-10">
                <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
                    <div className="md:col-span-2">
                        <div className="bg-gray-50 rounded-xl p-6 space-y-8 border border-gray-100 shadow-sm">
                            <div className="flex items-center gap-3">
                                <div className="w-12 h-12 rounded-full bg-gray-200 shadow-sm" />
                            </div>

                            <div className="space-y-2">
                                <div className="h-3 bg-gray-200 rounded w-24" />
                                <div className="h-4 bg-gray-200 rounded w-32" />
                            </div>

                            <div className="space-y-2">
                                <div className="h-3 bg-gray-200 rounded w-16" />

                                <div className="space-y-1">
                                    <div className="flex items-center gap-2">
                                        <div className="h-4 bg-gray-200 rounded w-20" />
                                        <div className="h-3 bg-gray-200 rounded w-10" />
                                    </div>
                                    <div className="flex items-center gap-2">
                                        <div className="h-4 bg-gray-200 rounded w-24" />
                                        <div className="h-3 bg-gray-200 rounded w-12" />
                                    </div>
                                </div>
                            </div>
                            <div className="flex justify-end">
                                <div className="h-8 bg-gray-200 rounded w-24" />
                            </div>
                        </div>
                    </div>

                    <div className="md:col-span-2 space-y-6">
                        <div className="h-5 bg-gray-200 rounded w-32" />

                        <div className="grid grid-cols-2 sm:grid-cols-2 gap-4">
                            {[...Array(4)].map((_, i) => (
                                <div
                                    key={i}
                                    className="p-6 rounded-xl border border-gray-200 shadow-sm flex flex-col items-center gap-3"
                                >
                                    <div className="w-8 h-8 bg-gray-200 rounded" />
                                    <div className="h-3 bg-gray-200 w-16 rounded" />
                                </div>
                            ))}
                        </div>
                    </div>
                </div>

                <div className="space-y-4">
                    <div className="h-5 bg-gray-200 rounded w-56" />

                    <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-2 lg:grid-cols-3 gap-4">
                        {[...Array(3)].map((_, i) => (
                            <div
                                key={i}
                                className="p-4 rounded-xl border border-gray-200 shadow-sm flex flex-col gap-3"
                            >
                                <div className="h-5 bg-gray-200 rounded w-3/4" />
                                <div className="h-3 bg-gray-200 rounded w-20" />
                                <div className="h-3 bg-gray-200 rounded w-24" />
                                <div className="h-3 bg-gray-200 rounded w-28" />
                            </div>
                        ))}
                    </div>
                </div>
            </div>
        </main>
    )
}
