
interface ConfirmationModalProps {
    isOpen: boolean
    title: string
    message: string
    confirmText?: string
    cancelText?: string
    isDestructive?: boolean
    onConfirm: () => void
    onCancel: () => void
}

export function ConfirmationModal({
    isOpen,
    title,
    message,
    confirmText = 'Continuar',
    cancelText = 'Cancelar',
    isDestructive = false,
    onConfirm,
    onCancel
}: ConfirmationModalProps) {
    if (!isOpen) return null

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm">
            <div
                className="bg-gray-800 rounded-xl border border-gray-700 shadow-2xl max-w-md w-full overflow-hidden animate-in fade-in zoom-in duration-200"
                role="dialog"
                aria-modal="true"
                aria-labelledby="modal-title"
            >
                <div className="p-6">
                    <h3 id="modal-title" className="text-xl font-bold text-white mb-2">
                        {title}
                    </h3>
                    <p className="text-gray-300 mb-6 leading-relaxed">
                        {message}
                    </p>

                    <div className="flex justify-end gap-3">
                        <button
                            onClick={onCancel}
                            className="px-4 py-2 rounded-lg text-gray-300 hover:text-white hover:bg-gray-700 transition-colors font-medium"
                        >
                            {cancelText}
                        </button>
                        <button
                            onClick={onConfirm}
                            className={`px-4 py-2 rounded-lg text-white font-medium shadow-lg transition-all ${isDestructive
                                    ? 'bg-red-600 hover:bg-red-700 shadow-red-900/20'
                                    : 'bg-blue-600 hover:bg-blue-700 shadow-blue-900/20'
                                }`}
                        >
                            {confirmText}
                        </button>
                    </div>
                </div>
            </div>
        </div>
    )
}
