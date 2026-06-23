// components/ModoHistoria/ModoHistoriaFragmentado.jsx
import React, { useState, useEffect, useRef } from 'react';
import './historia.css';

function ModoHistoriaFragmentado({ historia, onExit }) {
    const [progreso, setProgreso] = useState({
        libroId: historia.id,
        fragmentoActual: 0,
        fragmentosCompletados: [],
        progresoTotal: 0,
        textoUsuario: '',
        errores: [],
        xpGanada: 0,
        ultimoGuardado: null
    });

    const [fragmentos, setFragmentos] = useState([]);
    const [estadisticas, setEstadisticas] = useState({
        precision: 100,
        wpm: 0,
        tiempo: 0,
        racha: 0
    });

    const inputRef = useRef(null);
    const timerRef = useRef(null);
    const textareaRef = useRef(null);

    // Dividir el texto en fragmentos (oraciones o párrafos)
    useEffect(() => {
        if (historia?.contenido) {
            // Dividir por oraciones (., !, ?) o puedes dividir por párrafos
            const oraciones = historia.contenido
                .split(/(?<=[.!?])\s+/)
                .filter(oracion => oracion.trim().length > 0)
                .map((oracion, index) => ({
                    id: index,
                    texto: oracion,
                    longitud: oracion.length,
                    completado: false
                }));

            // También puedes agrupar varias oraciones si son muy cortas
            const fragmentosAgrupados = [];
            for (let i = 0; i < oraciones.length; i += 3) {
                const grupo = oraciones.slice(i, i + 3);
                fragmentosAgrupados.push({
                    id: fragmentosAgrupados.length,
                    texto: grupo.map(o => o.texto).join(' '),
                    oraciones: grupo,
                    longitud: grupo.reduce((acc, o) => acc + o.texto.length, 0)
                });
            }

            setFragmentos(fragmentosAgrupados);
        }
    }, [historia]);

    // Cargar progreso guardado
    useEffect(() => {
        const progresoGuardado = localStorage.getItem(`progreso_${historia.id}`);
        if (progresoGuardado) {
            setProgreso(JSON.parse(progresoGuardado));
        }
    }, [historia.id]);

    // Guardar progreso automáticamente
    useEffect(() => {
        if (progreso.fragmentosCompletados.length > 0) {
            localStorage.setItem(`progreso_${historia.id}`, JSON.stringify(progreso));
        }
    }, [progreso, historia.id]);

    // Timer para WPM
    useEffect(() => {
        if (progreso.textoUsuario.length > 0 && !timerRef.current) {
            timerRef.current = setInterval(() => {
                setEstadisticas(prev => ({
                    ...prev,
                    tiempo: prev.tiempo + 1
                }));
            }, 1000);
        }

        return () => clearInterval(timerRef.current);
    }, [progreso.textoUsuario.length]);

    // Calcular precisión y errores
    useEffect(() => {
        const fragmentoActual = fragmentos[progreso.fragmentoActual];
        if (!fragmentoActual) return;

        const textoObjetivo = fragmentoActual.texto;
        const nuevosErrores = [];
        
        for (let i = 0; i < progreso.textoUsuario.length; i++) {
            if (progreso.textoUsuario[i] !== textoObjetivo[i]) {
                nuevosErrores.push(i);
            }
        }

        setProgreso(prev => ({ ...prev, errores: nuevosErrores }));

        const precision = progreso.textoUsuario.length > 0
            ? Math.round(((progreso.textoUsuario.length - nuevosErrores.length) / progreso.textoUsuario.length) * 100)
            : 100;

        const wpm = progreso.textoUsuario.length > 0 && estadisticas.tiempo > 0
            ? Math.round((progreso.textoUsuario.length / 5) / (estadisticas.tiempo / 60))
            : 0;

        setEstadisticas(prev => ({
            ...prev,
            precision,
            wpm,
            racha: nuevosErrores.length === 0 ? progreso.textoUsuario.length : 0
        }));

        // Verificar si completó el fragmento
        if (progreso.textoUsuario === textoObjetivo) {
            completarFragmento();
        }
    }, [progreso.textoUsuario, progreso.fragmentoActual, fragmentos]);

    const completarFragmento = () => {
        const xpGanada = Math.floor(fragmentos[progreso.fragmentoActual].longitud / 10);
        
        setProgreso(prev => ({
            ...prev,
            fragmentosCompletados: [...prev.fragmentosCompletados, prev.fragmentoActual],
            progresoTotal: prev.progresoTotal + 1,
            xpGanada: prev.xpGanada + xpGanada,
            textoUsuario: '',
            fragmentoActual: prev.fragmentoActual + 1,
            ultimoGuardado: new Date().toISOString()
        }));

        // Mostrar mensaje de logro
        mostrarLogro(` Fragmento completado +${xpGanada} XP`);

        // Auto-focus en el textarea
        setTimeout(() => {
            textareaRef.current?.focus();
        }, 100);
    };

    const mostrarLogro = (mensaje) => {
        const toast = document.createElement('div');
        toast.className = 'logro-toast';
        toast.textContent = mensaje;
        document.body.appendChild(toast);
        
        setTimeout(() => {
            toast.remove();
        }, 2000);
    };

    const saltarFragmento = () => {
        if (progreso.fragmentoActual < fragmentos.length - 1) {
            setProgreso(prev => ({
                ...prev,
                fragmentoActual: prev.fragmentoActual + 1,
                textoUsuario: ''
            }));
        }
    };

    const reiniciarCapitulo = () => {
        setProgreso({
            libroId: historia.id,
            fragmentoActual: 0,
            fragmentosCompletados: [],
            progresoTotal: 0,
            textoUsuario: '',
            errores: [],
            xpGanada: 0,
            ultimoGuardado: null
        });
        setEstadisticas({
            precision: 100,
            wpm: 0,
            tiempo: 0,
            racha: 0
        });
        clearInterval(timerRef.current);
        timerRef.current = null;
    };

    if (fragmentos.length === 0) {
        return <div className="cargando">Cargando historia...</div>;
    }

    const fragmentoActual = fragmentos[progreso.fragmentoActual];
    const progresoPorcentaje = (progreso.fragmentoActual / fragmentos.length) * 100;

    return (
        <div className="modo-historia-fragmentado">
            {/* Barra superior */}
            <div className="historia-header">
                <button className="btn-exit" onClick={onExit}>← Biblioteca</button>
                <div className="historia-titulo-header">
                    <h2>{historia.libro}</h2>
                    <span className="capitulo-badge">{historia.titulo}</span>
                </div>
                <div className="xp-counter">
                    <span className="xp-icon">✨</span>
                    <span className="xp-value">{progreso.xpGanada}</span>
                </div>
            </div>

            {/* Barra de progreso general */}
            <div className="progreso-general">
                <div className="progreso-barra">
                    <div 
                        className="progreso-llenado"
                        style={{ width: `${progresoPorcentaje}%` }}
                    />
                </div>
                <span className="progreso-texto">
                    Fragmento {progreso.fragmentoActual + 1} de {fragmentos.length}
                </span>
            </div>

            {/* Estadísticas rápidas */}
            <div className="estadisticas-rapidas">
                <div className="stat">
                    <span className="stat-label">Precisión</span>
                    <span className="stat-value" style={{ color: estadisticas.precision > 95 ? '#4CAF50' : '#f44336' }}>
                        {estadisticas.precision}%
                    </span>
                </div>
                <div className="stat">
                    <span className="stat-label">WPM</span>
                    <span className="stat-value">{estadisticas.wpm}</span>
                </div>
                <div className="stat">
                    <span className="stat-label">Racha</span>
                    <span className="stat-value">{estadisticas.racha}</span>
                </div>
                <div className="stat">
                    <span className="stat-label">Tiempo</span>
                    <span className="stat-value">{Math.floor(estadisticas.tiempo / 60)}:{(estadisticas.tiempo % 60).toString().padStart(2, '0')}</span>
                </div>
            </div>

            {/* Área principal de lectura/escritura */}
            <div className="area-lectura">
                <div className="panel-superior">
                    <h3 className="fragmento-titulo">
                        Fragmento {progreso.fragmentoActual + 1}
                        <span className="fragmento-longitud">({fragmentoActual.longitud} caracteres)</span>
                    </h3>
                    
                    {/* Botones de control */}
                    <div className="fragmento-controles">
                        <button 
                            className="btn-control"
                            onClick={saltarFragmento}
                            disabled={progreso.fragmentoActual >= fragmentos.length - 1}
                            title="Saltar al siguiente fragmento"
                        >
                            ⏭️ Saltar
                        </button>
                        <button 
                            className="btn-control"
                            onClick={reiniciarCapitulo}
                            title="Reiniciar capítulo"
                        >
                            ↺ Reiniciar
                        </button>
                    </div>
                </div>

                {/* Texto a copiar (solo el fragmento actual) */}
                <div className="texto-objetivo">
                    {fragmentoActual.texto.split('').map((caracter, index) => {
                        let clase = 'caracter';
                        if (index < progreso.textoUsuario.length) {
                            clase += progreso.textoUsuario[index] === caracter ? ' correcto' : ' error';
                        } else if (index === progreso.textoUsuario.length) {
                            clase += ' actual';
                        }
                        return (
                            <span key={index} className={clase}>
                                {caracter === ' ' ? '␣' : caracter}
                            </span>
                        );
                    })}
                </div>

                {/* Área de escritura */}
                <textarea
                    ref={textareaRef}
                    className="area-escritura"
                    value={progreso.textoUsuario}
                    onChange={(e) => setProgreso(prev => ({ ...prev, textoUsuario: e.target.value }))}
                    placeholder="Escribe aquí el texto de arriba..."
                    autoFocus
                />

                {/* Barra de progreso del fragmento */}
                <div className="progreso-fragmento">
                    <div className="progreso-fragmento-barra">
                        <div 
                            className="progreso-fragmento-llenado"
                            style={{ width: `${(progreso.textoUsuario.length / fragmentoActual.longitud) * 100}%` }}
                        />
                    </div>
                    <span className="progreso-fragmento-texto">
                        {progreso.textoUsuario.length}/{fragmentoActual.longitud} caracteres
                    </span>
                </div>

                {/* Miniaturas de fragmentos */}
                <div className="miniaturas-fragmentos">
                    {fragmentos.map((frag, index) => (
                        <div
                            key={frag.id}
                            className={`miniatura-fragmento ${
                                progreso.fragmentosCompletados.includes(index) ? 'completado' : ''
                            } ${progreso.fragmentoActual === index ? 'actual' : ''}`}
                            onClick={() => {
                                if (progreso.fragmentosCompletados.includes(index) || index <= progreso.fragmentoActual) {
                                    setProgreso(prev => ({ ...prev, fragmentoActual: index, textoUsuario: '' }));
                                }
                            }}
                            title={`Fragmento ${index + 1}: ${frag.longitud} caracteres`}
                        >
                            <span className="miniatura-numero">{index + 1}</span>
                            {progreso.fragmentosCompletados.includes(index) && (
                                <span className="miniatura-check">✓</span>
                            )}
                        </div>
                    ))}
                </div>
            </div>

            {/* Mensaje de completado del capítulo */}
            {progreso.fragmentoActual >= fragmentos.length && (
                <div className="capitulo-completado">
                    <h2>🎉 ¡Capítulo completado!</h2>
                    <p>Has ganado {progreso.xpGanada} XP en total</p>
                    <button className="btn-siguiente" onClick={onExit}>
                        Volver a la biblioteca
                    </button>
                </div>
            )}
        </div>
    );
}

export default ModoHistoriaFragmentado;