import { useState } from "react"

export const UseStateError = () => {
  const [contador, setContador] = useState(0)

  //! BUCLE INFINITO
  setContador(contador + 1) //! no utiliza eventos

  return (
    <div>
      <h1>Contador Infinito</h1>
      <p>{contador}</p>
    </div>
  )
}