// components/GameModes/RPGBattleMode.jsx
import React, { useState, useEffect, useRef } from 'react';
import Timer from '../../Timer/Contador';
import perro from "../../../assets/images/Perro.png";
import './rpg.css';

// Banco de palabras para el modo defensa (ráfagas)
const DEFENSE_WORDS = [
    "golpe", "rápido", "fuego", "agua", "tierra", "aire", 
    "paralelepípedo", "espada", "magia", "poder", "ataque", "defensa",
    "rayo", "hielo", "roca", "viento", "sombra", "recibo de luz"
];

// Oraciones para el modo ataque (daño al enemigo)
const ATTACK_SENTENCES = [
    "En la radio hay un pollito",
    "Oye, eso es una ofensa para mi",
    "Noo, mis botones de gomita",
    "Hoy no fío, mañana sí",
    "3 doritos después",
    "Te voy a dar 3 consejos"
];

function RPGBattleMode({ onGameOver, onVictory }) {
    // Estado del juego
    const [turno, setTurno] = useState('jugador'); // 'jugador' o 'enemigo'
    const [enemigo, setEnemigo] = useState({
        nombre: 'Perrito no cariñosito',
        vida: 100,
        vidaMax: 100,
        nivel: 5,
        imagen: perro
    });
    
    const [jugador, setJugador] = useState({
        vida: 5,
        vidaMax: 5,
        puntuacion: 0
    });

    // Estado para el texto a escribir
    const [palabraActual, setPalabraActual] = useState('');
    const [textoUser, setTextoUser] = useState('');
    const [oracionAtaque, setOracionAtaque] = useState('');
    
    // Estado para feedback visual
    const [mensaje, setMensaje] = useState('');
    const [efectoDanio, setEfectoDanio] = useState(false);
    const [efectoCuracion, setEfectoCuracion] = useState(false);
    const [contadorAciertos, setContadorAciertos] = useState(0);
    
    const inputRef = useRef(null);

    // Inicializar turno
    useEffect(() => {
        if (turno === 'jugador') {
            iniciarTurnoJugador();
        } else {
            iniciarTurnoEnemigo();
        }
    }, [turno]);

    // Turno del jugador (ATAQUE)
    const iniciarTurnoJugador = () => {
        const oracionAleatoria = ATTACK_SENTENCES[Math.floor(Math.random() * ATTACK_SENTENCES.length)];
        setOracionAtaque(oracionAleatoria);
        setTextoUser('');
        inputRef.current?.focus();
    };

    // Turno del enemigo (DEFENSA con ráfagas)
    const iniciarTurnoEnemigo = () => {
        const palabraAleatoria = DEFENSE_WORDS[Math.floor(Math.random() * DEFENSE_WORDS.length)];
        setPalabraActual(palabraAleatoria);
        setMensaje(`⚔️ ¡EL ENEMIGO ATACA! Escribe "${palabraAleatoria}" rápidamente`);
        setTextoUser('');
        inputRef.current?.focus();
    };

    // Manejar entrada del usuario
    const manejarCambio = (e) => {
        const valor = e.target.value;
        setTextoUser(valor);

        // Detectar cuando completó la palabra/oración
        if (turno === 'enemigo') {
            if (valor.toLowerCase() === palabraActual.toLowerCase()) {
                manejarDefensaExitosa();
            }
        } else {
            if (valor === oracionAtaque) {
                manejarAtaqueExitoso();
            }
        }
    };

    // ATAQUE exitoso (turno jugador)
    const manejarAtaqueExitoso = () => {
        const danio = 15 + Math.floor(Math.random() * 20); // 15-35 de daño
        setEfectoDanio(true);
        setContadorAciertos(prev => prev + 1);
        
        setEnemigo(prev => ({
            ...prev,
            vida: Math.max(0, prev.vida - danio)
        }));

        setMensaje(`🔥 ¡GOLPE CRÍTICO! ${danio} de daño!`);
        
        // Verificar si el enemigo murió
        if (enemigo.vida - danio <= 0) {
            setMensaje('🏆 ¡VICTORIA! Has derrotado al enemigo');
            onVictory?.({
                puntuacion: jugador.puntuacion + 100,
                aciertos: contadorAciertos + 1
            });
        } else {
            setTimeout(() => {
                setEfectoDanio(false);
                setTurno('enemigo');
            }, 1500);
        }
    };

    // DEFENSA exitosa (turno enemigo)
    const manejarDefensaExitosa = () => {
        setEfectoCuracion(true);
        setContadorAciertos(prev => prev + 1);
        setJugador(prev => ({
            ...prev,
            puntuacion: prev.puntuacion + 10
        }));

        setMensaje('✨ ¡DEFENDISTE EL ATAQUE! +10 puntos');
        
        setTimeout(() => {
            setEfectoCuracion(false);
            setTurno('jugador');
        }, 1000);
    };

    // Fallo en defensa (tiempo agotado o error)
    const manejarFalloDefensa = () => {
        setJugador(prev => {
            const nuevasVidas = prev.vida - 1;
            setMensaje(`💔 ¡Fallaste! Te queda ${nuevasVidas} ${nuevasVidas === 1 ? 'vida' : 'vidas'}`);
            
            if (nuevasVidas <= 0) {
                setMensaje('😵 ¡DERROTA! El enemigo te ha vencido');
                onGameOver?.({
                    puntuacion: prev.puntuacion,
                    aciertos: contadorAciertos
                });
            }
            
            return { ...prev, vida: nuevasVidas };
        });
        
        setTimeout(() => {
            if (jugador.vida > 1) {
                setTurno('jugador');
            }
        }, 1500);
    };

    // Renderizar vidas del jugador (corazones)
    const renderVidas = () => {
        return (
            <div className="vidas-container-rpg">
                {Array.from({ length: jugador.vidaMax }).map((_, i) => (
                    <span key={i} className={`corazon ${i < jugador.vida ? 'activo' : 'perdido'}`}>
                        {i < jugador.vida ? '❤️' : '🖤'}
                    </span>
                ))}
                <span className="vidas-text">x{jugador.vida}</span>
            </div>
        );
    };

    return (
        <div className="rpg-battle-container">
            {/* ENEMIGO (ocupa la mitad superior) */}
            <div className={`enemigo-area ${efectoDanio ? 'recibiendo-danio' : ''}`}>
                <div className="enemigo-card">
                    {/* Imagen del enemigo (simulada) */}
                    <div className="enemigo-imagen">
                        <img src={perro} alt="Dragón" style={{alignContent:'center'}}/>
                        <div className="enemigo-overlay">
                            <h2 className="enemigo-nombre">{enemigo.nombre}</h2>
                            <div className="enemigo-vida-bar">
                                <div 
                                    className="enemigo-vida-fill"
                                    style={{ width: `${(enemigo.vida / enemigo.vidaMax) * 100}%` }}
                                />
                                <span className="enemigo-vida-text">
                                    {enemigo.vida}/{enemigo.vidaMax} HP
                                </span>
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            {/* ÁREA DE TEXTO (parte inferior) */}
            <div className="batalla-texto-area">
                {/* Indicador de turno */}
                {renderVidas()}
                <div className={`turno-indicador ${turno}`}>
                    {turno === 'jugador' ? 'TU TURNO - ATACA!' : 'TURNO DEL ENEMIGO - DEFIÉNDETE!'}
                </div>

                {/* Mensaje de batalla */}
                <div className="mensaje-batalla">{mensaje}</div>

                {/* Texto a escribir (debajo del enemigo) */}
                <div className="texto-objetivo-rpg">
                    {turno === 'jugador' ? (
                        <div className="oracion-ataque">
                            <span className="comillas">"</span>
                            {oracionAtaque}
                            <span className="comillas">"</span>
                        </div>
                    ) : (
                        <div className="palabra-defensa">
                             {palabraActual} 
                        </div>
                    )}
                </div>

                {/* Input para escribir */}
                <input
                    ref={inputRef}
                    type="text"
                    value={textoUser}
                    onChange={manejarCambio}
                    className="rpg-input"
                    placeholder={turno === 'jugador' ? 
                        "Escribe la oración exacta..." : 
                        `Escribe "${palabraActual}" rápidamente...`
                    }
                    autoFocus
                />

                {/* Timer para turno de defensa (solo visible en turno enemigo) */}
                {turno === 'enemigo' && (
                    <Timer
                        key={palabraActual}
                        initialTime={3}
                        mode="countdown"
                        size="small"
                        variant="danger"
                        onTimeUp={manejarFalloDefensa}
                        autoStart={true}
                    />
                )}

                {/* Estadísticas de batalla */}
                <div className="batalla-stats">

                    <div className="puntuacion-rpg">
                        <span className="puntuacion-icon">✨</span>
                        <span className="puntuacion-valor">{jugador.puntuacion}</span>
                    </div>
                    <div className="racha-rpg">
                        <span className="racha-icon">⚡</span>
                        <span className="racha-valor">{contadorAciertos}</span>
                    </div>
                </div>
            </div>
        </div>
    );
}

export default RPGBattleMode;