
import Navbar from '/src/components/Navbar/Navbar';
import TypingContainer from '../Mecanografia/TypingPage';
import { Routes, Route } from 'react-router-dom';
import './MainPage.css';
import mapache from "../../assets/images/mapache.png";


function HomePage() {

  return (
    <div className='home-page'>
      
      <div className='content-container'>
        <Routes>
          {/* Cuando la URL sea "/", muestra el contenido de abajo (no otro HomePage) */}
          <Route path="*" element={
            <main style={{
              padding: '40px 20px',
              maxWidth: '1200px',
              margin: '0 auto'
            }}>
              {/* Todo tu contenido actual va AQUÍ */}
              <div className='seccion1' style={{display:'flex',gap:'20vh', justifyContent:'center', alignItems:'center', padding:'20px'}}>
                <div className='cuadritos'>
                  <p style={{fontFamily: 'initial', fontStyle:'oblique', marginTop:'20px'}}>
                    Could you enter in this wonderful world?
                  </p>
                </div>
                
                <div className='journey' style={{display:'flex', flexDirection:'column', alignItems:'center', gap:'30px'}}>
                  <h1 className='choose' style={{display:'flex', alignItems:'end',color:'#ffffff', backgroundColor:'#26304B', borderRadius:'50%'}}>
                    Elige tu aventura
                  </h1>
                  <ul style={{listStyle:'none', padding:'0', display:'flex', flexDirection:'column', gap:'4vh', width:'200px', alignContent:'center'}}>
                    <li>
                      <a href="#seccion1" style={{display:'block', padding: '15px 20px',color:'#fff', backgroundColor:'#40434E', textAlign:'center', transition:'all .3s'}} 
                         onMouseEnter={(e)=>e.target.style.backgroundColor='#6c5c5c'} 
                         onMouseLeave={(e)=>e.target.style.backgroundColor='#40434E'}>
                        Clásico
                      </a>
                    </li>
                    <li>
                      <a href="#seccion2" style={{display:'block', padding: '15px 20px',color:'#fff', backgroundColor:'#40434E', textAlign:'center', transition:'all .3s'}} 
                         onMouseEnter={(e)=>e.target.style.backgroundColor='#6c5c5c'} 
                         onMouseLeave={(e)=>e.target.style.backgroundColor='#40434E'}>
                        Contratiempo
                      </a>
                    </li>
                    <li>
                      <a href="#seccion3" style={{display:'block', padding: '15px 20px', color:'#fff', backgroundColor:'#40434E', textAlign:'center', transition:'all .3s'}} 
                         onMouseEnter={(e)=>e.target.style.backgroundColor='#6c5c5c'} 
                         onMouseLeave={(e)=>e.target.style.backgroundColor='#40434E'}>
                        Batalla
                      </a>
                    </li>
                  </ul>
                </div>
              </div>
              
              <div className='enter' style={{display:'flex', alignContent:'center', alignItems:'center', padding:'10px 80px', width:'362px'}}>
                
                <button href="./Mecanografia/TypingPage" style={{display: 'flex', alignItems:'center', justifyContent: 'center', backgroundColor:'#912F40', width:'40vh', height:'7vh', padding: '10px 20px', borderRadius: '100px / 50px', marginTop:'7vh'}}>
                  Enter Scriptorium
                </button>
                <img src={mapache} alt="Mapache" style={{alignContent:'center'}}/>
              </div>
            </main>
          } />
          
          {/* Ruta para Typing - cuando la URL sea "/typing" */}
          <Route path="/typing" element={<TypingContainer />} />
        </Routes>
      </div>
    </div>
  );
}

export default HomePage;