import React from "react";
import './TextDisplay.css';

function TextDisplay({ textoObjetivo, textoUser, errores }) {
    const posicionActual = textoUser.length;
    const palabras = textoObjetivo.split(' '); // Divide por espacios

    // Precalcula el índice de inicio de cada palabra
    let acumulado = 0;
    const palabrasConInicio = palabras.map(palabra => {
        const inicio = acumulado;
        acumulado += palabra.length + 1; // +1 por el espacio
        return { palabra, inicio };
    });

    return (
        <div className="text-display">
            <div className="text-header">
                <span className="text-label">Texto a copiar: </span>
                <span className="text-counter">{posicionActual}/{textoObjetivo.length} caracteres</span>
            </div>
            <div className="text-container">
                {palabrasConInicio.map(({ palabra, inicio }, palabraIndex) => (
                    <React.Fragment key={palabraIndex}>
                        <span className="word">
                            {palabra.split('').map((caracter, charIndex) => {
                                const indexGlobal = inicio + charIndex;
                                let clase = 'char';
                                if (indexGlobal < textoUser.length) {
                                    clase += textoUser[indexGlobal] === caracter ? ' correct' : ' error';
                                } else if (indexGlobal === posicionActual) {
                                    clase += ' current';
                                }
                                return (
                                    <span
                                        key={charIndex}
                                        className={clase}
                                        style={{
                                            animation: indexGlobal === posicionActual ? 'pulse 1s infinite' : 'none'
                                        }}
                                    >
                                        {caracter}
                                    </span>
                                );
                            })}
                        </span>
                        {palabraIndex < palabras.length - 1 && (
                            <span className="word-space">
                                {posicionActual === inicio + palabra.length ? (
                                    <span className="space-marker">␣</span>
                                ) : (
                                    ' '
                                )}
                            </span>
                        )}
                    </React.Fragment>
                ))}
            </div>
            <div className="user-text-preview">
                <span className="preview-label">Tu escritura:</span>
                <div className="preview-content">
                    {textoUser || '⏳ entrada...'}
                </div>
            </div>
        </div>
    );
}

export default TextDisplay;