import type { DeliveryNote } from '../types/DeliveryNote';

/**
 * COMPONENT: StatusBadge
 * 
 * 🏗️ ANALOGÍA DE CONSTRUCCIÓN:
 * Es como una "Etiqueta de Inspección" o "Sello de Calidad" que se pone en la obra.
 * - Gris (Draft): En planos, pendiente de revisión.
 * - Amarillo (Pending): Obra terminada, esperando aprobación final.
 * - Verde (Reviewed): Inspección pasada, todo aprobado.
 * 
 * Es una pieza prefabricada (componente funcional puro) que solo muestra información, no tiene lógica compleja.
 */

interface StatusBadgeProps {
    status: DeliveryNote['status'];
}

export function StatusBadge({ status }: StatusBadgeProps) {
    const getStyles = () => {
        switch (status) {
            case 'draft':
                return 'bg-gray-100 text-gray-800 border-gray-200';
            case 'pending':
                return 'bg-yellow-100 text-yellow-800 border-yellow-200';
            case 'reviewed':
                return 'bg-green-100 text-green-800 border-green-200';
            default:
                return 'bg-gray-100 text-gray-800 border-gray-200';
        }
    };

    const getLabel = () => {
        switch (status) {
            case 'draft':
                return 'Borrador'; // UI en Español
            case 'pending':
                return 'Pendiente'; // UI en Español
            case 'reviewed':
                return 'Revisado'; // UI en Español
            default:
                return status;
        }
    };

    return (
        <span className={`px-2.5 py-0.5 rounded-full text-xs font-medium border ${getStyles()}`}>
            {getLabel()}
        </span>
    );
}
