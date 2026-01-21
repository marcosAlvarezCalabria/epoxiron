import type React from 'react'

interface PaginationProps {
    currentPage: number
    totalItems: number
    itemsPerPage: number
    onPageChange: (page: number) => void
    onItemsPerPageChange: (itemsPerPage: number) => void
}

export function Pagination({
    currentPage,
    totalItems,
    itemsPerPage,
    onPageChange,
    onItemsPerPageChange
}: PaginationProps) {
    const totalPages = Math.ceil(totalItems / itemsPerPage)

    // Calculate generic range: mostrando X - Y de Z
    const startItem = totalItems === 0 ? 0 : (currentPage - 1) * itemsPerPage + 1
    const endItem = Math.min(currentPage * itemsPerPage, totalItems)

    const handlePrev = () => {
        if (currentPage > 1) onPageChange(currentPage - 1)
    }

    const handleNext = () => {
        if (currentPage < totalPages) onPageChange(currentPage + 1)
    }

    // Logic to generate page numbers (truncated)
    const renderPageNumbers = () => {
        const pages: (number | string)[] = []

        // Always show first page
        pages.push(1)

        // Logic for "..."
        // We want to show current, current-1, current+1, and last page always.
        if (currentPage > 3) {
            pages.push('...')
        }

        // Neighbors
        const rangeStart = Math.max(2, currentPage - 1)
        const rangeEnd = Math.min(totalPages - 1, currentPage + 1)

        for (let i = rangeStart; i <= rangeEnd; i++) {
            pages.push(i)
        }

        if (currentPage < totalPages - 2) {
            pages.push('...')
        }

        // Always show last page if > 1
        if (totalPages > 1) {
            pages.push(totalPages)
        }

        return pages
    }

    if (totalItems === 0) return null

    return (
        <nav
            className="flex flex-col sm:flex-row items-center justify-between gap-4 py-4 px-4 bg-gray-900/50 border-t border-gray-700 mt-auto"
            aria-label="Paginación"
        >
            {/* 1. Info de registros */}
            <div className="text-sm text-gray-400 order-1 sm:order-1" aria-live="polite">
                Mostrando <span className="font-medium text-white">{startItem}-{endItem}</span> de <span className="font-medium text-white">{totalItems}</span>
            </div>

            {/* 2. Navegación */}
            <div className="flex items-center gap-1 order-2 sm:order-2">
                <button
                    onClick={handlePrev}
                    disabled={currentPage === 1}
                    className="w-10 h-10 flex items-center justify-center rounded-lg border border-gray-700 bg-gray-800 text-gray-300 hover:bg-gray-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                    aria-label="Página anterior"
                >
                    <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
                    </svg>
                </button>

                <div className="hidden sm:flex items-center gap-1">
                    {renderPageNumbers().map((p, idx) => (
                        p === '...' ? (
                            <span key={`dots-${idx}`} className="w-10 h-10 flex items-center justify-center text-gray-500">...</span>
                        ) : (
                            <button
                                key={p}
                                onClick={() => onPageChange(p as number)}
                                className={`w-10 h-10 flex items-center justify-center rounded-lg border text-sm font-medium transition-colors ${currentPage === p
                                        ? 'bg-blue-600 border-blue-600 text-white'
                                        : 'bg-gray-800 border-gray-700 text-gray-300 hover:bg-gray-700'
                                    }`}
                                aria-current={currentPage === p ? 'page' : undefined}
                            >
                                {p}
                            </button>
                        )
                    ))}
                </div>

                {/* Mobile Page Current Indicator */}
                <div className="sm:hidden flex items-center px-2 text-sm text-gray-300">
                    <span className="font-medium text-white">{currentPage}</span> / {totalPages}
                </div>

                <button
                    onClick={handleNext}
                    disabled={currentPage === totalPages}
                    className="w-10 h-10 flex items-center justify-center rounded-lg border border-gray-700 bg-gray-800 text-gray-300 hover:bg-gray-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                    aria-label="Página siguiente"
                >
                    <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                    </svg>
                </button>
            </div>

            {/* 3. Selector de registros por página */}
            <div className="flex items-center gap-2 order-3 sm:order-3">
                <select
                    id="page-size"
                    value={itemsPerPage}
                    onChange={(e) => onItemsPerPageChange(Number(e.target.value))}
                    className="h-10 rounded-lg bg-gray-800 border border-gray-700 text-gray-300 text-sm focus:ring-2 focus:ring-blue-600 px-3 cursor-pointer"
                    aria-label="Registros por página"
                >
                    <option value="25">25 por pág</option>
                    <option value="50">50 por pág</option>
                    <option value="100">100 por pág</option>
                </select>
            </div>
        </nav>
    )
}
