import { useEffect, useState } from 'react'
import reactLogo from './assets/react.svg'
import viteLogo from '/vite.svg'
import './App.css'
import Dice from './components/Dice'
import { nanoid } from 'nanoid'
import Confetti from 'react-confetti'

function App() {
  const [tenzies, setTenzies] = useState(false)
  const [dice,setDice] = useState(()=>newDice())

  function newDice(){
    const numsArr = []
    for(let i=0;i<10;i++){
      numsArr.push({
        value:Math.ceil(Math.random()*6),
        isHeld:false,
        id: nanoid()
    })
    }
    return numsArr
  }
  function roll(){

    if(tenzies){
      setDice(()=>newDice())
      setTenzies(false)
    }
    else{
      setDice(prev=>{
        return prev.map((el)=>{
          if(el.isHeld){
            return el
          }else{
            return {...el,value :Math.ceil(Math.random()*6) }
          }
        })
      })
    }
    
  }
  function hold(id){
    setDice(prev=>{
      return prev.map((el)=>{
        return el.id === id?{...el,isHeld: !el.isHeld}:el
      })
    })
  }
  useEffect(()=>{
    const el1 = dice[0]
    if(dice.every((el)=>el.isHeld&& el.value == el1.value)){
      setTenzies(true)
    }
  },[dice])
  return (
    <div className='w-96 h-[24rem] m-auto my-40 bg-[#0B2434] p-8' >
      {tenzies&&<Confetti />}
      <div className='bg-[#F5F5F5] rounded-md w-80 h-80 relative p-5 flex flex-col justify-center items-center gap-5'>
        <h1 className='text-center font-bold text-3xl' >Tenzies</h1>
        <p className='text-center text-[0.85rem]'>Roll until all dice are the same. Click each die to freeze it at its current value between rolls.</p>
        <div className='grid grid-cols-5 gap-3'>
          {
          dice.map((el,i)=>{
            return <Dice key = {el.id} item={el} handleHold ={hold} />
            })}
        </div>
        <button onClick={roll} className='bg-blue-700 py-2 text-white w-24 rounded-md'>{tenzies?"New Game":"Roll"}</button>
      </div>
    </div>
  )
}

export default App
