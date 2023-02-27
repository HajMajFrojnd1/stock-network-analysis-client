import Modem from "./Modem"
import Overlay from "./Overlay";
import { useState } from "react";

function Todo(props){

    let [modemState, setState] = useState(false);
    function deleteHandler(){setState(true)};
    function cancelHandler(){setState(false)};

    return(
        <div className="todo-item">
        <h2>{props.text}</h2>
        <button onClick={deleteHandler}>Delete</button>

        {modemState && <Overlay onClick={cancelHandler}/>}
        {modemState && <Modem onClick={cancelHandler}/>}
      </div>
    );
}

export default Todo;