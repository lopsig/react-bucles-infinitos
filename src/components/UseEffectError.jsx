import { useState, useEffect } from "react"

export const UseEffectError = () => {
  const [contador, setContador] = useState(0)

  //! BUCLE INFINITO
  useEffect(() => {
    setContador(contador+1)
  }) //! no tiene []

  return (
    <div>
      <h1>Contador Infinito</h1>
      <p>{ contador }</p>
    </div>
  )

  
}