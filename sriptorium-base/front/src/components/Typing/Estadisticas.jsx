import React from "react";
import './Estadisticas.css';

function StatsRow({estadisticas}){
    const stats=[
        {
            label:'WPM',
            value: estadisticas.wpm,
            color:'#f3dfdf'
        },
        {
            label:'Precision',
            value: `${estadisticas.precision}%`,
            color: '#eedcdc'

        },
        {
            label:'Errores',
            value: estadisticas.errores,
            color: '#000000'
        },
        {
            label:'Tiempo',
            value: `${estadisticas.tiempo} s`,
            color:'#ffffff'
        }

    ];

    return(
        <div className="stats-row">
            {stats.map((stat, index) =>(
                <div key={index} className="stat-item" style={{borderColor: stat.color}}>
                    <div className="stat-label">{stat.label}</div>
                    <div className="stat-value" style={{color: stat.color}}>{stat.value}</div>
                    {stat.subValue &&(
                        <div className="stat-sub">{stat.subValue}</div>
                    )}
                </div>
            ))}
        </div>
    );
}
export default StatsRow;