import { useState } from "react";
import Button from "./Button";
import play_svg from "../images/play.svg"
import stop_svg from "../images/stop.svg"

const MySigmaController = ({listener}) =>{

    const [isRunning, setIsRunning] = useState(false);


    return (
        <div className="sigma-controller">
            {!isRunning &&
                <Button class={"special-button"} image={play_svg} onClick={
                    () => {
                        console.log("start");
                        setIsRunning(true);
                        listener.fireEvent("start");
                    }
                }></Button>
            }
            {isRunning &&
                <Button class={"special-button"} image={stop_svg} onClick={
                    () => {
                        setIsRunning(false);
                        listener.fireEvent("stop");
                    }
                }></Button>
            }
        </div>
    );
}

export default MySigmaController;