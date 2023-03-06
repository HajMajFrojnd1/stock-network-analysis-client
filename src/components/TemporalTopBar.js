import FilterWrapper from "./FilterWrapper";
import Input from "./Input";
import Button from "./Button";
import { types } from "../settings/graphFilters";
import { useEffect } from "react";
import single from "../images/single_layout.svg"
import graph from "../images/graph.svg"
import timer from "../images/timer.svg"
import candles from "../images/candles.svg"


const TemporalTopBar = (props) => {

    return(
        <div className="top-bar">
                    <FilterWrapper title="Agregace">
                        <Input  type="number" 
                                rangeType={props.rangeType} 
                                aggrValue={props.aggrValue} 
                                onChange={props.aggrChange}
                                />
                        <Input  type="select" 
                                rangeType={props.rangeType} 
                                onChange={props.rangeChange} 
                                p_options={typeof props.types === "object" ? props.types : types}>
                        </Input>
                    </FilterWrapper>
                    <FilterWrapper title="Range">
                        <Input  type="select" 
                                onChange={props.changeOptions} 
                                p_options={props.dateOptions}>
                        </Input>
                    </FilterWrapper>
                    <FilterWrapper title="Similarity Type">
                    <Input  type="select" 
                            rangeType={props.rangeType} 
                            p_options={props.simTypesOptions}>
                    </Input>
                </FilterWrapper>
                <FilterWrapper title="Mode">
                    <Button class="special-button"  
                            image={single}
                            onClick={
                                () => props.toggleMode(0)
                            }
                            />
                    { props.modes === 1 
                        ? 
                        <Button class="special-button"  
                            image={timer}
                            onClick={
                                () => props.toggleMode(1)
                            }
                            />
                        :
                        <Button class="special-button"  
                            image={graph}
                            onClick={
                                () => props.toggleMode(2)
                            }
                            />
                    }
                    <Button class="special-button"  
                            image={candles}
                            onClick={
                                () => props.toggleMode(3)
                            }
                            />
                </FilterWrapper>
        </div>
    )

}


export default TemporalTopBar;