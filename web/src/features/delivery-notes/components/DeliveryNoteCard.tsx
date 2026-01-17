import type { DeliveryNote } from '../types/DeliveryNote';
import { StatusBadge } from './StatusBadge';
import { format } from 'date-fns';
import { es } from 'date-fns/locale';

/**
 * COMPONENT: DeliveryNoteCard
 * 
 * 🏗️ ANALOGÍA DE CONSTRUCCIÓN:
 * Es como un "Panel Prefabricado" o una "Ficha Técnica" de una obra.
 * Agrupa varios materiales (StatusBadge, textos) en una unidad coherente.
 * Se usa para mostrar un resumen rápido en el listado (inventario de obras).
 */

interface DeliveryNoteCardProps {
    note: DeliveryNote;
    onClick: (id: string) => void;
}

export function DeliveryNoteCard({ note, onClick }: DeliveryNoteCardProps) {
    // Formatear precio como moneda (Value Object implícito en UI)
    const formattedPrice = new Intl.NumberFormat('es-ES', {
        style: 'currency',
        currency: 'EUR'
    }).format(note.totalAmount);



    return (
        <div
            onClick={() => onClick(note.id)}
            className="bg-white rounded-lg shadow-sm border border-gray-200 p-4 hover:shadow-md transition-shadow cursor-pointer"
        >
            <div className="flex justify-between items-start mb-2">
                <div>
                    <h3 className="font-semibold text-gray-900">{note.customerName}</h3>
                    <p className="text-sm text-gray-500 font-mono">
                        {note.number || `#${note.id.slice(0, 8)}`}
                    </p>
                </div>
                <StatusBadge status={note.status} />
            </div>

            <div className="flex justify-between items-end mt-4">
                <div className="text-sm text-gray-600">
                    <p>{format(new Date(note.date), 'dd/MM/yyyy')}</p>
                    <p>{note.items.length} {note.items.length === 1 ? 'item' : 'items'}</p>
                </div>
                <div className="font-bold text-lg text-gray-900">
                    {formattedPrice}
                </div>
            </div>
        </div>
    );
}
