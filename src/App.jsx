import { useEffect, useState } from 'react'
import reactLogo from './assets/react.svg'
import viteLogo from '/vite.svg'
import './App.css'
import Dice from './components/Dice'
import { nanoid } from 'nanoid'
import Confetti from 'react-confetti'

function App() {
  const [seconds, setSeconds] = useState(0)
  const [minutes, setMinutes] = useState(0)

  const [tenzies, setTenzies] = useState(false)
  const [dice, setDice] = useState(() => newDice())
  let intervalId;

  function newDice() {
    const numsArr = []
    for (let i = 0; i < 10; i++) {
      numsArr.push({
        value: Math.ceil(Math.random() * 6),
        isHeld: false,
        id: nanoid()
      })
    }
    // startTimer()
    return numsArr
  }
  function roll() {

    if (tenzies) {
      clearInterval(intervalId)
      setDice(() => newDice())
      setTenzies(false)

    }
    else {
      setDice(prev => {
        return prev.map((el) => {
          if (el.isHeld) {
            return el
          } else {
            return { ...el, value: Math.ceil(Math.random() * 6) }
          }
        })
      })
    }

  }
  function hold(id) {
    setDice(prev => {
      return prev.map((el) => {
        return el.id === id ? { ...el, isHeld: !el.isHeld } : el
      })
    })
  }
 
  
  useEffect(() => {
    function startTimer() {
      
      intervalId = setInterval(() => {
        setSeconds(prev=>{
          return prev+1
        })
        
      }, 1000)
    }
    startTimer()

    return function stopTimer() {
      clearInterval(intervalId)
    }

  }, [])
  useEffect(()=>{
    console.log('hello')
    if(seconds===59){
      console.log("Adding minut",seconds)
      setMinutes((min)=>min+1)
      setSeconds(0)
    }
  },[seconds===59])
  useEffect(() => {
    if(seconds==0&&minutes==0){
      setSeconds(1)
    }
    console.log("seconds", seconds)
    const el1 = dice[0]
    if (dice.every((el) => el.isHeld && el.value == el1.value)) {
      setTenzies(true)
    }
  }, [dice])
  return (
    <div className='w-96 h-[24rem] m-auto my-40 bg-[#0B2434] px-8 pb-8' >
      {tenzies && <Confetti />}
       <h1 className='text-white text-2xl text-right py-1 font-bold'>{`${minutes < 10 ? '0' + minutes : minutes} : ${seconds < 10 ? '0' + seconds : seconds}`}</h1>
      <div className='bg-[#F5F5F5] rounded-md w-80 h-80 relative p-5 flex flex-col justify-center items-center gap-5'>
        <h1 className='text-center font-bold text-3xl' >Tenzies</h1>
        <p className='text-center text-[0.85rem]'>Roll until all dice are the same. Click each die to freeze it at its current value between rolls.</p>
        <div className='grid grid-cols-5 gap-3'>
          {
            dice.map((el, i) => {
              return <Dice key={el.id} item={el} handleHold={hold} />
            })}
        </div>
        <button onClick={roll} className='bg-blue-700 py-2 text-white w-24 rounded-md'>{tenzies ? "New Game" : "Roll"}</button>
      </div>
    </div>
  )
}

export default App
