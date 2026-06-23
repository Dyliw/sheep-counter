import React from "react";
import './BarraProgreso.css';
function ProgressBar({ actual, total}){
    const porcentaje=(actual/total)*100;

    const getColor=()=>{
        if(porcentaje<30) return '#FF5D73';
        if(porcentaje<70) return '#FFC857';
        return '#45D6A8';
    };
    return (
        <div className="progress-container">
            <div className="progress-header">
                <span className="progress-label">Progreso</span>
                <span className="progress-porcentaje">

                    {Math.round(porcentaje)}%
            
                </span>
            </div>
            <div className="progress-bar">
                <div className="progress-fill" style={{width: `${porcentaje}%`, backgroundColor: getColor()}}>
                    <div className="progress-shine">

                    </div>
                </div>
            </div>
            <div className="progress-miniatures">
                {Array.from({length: Math.min(10, total)}).map((_, i)=>{
                    const pos=Math.floor((i/10)*total);
                    const completado = pos <= actual;
                    const conError=false;

                    return(
                        <div  
                        key={i}
                            className={`miniature ${completado ? 'completed' : ''} ${conError ? 'error' : ''}`}
                            title={`Posición ${pos}`}
                        />
                    );
                })}
            </div>
        </div>

    );
}
export default ProgressBar;