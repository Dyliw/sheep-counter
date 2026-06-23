// components/Typing/AdvancedStats.jsx
import React, { useState, useEffect } from 'react';
import './AdvancedStats.css';

function AdvancedStats({ estadisticas, historialTeclas, textoObjetivo, textoUser }) {
    const [statsDetalladas, setStatsDetalladas] = useState({
        wpmActual: 0,
        wpmPromedio: 0,
        wpmMaximo: 0,
        cpm: 0,
        precisionGeneral: 100,
        erroresPorTipo: {
            sustitucion: 0,
            omision: 0,
            insercion: 0,
            mayusculas: 0
        },
        tiempoRespuestaPromedio: 0,
        consistencia: 0,
        rachaActual: 0,
        rachaMaxima: 0,
        palabrasCompletadas: 0,
        palabrasCorrectas: 0,
        palabrasIncorrectas: 0,
        progresoPrecision: [],
        progresoVelocidad: [],
        areaMejora: []
    });

    // Calcular WPM - CORREGIDO
    const calcularWPM = () => {
        // Usar estadisticas.tiempo (viene de StatsRow)
        if (!estadisticas?.tiempo || estadisticas.tiempo === 0) return 0;
        const minutos = estadisticas.tiempo / 60;
        const palabras = textoUser.length / 5;
        return minutos > 0 ? Math.round(palabras / minutos) : 0;
    };

    // Calcular CPM - CORREGIDO
    const calcularCPM = () => {
        if (!estadisticas?.tiempo || estadisticas.tiempo === 0) return 0;
        const minutos = estadisticas.tiempo / 60;
        return minutos > 0 ? Math.round(textoUser.length / minutos) : 0;
    };

    // Analizar errores - CORREGIDO (usar estadisticas.caracteresIncorrectos)
    const analizarErrores = () => {
        const tipos = {
            sustitucion: 0,
            omision: 0,
            insercion: 0,
            mayusculas: 0
        };

        for (let i = 0; i < Math.min(textoUser.length, textoObjetivo.length); i++) {
            if (textoUser[i] !== textoObjetivo[i]) {
                if (textoUser[i]?.toLowerCase() === textoObjetivo[i]?.toLowerCase()) {
                    tipos.mayusculas++;
                } else {
                    tipos.sustitucion++;
                }
            }
        }

        // Omisiones (faltan caracteres)
        if (textoUser.length < textoObjetivo.length) {
            tipos.omision = textoObjetivo.length - textoUser.length;
        }

        // Inserciones (sobran caracteres)
        if (textoUser.length > textoObjetivo.length) {
            tipos.insercion = textoUser.length - textoObjetivo.length;
        }

        return tipos;
    };

    // Calcular tiempo de respuesta - CORREGIDO
    const calcularTiempoRespuesta = () => {
        if (!historialTeclas || historialTeclas.length < 2) return 0;

        let total = 0;
        let count = 0;

        for (let i = 1; i < historialTeclas.length; i++) {
            const actual = historialTeclas[i]?.timestamp;
            const anterior = historialTeclas[i - 1]?.timestamp;

            if (!actual || !anterior) continue;

            const diff = actual - anterior;

            if (diff > 0 && diff < 5000) { // menos de 5 segundos
                total += diff;
                count++;
            }
        }

        return count > 0 ? Math.round(total / count) : 0;
    };

    // Calcular consistencia - CORREGIDO
    const calcularConsistencia = () => {
        if (!historialTeclas || historialTeclas.length < 5) return 100;
        
        const tiempos = [];
        for (let i = 1; i < historialTeclas.length; i++) {
            const diff = historialTeclas[i].timestamp - historialTeclas[i-1].timestamp;
            if (diff > 0 && diff < 5000) {
                tiempos.push(diff);
            }
        }
        
        if (tiempos.length === 0) return 100;
        
        const promedio = tiempos.reduce((a, b) => a + b, 0) / tiempos.length;
        const desviacion = Math.sqrt(
            tiempos.map(t => Math.pow(t - promedio, 2))
                  .reduce((a, b) => a + b, 0) / tiempos.length
        );
        
        // Consistencia inversamente proporcional a la desviación
        const consistencia = Math.max(0, 100 - (desviacion / promedio * 50));
        return Math.min(100, Math.round(consistencia));
    };

    // Analizar palabras - CORREGIDO
    const analizarPalabras = () => {
        const palabrasObjetivo = textoObjetivo.split(' ');
        const palabrasUsuario = textoUser.split(' ');
        
        let correctas = 0;
        let incorrectas = 0;
        
        palabrasUsuario.forEach((palabra, index) => {
            if (index < palabrasObjetivo.length) {
                if (palabra === palabrasObjetivo[index]) {
                    correctas++;
                } else {
                    incorrectas++;
                }
            }
        });

        return {
            completadas: palabrasUsuario.length,
            correctas,
            incorrectas
        };
    };

    // Actualizar stats - CORREGIDO
    useEffect(() => {
        // Verificar que estadisticas existe
        if (!estadisticas) return;

        const wpm = calcularWPM();
        const cpm = calcularCPM();
        const tiposError = analizarErrores();
        const tiempoRespuesta = calcularTiempoRespuesta();
        const palabras = analizarPalabras();
        const consistencia = calcularConsistencia();

        const areas = [];
        if (tiposError.sustitucion > 3) areas.push("Precisión de teclas");
        if (tiposError.mayusculas > 2) areas.push("Uso de mayúsculas");
        if (tiempoRespuesta > 500) areas.push("Velocidad de reacción");
        if (consistencia < 70) areas.push("Consistencia en el ritmo");
        if (wpm < 30 && textoUser.length > 20) areas.push("Velocidad de escritura");

        setStatsDetalladas(prev => {
            // Actualizar progreso (últimos 20 valores)
            const nuevoProgresoPrecision = [...(prev.progresoPrecision || []), estadisticas.precision || 100];
            const nuevoProgresoVelocidad = [...(prev.progresoVelocidad || []), wpm];

            if (nuevoProgresoPrecision.length > 20) nuevoProgresoPrecision.shift();
            if (nuevoProgresoVelocidad.length > 20) nuevoProgresoVelocidad.shift();

            // Calcular promedio de WPM (solo si hay valores previos)
            const wpmPromedio = prev.wpmPromedio === 0 
                ? wpm 
                : Math.round((prev.wpmPromedio + wpm) / 2);

            return {
                ...prev,
                wpmActual: wpm,
                wpmPromedio: wpmPromedio,
                wpmMaximo: Math.max(prev.wpmMaximo || 0, wpm),
                cpm: cpm,
                precisionGeneral: estadisticas.precision || 100,
                erroresPorTipo: tiposError,
                tiempoRespuestaPromedio: tiempoRespuesta,
                consistencia: consistencia,
                rachaActual: estadisticas.racha || 0,
                rachaMaxima: estadisticas.mejorRacha || 0,
                palabrasCompletadas: palabras.completadas,
                palabrasCorrectas: palabras.correctas,
                palabrasIncorrectas: palabras.incorrectas,
                progresoPrecision: nuevoProgresoPrecision,
                progresoVelocidad: nuevoProgresoVelocidad,
                areaMejora: areas
            };
        });

    }, [textoUser, estadisticas, historialTeclas, textoObjetivo]);

    // Renderizado condicional si no hay estadísticas
    if (!estadisticas) {
        return <div className="advanced-stats">Cargando estadísticas...</div>;
    }

    return (
        <div className="advanced-stats">
            <h3 className="stats-title">Estadísticas Avanzadas</h3>
            
            <div className="stats-grid">
                {/* Velocidad */}
                <div className="stat-card velocidad-card">
                    <div className="stat-header">
                        <span className="stat-icon"></span>
                        <h4>Velocidad</h4>
                    </div>
                    <div className="stat-content">
                        <div className="stat-row">
                            <span>WPM Actual:</span>
                            <strong className="stat-value highlight">
                                {statsDetalladas.wpmActual}
                            </strong>
                        </div>
                        <div className="stat-row">
                            <span>WPM Promedio:</span>
                            <strong>{statsDetalladas.wpmPromedio}</strong>
                        </div>
                        <div className="stat-row">
                            <span>WPM Máximo:</span>
                            <strong className="stat-value max">
                                {statsDetalladas.wpmMaximo}
                            </strong>
                        </div>
                        <div className="stat-row">
                            <span>CPM:</span>
                            <strong>{statsDetalladas.cpm}</strong>
                        </div>
                        <div className="stat-row">
                            <span>Caracteres:</span>
                            <strong>{textoUser?.length || 0}</strong>
                        </div>
                    </div>
                </div>

                {/* Precisión */}
                <div className="stat-card precision-card">
                    <div className="stat-header">
                        <span className="stat-icon"></span>
                        <h4>Precisión</h4>
                    </div>
                    <div className="stat-content">
                        <div className="stat-row">
                            <span>General:</span>
                            <strong className="stat-value precision">
                                {statsDetalladas.precisionGeneral}%
                            </strong>
                        </div>
                        <div className="error-breakdown">
                            <div className="error-item">
                                <span className="error-label">Sustitución:</span>
                                <span className="error-value">{statsDetalladas.erroresPorTipo.sustitucion}</span>
                            </div>
                            <div className="error-item">
                                <span className="error-label">Omisión:</span>
                                <span className="error-value">{statsDetalladas.erroresPorTipo.omision}</span>
                            </div>
                            <div className="error-item">
                                <span className="error-label">Inserción:</span>
                                <span className="error-value">{statsDetalladas.erroresPorTipo.insercion}</span>
                            </div>
                            <div className="error-item">
                                <span className="error-label">Mayúsculas:</span>
                                <span className="error-value">{statsDetalladas.erroresPorTipo.mayusculas}</span>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Tiempo y Reacción */}
                <div className="stat-card tiempo-card">
                    <div className="stat-header">
                        <span className="stat-icon"></span>
                        <h4>Tiempo & Reacción</h4>
                    </div>
                    <div className="stat-content">
                        <div className="stat-row">
                            <span>Tiempo total:</span>
                            <strong>{estadisticas.tiempo || 0}s</strong>
                        </div>
                        <div className="stat-row">
                            <span>Respuesta promedio:</span>
                            <strong>
                                {statsDetalladas.tiempoRespuestaPromedio > 0 
                                    ? `${statsDetalladas.tiempoRespuestaPromedio}ms` 
                                    : '0ms'}
                            </strong>
                        </div>
                        <div className="stat-row">
                            <span>Consistencia:</span>
                            <strong>
                                <div className="consistency-bar">
                                    <div 
                                        className="consistency-fill"
                                        style={{ width: `${statsDetalladas.consistencia}%` }}
                                    />
                                </div>
                                {statsDetalladas.consistencia}%
                            </strong>
                        </div>
                    </div>
                </div>

                {/* Rachas */}
                <div className="stat-card racha-card">
                    <div className="stat-header">
                        <span className="stat-icon"></span>
                        <h4>Rachas</h4>
                    </div>
                    <div className="stat-content">
                        <div className="stat-row">
                            <span>Racha actual:</span>
                            <strong className={`stat-value ${statsDetalladas.rachaActual > 10 ? 'fire' : ''}`}>
                                {statsDetalladas.rachaActual} caracteres
                            </strong>
                        </div>
                        <div className="stat-row">
                            <span>Mejor racha:</span>
                            <strong className="stat-value max">{statsDetalladas.rachaMaxima}</strong>
                        </div>
                    </div>
                </div>

                {/* Análisis de Palabras */}
                <div className="stat-card palabras-card">
                    <div className="stat-header">
                        <span className="stat-icon"></span>
                        <h4>Palabras</h4>
                    </div>
                    <div className="stat-content">
                        <div className="stat-row">
                            <span>Completadas:</span>
                            <strong>{statsDetalladas.palabrasCompletadas}</strong>
                        </div>
                        <div className="stat-row">
                            <span>Correctas:</span>
                            <strong className="success">{statsDetalladas.palabrasCorrectas}</strong>
                        </div>
                        <div className="stat-row">
                            <span>Incorrectas:</span>
                            <strong className="error">{statsDetalladas.palabrasIncorrectas}</strong>
                        </div>
                    </div>
                </div>

                {/* Mini gráfico de progreso */}
                <div className="stat-card grafico-card">
                    <div className="stat-header">
                        <span className="stat-icon"></span>
                        <h4>Progreso</h4>
                    </div>
                    <div className="mini-chart">
                        <div className="chart-label">Precisión (%)</div>
                        <div className="chart-bars">
                            {(statsDetalladas.progresoPrecision || []).map((valor, i) => (
                                <div 
                                    key={`p-${i}`}
                                    className="chart-bar precision-bar"
                                    style={{ height: `${valor}%` }}
                                    title={`Precisión: ${valor}%`}
                                />
                            ))}
                        </div>
                        <div className="chart-label" style={{ marginTop: '10px' }}>Velocidad (WPM)</div>
                        <div className="chart-bars">
                            {(statsDetalladas.progresoVelocidad || []).map((valor, i) => {
                                // Normalizar altura para gráfico (máximo 100)
                                const altura = Math.min(100, valor * 2); // Escala para WPM
                                return (
                                    <div 
                                        key={`v-${i}`}
                                        className="chart-bar velocidad-bar"
                                        style={{ height: `${altura}%` }}
                                        title={`WPM: ${valor}`}
                                    />
                                );
                            })}
                        </div>
                    </div>
                </div>
            </div>

            {/* Áreas de mejora */}
            {statsDetalladas.areaMejora.length > 0 && (
                <div className="improvement-areas">
                    <h4>Áreas de mejora</h4>
                    <div className="improvement-tags">
                        {statsDetalladas.areaMejora.map((area, index) => (
                            <span key={index} className="improvement-tag">
                                {area}
                            </span>
                        ))}
                    </div>
                </div>
            )}

            {/* Consejos personalizados */}
            <div className="tips-section">
                <h4>Consejos</h4>
                <ul className="tips-list">
                    {statsDetalladas.wpmActual < 30 && statsDetalladas.wpmActual > 0 && (
                        <li>Practica ejercicios de velocidad con palabras cortas</li>
                    )}
                    {statsDetalladas.precisionGeneral < 90 && (
                        <li>Concéntrate en la precisión, reduce la velocidad</li>
                    )}
                    {statsDetalladas.erroresPorTipo.mayusculas > 0 && (
                        <li>Revisa el uso de mayúsculas, especialmente al inicio de oraciones</li>
                    )}
                    {statsDetalladas.consistencia < 70 && (
                        <li>Mantén un ritmo constante, evita acelerones y pausas</li>
                    )}
                    {statsDetalladas.tiempoRespuestaPromedio > 500 && statsDetalladas.tiempoRespuestaPromedio > 0 && (
                        <li>Anticipa las siguientes palabras para reducir tiempo de reacción</li>
                    )}
                    {textoUser.length === 0 && (
                        <li>Empieza a escribir para ver tus estadísticas</li>
                    )}
                </ul>
            </div>
        </div>
    );
}

export default AdvancedStats;