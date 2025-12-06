import './App.css'
import Scene from './Scene'
import VectorLogo from './VectorLogo'

function App() {

  return (
    <>
      <Scene />
      <div className='square'>
        <VectorLogo style={{ maxWidth: '600px', width: '80%', height: 'auto', marginBottom: '2rem' }} />
      </div>
    </>
  )
}

export default App
