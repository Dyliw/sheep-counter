// components/ModoHistoria/CargadorJSON.jsx
import React, { useRef, useState } from 'react';

function CargadorJSON({ onCargar }) {
    const fileInputRef = useRef(null);
    const [error, setError] = useState('');

    const validarHistoria = (data) => {
        const requiredFields = ['id', 'titulo', 'autor', 'capitulos'];
        for (const field of requiredFields) {
            if (!data[field]) {
                throw new Error(`Falta el campo requerido: ${field}`);
            }
        }

        if (!Array.isArray(data.capitulos) || data.capitulos.length === 0) {
            throw new Error('La historia debe tener al menos un capítulo');
        }

        data.capitulos.forEach((cap, index) => {
            if (!cap.titulo || !cap.texto) {
                throw new Error(`El capítulo ${index + 1} no tiene título o texto`);
            }
        });

        return true;
    };

    const handleFileUpload = (event) => {
        const file = event.target.files[0];
        if (!file) return;

        const reader = new FileReader();
        reader.onload = (e) => {
            try {
                const contenido = JSON.parse(e.target.result);
                validarHistoria(contenido);
                
                // Agregar metadata adicional
                const historia = {
                    ...contenido,
                    id: contenido.id || `custom-${Date.now()}`,
                    fechaCarga: new Date().toISOString(),
                    personalizada: true
                };
                
                onCargar(historia);
                setError('');
                
                // Limpiar el input
                if (fileInputRef.current) {
                    fileInputRef.current.value = '';
                }
            } catch (err) {
                setError(`Error al cargar: ${err.message}`);
            }
        };
        reader.readAsText(file);
    };

    return (
        <div className="cargador-json">
            <h3 className="cargador-titulo">📤 Cargar Historia Personalizada</h3>
            <p className="cargador-descripcion">
                Sube un archivo JSON con tu propia historia
            </p>
            
            <div className="file-upload-area">
                <input
                    ref={fileInputRef}
                    type="file"
                    accept=".json"
                    onChange={handleFileUpload}
                    id="file-upload"
                    className="file-input"
                />
                <label htmlFor="file-upload" className="file-label">
                    📁 Seleccionar archivo JSON
                </label>
            </div>

            {error && (
                <div className="cargador-error">
                    ⚠️ {error}
                </div>
            )}

            <div className="formato-ejemplo">
                <h4>Formato esperado:</h4>
                <pre className="ejemplo-codigo">
{`{
  "titulo": "Mi Historia",
  "autor": "Yo mismo",
  "dificultad": "media",
  "capitulos": [
    {
      "titulo": "Capítulo 1",
      "texto": "Texto del capítulo...",
      "xp": 100
    }
  ]
}`}
                </pre>
            </div>
        </div>
    );
}

export default CargadorJSON;