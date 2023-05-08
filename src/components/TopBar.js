import FilterWrapper from "./FilterWrapper";
import Input from "./Input";
import Button from "./Button";
import graph from "../images/graph.svg"
import timer from "../images/timer.svg"
import double_sideways from "../images/double_sideways.svg"
import double_upper from "../images/double_upper.svg"
import triple from "../images/triple_layout.svg"
import network from "../images/graph_n.svg"
import quad from "../images/quad_layout.svg"
import candles from "../images/candles.svg"
import single from "../images/single_layout.svg"
import { types } from "../settings/graphFilters";

const TopBar = (props) =>{
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
                            p_options={types}
                            />
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
                            onChange={props.simChange}
                            p_options={props.simTypesOptions}>
                    </Input>
                </FilterWrapper>
                <FilterWrapper title="Layout Option">
                    <Button class="special-button"  
                            image={single}
                            onClick={
                                () => props.changeLayout(props.layoutOptions.single)
                            }
                            />
                    <Button class="special-button"  
                            image={double_sideways}
                            onClick={
                                () => props.changeLayout(props.layoutOptions.double_sideways)
                            }
                            />
                    <Button class="special-button"  
                            image={double_upper}
                            onClick={
                                () => props.changeLayout(props.layoutOptions.double_upper)
                            }
                            />
                    <Button class="special-button"  
                            image={triple}
                            onClick={
                                () => props.changeLayout(props.layoutOptions.triple)
                            }
                            />
                    <Button class="special-button"  
                            image={quad}
                            onClick={
                                () => props.changeLayout(props.layoutOptions.quad)
                            }
                            />
                </FilterWrapper>
                <FilterWrapper title="Mode">
                    <Button class="special-button"  
                            image={timer}
                            onClick={
                                () => props.toggleMode(1)
                            }
                            />
                    <Button class="special-button"  
                            image={graph}
                            onClick={
                                () => props.toggleMode(2)
                            }
                            />
                    
                </FilterWrapper>
        </div>

    );

}


export default TopBar;