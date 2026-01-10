1️⃣ Introducción

La aplicación es una herramienta diseñada para digitalizar el proceso de recepción, medición y gestión de piezas metálicas que los clientes entregan para ser pintadas. Actualmente este proceso se realiza en papel y bolígrafo, lo cual provoca errores, pérdida de información y dificulta el control diario del trabajo.

El objetivo principal del proyecto es crear una aplicación web sencilla, rápida y optimizada para tablet, que permita:

Registrar clientes y sus tarifas asociadas.

Crear albaranes de manera fácil e intuitiva.

Añadir piezas con sus medidas, colores RAC y precios (opcionales).

Aplicar automáticamente tarifas mínimas y reglas de negocio.

Revisar un resumen diario con avisos y estados.

Mantener toda la información organizada, editable y lista para futuras integraciones (PDF, Excel, Sage, etc.).

La aplicación será utilizada por el dueño del taller y por cualquier trabajador responsable de medir piezas o gestionar albaranes.

2️⃣ Alcance del MVP
✅ Incluido en el MVP

Gestión de clientes

Crear cliente (nombre + tarifa asignada)

Listar clientes

Editar cliente (nombre y tarifa)

Eliminar cliente (solo si no tiene albaranes)

Gestión de tarifas

Crear tarifa ( nombre , y precios en ml y o en metros cuadrados, y si el grosor de la pieza es especial  )

Listar tarifas

Editar tarifa (precios base, mínimos y especiales)

Eliminar tarifas si no están en uso 

Gestión de albaranes

Seleccionar cliente para iniciar un albarán

Añadir piezas: nombre , medidas, cantidad, color RAC o especila si el color no es rac , precio opcional

Aplicación automática de tarifas y reglas de negocio (ejmplo : al crear la tarifa esta incluira un nombre , y cuando creemos un cliente)

Editar albaranes mientras no estén marcados como correctos

Listar albaranes con filtros

Eliminar albaranes recientes

Resumen del día

Ver todos los albaranes del día

Avisar si faltan precios

Marcar albaranes como “correctos”

Herramientas adicionales

Calculadora estándar integrada como botón de acceso rápido

❌ No incluido en el MVP

Exportar albaranes en PDF o Excel

Conexión con Sage

Gestión de roles

Estadísticas avanzadas

Control de inventario

App móvil nativa

3️⃣ Crear Albarán

Selección inicial del cliente

Campo obligatorio: Cliente

No se pueden mezclar piezas de distintos clientes

Información general del albarán

Número de albarán autogenerado

Fecha (autocompleta)

Botón “Añadir pieza” disponible solo tras seleccionar cliente

Añadir piezas

Campo	Tipo	Regla / Descripción
Nombre de la pieza	texto	obligatorio
Color	select RAC	obligatorio
Cantidad	número	obligatorio
Metros lineales (ml)	número	si está vacío y m² no → usar m²
Metros cuadrados (m²)	número	si está vacío y ml no → usar ml
Grosor	número	opcional; si vacío no cuenta
Precio	número	opcional (recordatorio diario si falta)

Lógica de medidas

Si ml y m² vacíos → aviso → tarifa mínima

Si uno vacío → usar el otro

Si ambos rellenados → usar el que aplique según tarifa

Tarifas

Aplicadas automáticamente según cliente

Tarifas especiales prevalecen sobre ml/m²

Precios editables desde “Editar tarifa”

Acciones dentro del albarán

Guardar borrador

Validar albarán

Finalizar albarán (futuro: PDF/Excel)

Estado del albarán

Borrador → editable

Validado → bloqueado salvo precios

Finalizado → listo para exportar

4️⃣ Listar Albaranes

Vista general

Columna	Descripción
Nº Albarán	Autogenerado
Cliente	Nombre del cliente
Fecha	Creación
Estado	Borrador / Validado / Finalizado
Piezas	Número total
Importe	Suma total (alerta si faltan precios)
Acciones	Editar / Ver / Finalizar / Eliminar

Filtros y búsqueda

Buscar por cliente

Buscar por nº albarán

Filtrar por fecha

Filtrar por estado

Acciones por albarán

Editar

Ver detalles

Validar

Finalizar

Eliminar (solo borrador)

Exportar PDF/Excel (futuro)

Indicadores visuales

🟡 Borrador

🟢 Validado

🔴 Faltan precios

Reglas especiales

Validar solo si piezas y medidas correctas

Finalizar posible aunque falten precios → marcado como pendiente

5️⃣ Crear Tarifa

Selección del cliente

Campo obligatorio: Cliente

Si ya tiene tarifa → aviso y permitir editar

Datos principales de la tarifa

Campo	Tipo	Regla / Descripción
Tarifa por metro lineal	número	opcional
Tarifa por metro cuadrado	número	opcional
Tarifa mínima	número	obligatoria
Tarifa especial por pieza	lista editable	opcional

Tarifa especial por pieza

Lista de piezas con precio fijo

Prevalece sobre ml/m²

Totalmente editable

Reglas de uso

Ml/m² vacíos → usar tarifa mínima

Tarifa especial siempre prevalece

Cambios afectan solo futuros albaranes

Acciones

Guardar / Actualizar / Eliminar (si no está en uso)

Validaciones obligatorias: tarifa mínima

6️⃣ Listar Tarifas

Vista general

Columna	Descripción
Cliente	Asociado
Tarifa mínima	Precio mínimo
Tarifa ml	Precio por metro lineal
Tarifa m²	Precio por metro cuadrado
Piezas con tarifa especial	Lista resumida
Acciones	Editar / Eliminar / Ver

Filtros y búsqueda

Por cliente, tarifa mínima o piezas especiales

Acciones por tarifa

Editar: precios base, mínimos, especiales

Eliminar: si no hay albaranes asociados

Ver detalle: todas las piezas con precios y reglas

Reglas especiales

Tarifa siempre aplicada al crear albarán

Tarifas especiales prevalecen

Cambios afectan solo futuros albaranes

7️⃣ Resumen del día

Vista general

Columna	Descripción
Nº Albarán	Autogenerado
Cliente	Nombre del cliente
Piezas	Número total
Importe	Suma de precios (alerta si faltan)
Estado	Borrador / Validado / Correcto
Avisos	Precios faltantes o medidas vacías
Acciones	Marcar como correcto / Ver detalles / Eliminar

Filtros y búsqueda

Cliente, estado, fecha

Acciones por albarán

Marcar como correcto

Ver detalles

Eliminar borrador

Exportar PDF/Excel (futuro)

Indicadores visuales

🟢 Correcto

🟡 Pendiente

🔴 Faltan precios

Reglas especiales

Tarifas mínimas aplicadas automáticamente

Albaranes finalizados aunque falten precios → pendientes

Sirve como control diario