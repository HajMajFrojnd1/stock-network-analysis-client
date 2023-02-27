import { useEffect } from "react";
import { useState } from "react";
import { aggr } from "../settings/graphFilters";

const Input = ({type,p_options,aggrValue,onChange,rangeType,style= {width: "3rem"}, value=null, floats = false}) => {

    const [options, setOptions] = useState([]);

    useEffect(()=>{

        const _options = []
        if (type === "select"){
            
            if(typeof(p_options[0]) == "string"){
                p_options.forEach(element => {
                    _options.push(<option value={element}>{element}</option>)
                });
            }
            else{
                p_options.forEach(element => {
                    _options.push(<option value={element.id}>{element.dates}</option>)
                });
            }
            
            setOptions(_options);

        }
    
    }, [p_options]);

    return(
        <div>
            {(type === "select") 
                &&  <div className="select">
                        <select value={value}
                                onChange={e => {
                                    onChange(e.target.value,e.target.options[e.target.selectedIndex].text);
                                }
                        }>
                            {options}
                        </select>
                    </div>
            
            }
            {(type === "number" && !floats) 
                && <input style={style} type={type} value={aggrValue} 
                        onChange={e => {
                            if(rangeType === undefined){
                                if(!floats){
                                    if(e.target.value >=1 && e.target.value <= 100){
                                        onChange(e.target.value)
                                    }
                                }
                                
                            }
                            else if(e.target.value >= aggr[rangeType].min && e.target.value <= aggr[rangeType].max){
                                onChange(e.target.value)
                            }

                
                        }
                    }>
                </input>
            }
            {(type === "number" && floats) 
                && <input style={style} step={0.01} min={0} max={1} type={type} value={aggrValue} 
                        onChange={e => {
                            onChange(e.target.value)
                        }
                    }>
                </input>
            }
        </div>
    );

}


export default Input;