import FilterWrapper from "./FilterWrapper";
import Button from "./Button";
import Input from "./Input";
import graph from "../images/graph.svg"
import timer from "../images/timer.svg"
import network from "../images/graph_n.svg"
import { types } from "../settings/graphFilters";
import { useEffect, useState } from "react";
import HistoryFetch from "../scripts/historyFetching";
import { discontinuousTimeScaleProvider } from "react-stockcharts/lib/scale";
import { last } from "react-stockcharts/lib/utils";
import CandleChart from "./CandleChart";

const CandleSicksTrend = ({toggleMode,simTypes}) => {

    const [stockData,setStockData] = useState(null);
    const [weirdData, setWeirdData] = useState(null);

    const xScaleProvider = discontinuousTimeScaleProvider
			.inputDateAccessor(d => d.date);

    if(stockData){

    }
    

    const fetchData = async () => {

        const data = await HistoryFetch.fetchSpxCandlesticks();

        const final_data = data.map(d => {
            return {
                date: new Date(d.date.split("T")),
                open: +d.open,
                high: +d.high,
                low: +d.low,
                close: +d.close,
                volume: +d.voleme 
            };
        });

        final_data.reverse();

        updateStockData(final_data);

    }

    const updateStockData = (stocks) => {
        setStockData(stocks);

        const {
            data,
            xScale,
            xAccessor,
            displayXAccessor,
        } = xScaleProvider(stocks);
    
        const xExtents = [
            xAccessor(last(data)),
            xAccessor(data[data.length - 100])
        ];
       
        setWeirdData(
            {
                data: data,
                xScale: xScale,
                xAccessor: xAccessor,
                displayXAccessor: displayXAccessor,
                xExtents: xExtents
            }
        );

    }

    useEffect(() => {

        fetchData();

    },[])

    return(
        <div className="left-side" style={{width: "100%"}}>
            <div className="top-bar">
                    <FilterWrapper title="Agregace">
                        <Input  type="select" 
                                p_options={types}
                                />
                    </FilterWrapper>
                    <FilterWrapper title="Similarity Type">
                        <Input  type="select" 
                                p_options={simTypes}>
                        </Input>
                    </FilterWrapper>
                    <FilterWrapper title="Mode">
                        <Button class="special-button"  
                                image={network}
                                onClick={
                                    () => toggleMode(0)
                                }
                                />
                        <Button class="special-button"  
                                image={timer}
                                onClick={
                                    () => toggleMode(1)
                                }
                                />
                        <Button class="special-button"  
                                image={graph}
                                onClick={
                                    () => toggleMode(2)
                                }
                                />
                    </FilterWrapper>
            </div>
            { weirdData &&
                <div style={{width:"100%", flex: 1, background: "#FFF"}}>
                    <CandleChart data={weirdData}/>
                </div>
            }
        </div>
    );
}

export default CandleSicksTrend;