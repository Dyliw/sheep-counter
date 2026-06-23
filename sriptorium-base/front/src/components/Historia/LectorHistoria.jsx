// components/ModoHistoria/LectorHistoria.jsx
import React from 'react';

function LectorHistoria({ textoOriginal, textoUsuario, errores }) {
    const resaltarTexto = () => {
        return textoOriginal.split('').map((caracter, index) => {
            let clase = 'historia-caracter';
            
            if (index < textoUsuario.length) {
                clase += textoUsuario[index] === caracter ? ' correcto' : ' error';
            } else if (index === textoUsuario.length) {
                clase += ' actual';
            }

            return (
                <span key={index} className={clase}>
                    {caracter === ' ' ? '␣' : caracter}
                </span>
            );
        });
    };

    return (
        <div className="lector-historia">
            <div className="texto-original">
                {resaltarTexto()}
            </div>
            
            <div className="guia-escritura">
                <div className="guia-item">
                    <span className="guia-color correcto">■</span> Correcto
                </div>
                <div className="guia-item">
                    <span className="guia-color error">■</span> Error
                </div>
                <div className="guia-item">
                    <span className="guia-color actual">■</span> Siguiente
                </div>
            </div>
        </div>
    );
}

export default LectorHistoria;