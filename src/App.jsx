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
  const [score,setScore] =useState({rolls:0 ,duration:''})
  const [restartTimer,setRestartTimer] = useState(false)
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
    setSeconds(0)
    setMinutes(0)
    // startTimer()
    return numsArr
  }
  function roll() {
    if (tenzies) {
      setRestartTimer(true)
      setDice(() => newDice())
      setTenzies(false)

    }
    else {
      setScore(prev=>({...prev,rolls:prev.rolls+1}))
      setRestartTimer(false)
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
    let localSeconds = 0;
    let localMinutes = 0;

    intervalId = setInterval(() => {
      localSeconds += 1;
      if(tenzies){
        setScore(prev=>({...prev,duration:`${minutes}:${seconds}`}))
        console.log("Ended after ",seconds,minutes)
        clearInterval(intervalId)
      }else
      if (localSeconds === 60) {
        localMinutes += 1;
        localSeconds = 0;

        // Update the state only when the minute changes
        setMinutes(localMinutes);
        setSeconds(localSeconds);
      } else {
        // Update only the seconds state to avoid unnecessary re-renders
        setSeconds(localSeconds);
      }
    }, 1000);

    return () => clearInterval(intervalId); // Clean up the interval on component unmount
  }, [tenzies&&dice,tenzies]);

  useEffect(() => {
    const el1 = dice[0]
    if (dice.every((el) => el.isHeld && el.value == el1.value)) {
      // clearInterval(intervalId)
      setTenzies(true)
    }
  }, [dice])
  return (
    <div>
      {tenzies && <Confetti />}
      {tenzies && <h1 className='bg-green-300 h-20 font-bold text-blue-900 text-center border-1'>{`You won!!! Rolls:${score.rolls} Duration: ${score.duration}`}</h1>}
    <div className='w-96 h-[24rem] m-auto my-40 bg-[#0B2434] px-8 pb-8' >
    
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
      
    </div>
  )
}

export default App
