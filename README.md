# Bucles Infinitos en React — Casos de Error y Corrección

Este proyecto documenta dos errores comunes en React que provocan **bucles infinitos de renderizado**, junto con su respectiva corrección. Cada caso incluye una versión con error (`Error`) y una versión corregida (`Corregida`).

## Índice

- [Caso 1: Bucle infinito con `useEffect`](#caso-1-bucle-infinito-con-useeffect)
- [Caso 2: Bucle infinito con `useState`](#caso-2-bucle-infinito-con-usestate)
- [Instalación y ejecución local](#instalación-y-ejecución-local)

---

## Caso 1: Bucle infinito con `useEffect`

### Versión con error — `UseEffectError.jsx`

```jsx
export const UseEffectError = () => {
  const [contador, setContador] = useState(0)

  useEffect(() => {
    setContador(contador + 1)
  }) // no tiene arreglo de dependencias

  return (
    <div>
      <h1>Contador Infinito</h1>
      <p>{ contador }</p>
    </div>
  )
}
```

**¿Qué ocurre al ejecutarlo?**
El componente entra en un ciclo de renderizados sin fin. El navegador se congela o queda extremadamente lento, y la pestaña puede llegar a no responder.

**¿Por qué se produce el bucle infinito?**
El `useEffect` no recibe un arreglo de dependencias (`[]` o `[algo]`). Sin ese segundo argumento, React ejecuta el efecto **después de cada renderizado**. Como dentro del efecto se llama a `setContador`, cada ejecución actualiza el estado, lo que provoca un nuevo renderizado, que a su vez vuelve a disparar el efecto. Esto se repite indefinidamente:

```
render → useEffect se ejecuta → setContador → nuevo render → useEffect se ejecuta → ...
```

**Síntomas visibles**

- La aplicación se congela o la pestaña del navegador deja de responder.
- El contador en pantalla sube descontroladamente (miles de renders por segundo).
- La consola de DevTools puede mostrar advertencias de rendimiento o directamente colapsar.
- En algunos casos, React o el navegador lanzan un error de "Maximum update depth exceeded".

### Versión corregida — `UseEffectCorregida.jsx`

```jsx
export const UseEffectCorregida = () => {
  const [contador, setContador] = useState(0)

  useEffect(() => {
    setContador(contador + 1)
  }, []) // arreglo de dependencias vacío

  return (
    <div>
      <h1>Contador UseEffect Corregido</h1>
      <h1>{ contador }</h1>
    </div>
  )
}
```

**¿Cómo se solucionó?**
Se agregó un arreglo de dependencias vacío (`[]`) como segundo argumento de `useEffect`. Esto le indica a React que el efecto debe ejecutarse **una sola vez**, inmediatamente después del primer renderizado (equivalente a `componentDidMount` en componentes de clase).

**¿Por qué evita renderizados innecesarios?**
Al ejecutarse solo una vez, `setContador` se llama una única vez, produce un único renderizado adicional, y el efecto no vuelve a dispararse porque no hay dependencias que "vigilar" ni un ciclo que lo reactive.

### Diferencia entre ambas versiones

| Aspecto | `UseEffectError` | `UseEffectCorregida` |
|---|---|---|
| Arreglo de dependencias | No tiene | `[]` (vacío) |
| Frecuencia de ejecución del efecto | Después de cada render, indefinidamente | Una sola vez, al montar el componente |
| Comportamiento del contador | Sube sin control | Se actualiza una vez y se detiene |
| Estado de la app | Se congela / no responde | Funciona con normalidad |

---

## Caso 2: Bucle infinito con `useState`

### Versión con error — `UseStateError.jsx`

```jsx
export const UseStateError = () => {
  const [contador, setContador] = useState(0)

  setContador(contador + 1) // no está dentro de un evento ni de un useEffect

  return (
    <div>
      <h1>Contador Infinito</h1>
      <p>{contador}</p>
    </div>
  )
}
```

**¿Qué ocurre al ejecutarlo?**
Igual que en el caso anterior, el navegador se congela casi de inmediato debido a renderizados continuos sin pausa.

**¿Por qué se produce el bucle infinito o el error de renderizado?**
`setContador` se llama **directamente en el cuerpo del componente**, es decir, durante el renderizado mismo, sin estar envuelto en un evento (`onClick`, etc.) ni en un `useEffect`. Cada vez que el componente se renderiza, esta línea se ejecuta y cambia el estado, lo cual obliga a React a renderizar de nuevo, y así sucesivamente:

```
render → setContador se ejecuta (está en el cuerpo del componente) → nuevo render → ...
```

**Síntomas visibles**

- La aplicación se congela casi instantáneamente al cargar el componente.
- React suele lanzar en consola un error explícito: **"Too many re-renders. React limits the number of renders to prevent an infinite loop."**
- La pantalla puede quedar en blanco o mostrar el error de React en lugar de la interfaz.

### Versión corregida — `UseStateCorregida.jsx`

```jsx
export const UseStateCorregida = () => {
  const [contador, setContador] = useState(0)

  return (
    <div>
      <h1>Contador UseState Corregido</h1>
      <button style={{cursor: "pointer"}} onClick={() => setContador(contador + 1)}>Contar</button>
      <h1>{contador}</h1>
    </div>
  )
}
```

**¿Cómo se solucionó?**
Se movió la actualización del estado (`setContador`) **dentro de un manejador de evento** (`onClick`), en vez de dejarla suelta en el cuerpo del componente.

**¿Por qué evita renderizados innecesarios?**
Ahora `setContador` solo se ejecuta cuando el usuario hace clic en el botón, es decir, en respuesta a una acción explícita. El renderizado ya no dispara por sí mismo una actualización de estado, por lo que el ciclo se rompe: renderizar ya no implica volver a renderizar.

### Diferencia entre ambas versiones

| Aspecto | `UseStateError` | `UseStateCorregida` |
|---|---|---|
| Ubicación de `setContador` | En el cuerpo del componente (se ejecuta en cada render) | Dentro de un `onClick` (se ejecuta solo con la interacción del usuario) |
| Disparador de la actualización | El propio renderizado | Una acción del usuario (clic) |
| Comportamiento del contador | Bucle infinito, error de React | Se incrementa correctamente al hacer clic |
| Estado de la app | Se rompe / pantalla en blanco | Funciona con normalidad |

---

## Conclusión general

Ambos casos comparten la misma causa raíz: **actualizar el estado de forma incondicional durante el renderizado (o en un efecto sin dependencias controladas) provoca que React entre en un ciclo de render → actualización de estado → render, sin punto de salida.** La solución en ambos casos consiste en controlar **cuándo** se actualiza el estado:

- En `useEffect`, controlando el arreglo de dependencias.
- En `useState`, moviendo la actualización a un evento explícito del usuario.

---

## Instalación y ejecución local

### Requisitos previos

- [Node.js](https://nodejs.org/) (v18 o superior recomendado)
- npm (incluido con Node.js)

### Pasos

1. Clonar el repositorio:

   ```bash
   git clone git@github.com:lopsig/react-bucles-infinitos.git
   cd react-bucles-infinitos
   ```

2. Instalar las dependencias:

   ```bash
   npm install
   ```

3. Ejecutar el proyecto en modo desarrollo:

   ```bash
   npm run dev
   ```

4. Abrir el navegador en la dirección que indique la consola (normalmente `http://localhost:5173` si usas Vite, o `http://localhost:3000` si usas Create React App).

> ⚠️ **Advertencia:** Al probar los componentes `UseEffectError` y `UseStateError`, el navegador puede congelarse. Se recomienda comentar su renderizado o probarlos en una pestaña que puedas cerrar/recargar fácilmente.
