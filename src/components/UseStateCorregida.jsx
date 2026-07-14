import { useState } from "react"

export const UseStateCorregida = () => {
  const [contador, setContador] = useState(0)


  return (
    <div>
      <h1>Contador UseState Corregido</h1>
      <button style={{cursor: "pointer"}} onClick={() => setContador(contador+1)}>Contar</button>
      <h1>{contador}</h1>
    </div>
  )
}