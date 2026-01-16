import toast, { type ToastOptions } from 'react-hot-toast'

export class NotificationService {
    static success(message: string, options?: ToastOptions) {
        toast.success(message, {
            duration: 4000,
            position: 'top-right',
            style: {
                background: '#1F2937', // graphite-800
                color: '#fff',
                border: '1px solid #374151', // graphite-700
            },
            ...options
        })
    }

    static error(message: string, options?: ToastOptions) {
        toast.error(message, {
            duration: 5000,
            position: 'top-right',
            style: {
                background: '#1F2937', // graphite-800
                color: '#F87171', // red-400
                border: '1px solid #7F1D1D', // red-900
            },
            ...options
        })
    }

    static loading(message: string, options?: ToastOptions) {
        return toast.loading(message, {
            position: 'top-right',
            style: {
                background: '#1F2937',
                color: '#fff',
                border: '1px solid #374151',
            },
            ...options
        })
    }

    static dismiss(toastId?: string) {
        toast.dismiss(toastId)
    }
}
