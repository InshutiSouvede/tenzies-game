export default function Dice(props){
    // console.log("is held?",props.item.isHeld)
    return (
        <div 
        className={props.item.isHeld?"bg-green-200":"bg-white"}
        >
        <button onClick={(e)=>props.handleHold(props.item.id)} className="rounded-md w-9 h-9 shadow-lg">{props.item.value}</button>
        </div>
    )
}