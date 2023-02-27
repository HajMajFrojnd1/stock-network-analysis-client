
function Modem(props){
    return(
        <div className="modem">
          <div>
            <button onClick={props.onClick}>Cancel</button>
            <button onClick={props.onClick}>Confirm</button>
          </div>
        </div>
    )
}

export default Modem;