import React, {useRef, useEffect} from "react";
import './TextOverlay.css';
function TextOverlay({ textoObjetivo, textoUser, setTextoUser, completado }) {
  const inputRef = useRef(null);

  // Auto-focus al input invisible
  useEffect(() => {
    inputRef.current?.focus();
  }, []);

  const manejarCambio = (e) => {
    setTextoUser(e.target.value);
  };
   const handleChange = (e) => {
        // 🟢 No permitir cambios si está completado
        if (completado) return;
        setTextoUser(e.target.value);
    };


  // Función para renderizar cada caracter con su color
  const renderizarTextoColoreado = () => {
    return textoObjetivo.split('').map((caracter, index) => {
      let className = 'char';
      
      if (index < textoUser.length) {
        // Caracter ya escrito
        if (textoUser[index] === caracter) {
          className += ' correcto';  //Verde si coincide
        } else {
          className += ' incorrecto'; // ❌ Rojo si no coincide
        }
      } else if (index === textoUser.length) {
        className += ' actual';      // ⚡ Posición actual (cursor)
      }
      
      // Mostrar espacios como ␣ para que se vean
      const charToShow = caracter === ' ' ? '␣' : caracter;
      
      return (
        <span key={index} className={className}>
          {charToShow}
        </span>
      );
    });
  };
  return(
    <div className="text-overlay">
        <input
        ref={inputRef}
        type="text"
        value={textoUser}
        onChange={manejarCambio}
        className="hidden-input"
        autoFocus
        disabled={completado}
        />
        <div className="text-display">
            {renderizarTextoColoreado()}
        </div>
        

    </div>
  );
}
export default TextOverlay;
