import React, {useState, useEffect, useRef} from "react";
import './Dropdown.css';

function Dropdown({ options, onSelect, selectedOption}){
    const [isOpen, setIsOpen]=useState(false);
    const [selectOption, setSelectOption]=useState('Modos');
    const dropdrownRef=useRef(null);

    useEffect(()=>{
        const handleClickOutside=(event)=>{
            if(dropdrownRef.current && !dropdrownRef.current.contains(event.target)){
                setIsOpen(false);
            }
        };
        document.addEventListener('mousedown', handleClickOutside);
        return ()=> document.removeEventListener('mousedown', handleClickOutside);
    }, []);
    const opciones =[
        {id: 1, texto: 'Clásico'},
        {id:2, texto: 'Histiora'},
        {id: 3, texto:'Learnign'},
    ];

    const handleSelect=(opcion)=>{
        selectOption(opcion.texto);
        setIsOpen(false);
        console.log('seleccionado:', opcion);
    };

    return(
        <div className="dropdown-click" ref={dropdrownRef}>
            <button className={`dropdown-toggle ${isOpen ? 'active' : ''}`} onClick={() =>setIsOpen(!isOpen)}>
                <span>{selectOption}</span>
                <span className={`arrow ${isOpen ? 'up': 'down'}`}>▼</span>
            </button>
            {isOpen &&(
                <div className="dropdown-menu">
                    {opciones.map((opcion)=>(
                        <div key={opcion.id} className="dropdown-tiems" onClick={()=>handleSelect(opcion)}>
                            <span className="item-text">{opcion.texto}</span>
                            {selectOption === opcion.texto && (
                                <span className="item-check">palomita</span>
                            
                            )}
                            </div>
                    ))}
                    </div>
            )}
        </div>
    );
}
export default Dropdown;