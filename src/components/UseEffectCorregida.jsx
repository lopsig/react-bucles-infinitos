import { useState, useEffect } from "react"

export const UseEffectCorregida = () => {
  const [contador, setContador] = useState(0)

  useEffect(() => {
    setContador(contador+1)
  }, [])

  return (
    <div>
      <h1>Contador UseEffect Corregido </h1>
      <h1>{ contador }</h1>
    </div>
  )

  
}