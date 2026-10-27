
/**
 * SIGSS - Popup institucional
 * Mensajes, confirmaciones y selección de formato.
 */
(() => {
    'use strict';

    const ICONOS = {
        cargando: `
            <svg viewBox="0 0 24 24" fill="none"
                stroke="currentColor" stroke-width="1.8"
                stroke-linecap="round" stroke-linejoin="round">
                <path d="M12 3a9 9 0 1 0 9 9"/>
                <path d="M12 7v5l3 2"/>
            </svg>
        `,
        exito: `
            <svg viewBox="0 0 24 24" fill="none"
                stroke="currentColor" stroke-width="1.8"
                stroke-linecap="round" stroke-linejoin="round">
                <circle cx="12" cy="12" r="9"/>
                <path d="m8 12 2.5 2.5L16 9"/>
            </svg>
        `,
        error: `
            <svg viewBox="0 0 24 24" fill="none"
                stroke="currentColor" stroke-width="1.8"
                stroke-linecap="round" stroke-linejoin="round">
                <circle cx="12" cy="12" r="9"/>
                <path d="m9 9 6 6m0-6-6 6"/>
            </svg>
        `,
        confirmacion: `
            <svg viewBox="0 0 24 24" fill="none"
                stroke="currentColor" stroke-width="1.8"
                stroke-linecap="round" stroke-linejoin="round">
                <circle cx="12" cy="12" r="9"/>
                <path d="M12 11v5m0-8h.01"/>
            </svg>
        `,
        formato: `
            <svg viewBox="0 0 24 24" fill="none"
                stroke="currentColor" stroke-width="1.8"
                stroke-linecap="round" stroke-linejoin="round">
                <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"/>
                <path d="M14 2v6h6M8 13h8M8 17h8"/>
            </svg>
        `
    };

    let overlay = null;
    let resolverConfirmacion = null;
    let resolverFormato = null;
    let elementoAnterior = null;
    let bloqueoAnterior = '';

    function ObtenerContenedor() {
        if (overlay) return overlay;

        overlay = document.createElement('div');
        overlay.className = 'sigss-popup-overlay';
        overlay.setAttribute('aria-hidden', 'true');

        overlay.innerHTML = `
            <section
                class="sigss-popup"
                role="dialog"
                aria-modal="true"
                aria-labelledby="sigss-popup-titulo"
                aria-describedby="sigss-popup-mensaje"
                tabindex="-1"
            >
                <div class="sigss-popup-icono"></div>
                <h2 class="sigss-popup-titulo"
                    id="sigss-popup-titulo"></h2>
                <p class="sigss-popup-mensaje"
                    id="sigss-popup-mensaje"></p>
                <div class="sigss-popup-spinner"
                    hidden aria-hidden="true"></div>
                <div class="sigss-popup-acciones"></div>
            </section>
        `;

        document.body.appendChild(overlay);
        overlay.addEventListener('keydown', ManejarTeclado);

        return overlay;
    }

    function CerrarInterno(resultadoConfirmacion = false) {
        if (!overlay) return;

        const resolverC = resolverConfirmacion;
        const resolverF = resolverFormato;

        resolverConfirmacion = null;
        resolverFormato = null;

        overlay.classList.remove('is-visible');
        overlay.setAttribute('aria-hidden', 'true');

        overlay.querySelector('.sigss-popup')
            .removeAttribute('aria-busy');

        document.body.style.overflow = bloqueoAnterior;

        if (resolverC) resolverC(resultadoConfirmacion);
        if (resolverF) resolverF(null);

        const focoAnterior = elementoAnterior;
        elementoAnterior = null;

        if (focoAnterior && focoAnterior.isConnected) {
            focoAnterior.focus({ preventScroll: true });
        }
    }

    function Mostrar({
        tipo,
        titulo,
        mensaje,
        mostrarSpinner = false,
        botones = []
    }) {
        const contenedor = ObtenerContenedor();

        // Resolver cualquier diálogo pendiente antes de reemplazarlo.
        if (resolverConfirmacion || resolverFormato) {
            CerrarInterno(false);
        }

        elementoAnterior = document.activeElement;
        bloqueoAnterior = document.body.style.overflow;

        const ventana = contenedor.querySelector('.sigss-popup');
        const icono = contenedor.querySelector('.sigss-popup-icono');
        const tituloElemento =
            contenedor.querySelector('.sigss-popup-titulo');
        const mensajeElemento =
            contenedor.querySelector('.sigss-popup-mensaje');
        const spinner =
            contenedor.querySelector('.sigss-popup-spinner');
        const acciones =
            contenedor.querySelector('.sigss-popup-acciones');

        ventana.className = `sigss-popup sigss-popup--${tipo}`;

        icono.innerHTML = ICONOS[tipo] || ICONOS.confirmacion;
        tituloElemento.textContent = titulo;
        mensajeElemento.textContent = mensaje;

        spinner.hidden = !mostrarSpinner;
        acciones.replaceChildren();

        botones.forEach((configuracion) => {
            const boton = document.createElement('button');

            boton.type = 'button';
            boton.className =
                `sigss-popup-boton ${configuracion.clase}`;
            boton.textContent = configuracion.texto;
            boton.addEventListener('click', configuracion.accion);

            acciones.appendChild(boton);
        });

        contenedor.setAttribute('aria-hidden', 'false');
        document.body.style.overflow = 'hidden';
        contenedor.classList.add('is-visible');

        if (mostrarSpinner) {
            ventana.setAttribute('aria-busy', 'true');
        } else {
            ventana.removeAttribute('aria-busy');
        }

        const primerBoton = acciones.querySelector('button');

        if (primerBoton) {
            primerBoton.focus({ preventScroll: true });
        } else {
            ventana.focus({ preventScroll: true });
        }
    }

    function Cerrar() {
        CerrarInterno(false);
    }

    function Cargando(
        mensaje = 'Estamos procesando tu solicitud...'
    ) {
        Mostrar({
            tipo: 'cargando',
            titulo: 'Un momento, por favor',
            mensaje,
            mostrarSpinner: true
        });
    }

    function Exito(
        mensaje = 'La operación se completó correctamente.'
    ) {
        Mostrar({
            tipo: 'exito',
            titulo: '¡Operación exitosa!',
            mensaje,
            botones: [{
                texto: 'Aceptar',
                clase: 'sigss-popup-boton--principal',
                accion: Cerrar
            }]
        });
    }

    function ErrorPopup(
        mensaje = 'Ocurrió un error inesperado.'
    ) {
        Mostrar({
            tipo: 'error',
            titulo: 'No fue posible completar la operación',
            mensaje,
            botones: [{
                texto: 'Aceptar',
                clase: 'sigss-popup-boton--principal',
                accion: Cerrar
            }]
        });
    }

    function Confirmar(
        mensaje = '¿Deseas continuar?',
        opciones = {}
    ) {
        Mostrar({
            tipo: 'confirmacion',
            titulo: opciones.titulo || 'Confirmar operación',
            mensaje,
            botones: [
                {
                    texto: opciones.cancelar || 'Cancelar',
                    clase: 'sigss-popup-boton--secundario',
                    accion: () => CerrarInterno(false)
                },
                {
                    texto: opciones.aceptar || 'Sí, continuar',
                    clase: 'sigss-popup-boton--principal',
                    accion: () => CerrarInterno(true)
                }
            ]
        });

        return new Promise((resolve) => {
            resolverConfirmacion = resolve;
        });
    }

    function SeleccionarFormato() {
        Mostrar({
            tipo: 'formato',
            titulo: 'Exportar documento',
            mensaje: 'Selecciona el formato que deseas generar.'
        });

        const acciones =
            overlay.querySelector('.sigss-popup-acciones');

        acciones.innerHTML = `
            <div class="sigss-popup-formatos">
                <label class="sigss-popup-formato">
                    <input type="radio" name="sigss-formato"
                        value="xlsx" checked>
                    <span class="sigss-popup-formato-icono sigss-xlsx">
                        XLSX
                    </span>
                    <span class="sigss-popup-formato-texto">
                        <strong>Excel</strong>
                        <small>Editable en hojas de cálculo</small>
                    </span>
                </label>

                <label class="sigss-popup-formato">
                    <input type="radio" name="sigss-formato"
                        value="pdf">
                    <span class="sigss-popup-formato-icono sigss-pdf">
                        PDF
                    </span>
                    <span class="sigss-popup-formato-texto">
                        <strong>PDF</strong>
                        <small>Ideal para consultar e imprimir</small>
                    </span>
                </label>
            </div>

            <div class="sigss-popup-acciones-botones">
                <button type="button"
                    class="sigss-popup-boton sigss-popup-boton--secundario"
                    data-accion="cancelar">
                    Cancelar
                </button>
                <button type="button"
                    class="sigss-popup-boton sigss-popup-boton--principal"
                    data-accion="exportar">
                    Exportar
                </button>
            </div>
        `;

        return new Promise((resolve) => {
            resolverFormato = resolve;

            acciones.querySelector('[data-accion="cancelar"]')
                .addEventListener('click', Cerrar);

            acciones.querySelector('[data-accion="exportar"]')
                .addEventListener('click', () => {
                    const seleccionado =
                        acciones.querySelector(
                            'input[name="sigss-formato"]:checked'
                        );

                    const formato = seleccionado
                        ? seleccionado.value
                        : 'xlsx';

                    const resolver = resolverFormato;
                    resolverFormato = null;

                    CerrarInterno();
                    if (resolver) resolver(formato);
                });
        });
    }

    function ManejarTeclado(evento) {
        if (!overlay?.classList.contains('is-visible')) return;

        if (evento.key === 'Escape') {
            const spinner =
                overlay.querySelector('.sigss-popup-spinner');

            // No cerrar la carga con Escape mientras está activa.
            if (spinner && !spinner.hidden) {
                evento.preventDefault();
                return;
            }

            evento.preventDefault();
            CerrarInterno(false);
            return;
        }

        if (evento.key === 'Tab') {
            const ventana = overlay.querySelector('.sigss-popup');
            const elementos = [
                ...ventana.querySelectorAll(
                    'button:not(:disabled), input:not(:disabled)'
                )
            ].filter((elemento) => elemento.offsetParent !== null);

            if (!elementos.length) {
                evento.preventDefault();
                ventana.focus();
                return;
            }

            const primero = elementos[0];
            const ultimo = elementos[elementos.length - 1];

            if (evento.shiftKey &&
                document.activeElement === primero) {
                evento.preventDefault();
                ultimo.focus();
            } else if (!evento.shiftKey &&
                document.activeElement === ultimo) {
                evento.preventDefault();
                primero.focus();
            }
        }
    }

    window.Popup = Object.freeze({
        cargando: Cargando,
        exito: Exito,
        error: ErrorPopup,
        confirmar: Confirmar,
        seleccionarFormato: SeleccionarFormato,
        cerrar: Cerrar
    });
})();
