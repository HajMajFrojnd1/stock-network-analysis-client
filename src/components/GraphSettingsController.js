import Button from "./Button";
import Input from "./Input";
import { useState, useEffect } from "react";
import settings from "../images/settings.svg"


const GraphSettingsController = ({graphInstance, setColoring, colorOption}) => {

    const [currentColors, setCurrentColors] = useState([]);
    const [isShowing, setIsShowing] = useState(false);


    const getLouvain = () => {
        let colors = graphInstance.getLouvainColors();
        let i = 1;
        let divs = [];
        colors.forEach(color => {
            divs.push(
                <div className="info">
                        <span>Community {i}:</span>
                        <div style={{backgroundColor: color}} className="color_box">

                        </div>
                </div>
            )
            i++;
        });

        setCurrentColors(divs)
    }

    const getSectors = () => {
        let colors = graphInstance.getSectorColors();
        let i = 1;
        let divs = [];
        Object.keys(colors).forEach(key => {
            divs.push(
                <div className="info">
                        <span>{key}:</span>
                        <div style={{backgroundColor: colors[key]}} className="color_box">

                        </div>
                </div>
            )
        })

        setCurrentColors(divs)
    }

    const getOther = () => {
        setCurrentColors(<div className="info">
                                <span>Heatmap:</span>
                                <div style={{background: "linear-gradient(90deg, rgba(0,0,255,1) 0%, rgba(0,255,0,1) 50%, rgba(255,0,0,1) 100%)"}} className="color_box">
                                </div>
                        </div>);
    }

    useEffect(()=> {
        if(colorOption === "Louvain"){
            getLouvain();
        }
        else if(colorOption === "Sector"){
            getSectors();
        }
        else{
            getOther();
        }
    }, [colorOption, graphInstance])

    useEffect(()=> {
        if(colorOption === "Louvain")
            getLouvain();
        else if(colorOption === "Sector")
            getSectors();

    }, [])

    if(isShowing){
        return (
            <div>
                <div className="graph_settings">
                    <div className="section">
                        <h2>Graph settings</h2>
                        <div className="info">
                            <span>Graph Coloring:</span>
                            <Input  type="select" 
                                    p_options={["Sector", "Louvain","Betweenness", "Degree", "Closeness"]}
                                    value={colorOption}
                                    onChange={(value) => {
                                        setColoring(value);
                                    }}
                                    />
                        </div>
                    </div>
                    
                    <div style={{marginBottom: "2rem"}} className="section">
                        <h2>Color settings</h2>
                        {currentColors}
                    </div>
                    <Button     class={"main-button"}
                                text={"Close"}
                                onClick={
                                    () => {
                                        setIsShowing(false);
                                    }
                                }
                                />
                </div>


                <div style={{
                    position: "fixed",
                    width: "100%",
                    height: "100%",
                    zIndex: 10,
                    top: 0,
                            left: 0,
                            opacity: 0.5,
                            backgroundColor: "#000"
                        }}>
                </div>
            </div>

        );
    }

    return (
        <div style={{position: "absolute", top: "2rem", right: "2rem"}}>
            <Button class="special-button"  
                    image={settings}
                    onClick={
                        () => {
                            setIsShowing(true);
                        }
                    }
                    />
        </div>
    );

}


export default GraphSettingsController;