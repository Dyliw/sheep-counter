
import React, { useEffect, useState, useRef } from "react";
import ProgressBar from "/src/components/Typing/BarraProgreso";
import StatsRow from "/src/components/Typing/Estadisticas";
import TextDisplay from "/src/components/Typing/TextDisplay";
import Dropdown from "../../components/Dropdown/Dropdown";
import Counter from "../../components/Timer/Contador";
import MainPage from "../MainPage/MainPage";
import './TypingPage.css';
import TextOverlay from "../../components/Typing/TextOverlay";

function TypingContainer(){
    const[textoObjetivo] = useState(
        "Hola, cara de bola "
    );
    const [textoUser, setTextoUser]= useState('');
    const [errores, setErrores]=useState([]);
    const [completado, setCompletado]=useState(false);
    const inputRef = useRef(null);

    const [estadisticas, setEstadisticas]=useState({
        tiempo:0,
        wpm:0,
        precision:100,
        caracteresCorrectos:0,
        caracteresIncorrectos:0,
        racha:0,
        mejorRacha:0
    });
    useEffect(()=>{
        const nuevosErrores=[];
        let correctos=0;
        for (let i=0;i<textoUser.length; i++){
            if(textoUser[i] !== textoObjetivo[i]){
                nuevosErrores.push(i);
            } else {
                correctos++;
            }
        }
        setErrores(nuevosErrores);

        setEstadisticas(prev=>({
            ...prev,
            caracteresCorrectos: correctos,
            caracteresIncorrectos: nuevosErrores.length,
            precision: textoUser.length>0
            ? Math.round((correctos/textoUser.length)*100)  
            :100,
            racha: nuevosErrores.length === 0? textoUser.length :0,
            mejorRacha: Math.max(prev.mejorRacha,
                nuevosErrores.length===0? textoUser.length:0
            )    
          }));
          if(textoUser===textoObjetivo){
            setCompletado(true);
          }
    }, [textoUser, textoObjetivo]);
   
    const manejarCambio = (e)=>{
        const valor=e.target.value;
        if(valor.length <=textoObjetivo.length){
            setTextoUser(valor);
        }
    };
    const reiniciar=()=>{
        setTextoUser('');
        setErrores([]);
        setCompletado(false);
        setEstadisticas({
            tiempo:0,
            wpm:0,
            precision:100,
            caracteresCorrectos:0,
            caracteresIncorrectos:0,
            racha:0,
            mejorRacha:0
        });
        inputRef.current?.focus();
    };
   
    return(
        <div className="typing-container">
            <div className="algo-principal" style={{display:'flex', gap:'20px'}}> 
            <div className="typing-card" style={{
                padding:'20px', display:'flex', width: '110vh', height:'70vh', gap:'20px', backgroundColor:'#3E3657'
            }}>
                <TextOverlay
                textoObjetivo={textoObjetivo}
                textoUser={textoUser}
                setTextoUser={setTextoUser}
                completado={completado}
                errores={errores} />
            </div>
            <div className="Modos" style={{columnGap:'20px'}} >
                <Dropdown />
                <Counter />
            </div>
            </div>
            <div className="resultados">
                  <StatsRow estadisticas={estadisticas} />
                <ProgressBar
                actual={textoUser.length}
                total={textoObjetivo.length}
                />
                <div className="typing-controls">
                    <button onClick={reiniciar}
                    className="btn-reiniciar"
                    disabled={textoUser.length ===0 && !completado}>
                        Reiniciar
                    </button>
                    {completado &&(
                        <div className="completado-badge">
                            completado
                            </div>
                    )}
                </div>

            </div>
        </div>
    );

}
export default TypingContainer;
