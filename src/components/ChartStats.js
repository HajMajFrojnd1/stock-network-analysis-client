import { useState } from "react";
import { useEffect } from "react";
import FilterWrapper from "./FilterWrapper";


const ChartStats = ({title,data,dataKey}) => {
    
    const [values, setValues] = useState([0,0,0]);

    useEffect(() => {
    
        let min = 0;
        let max = 0;
        data.forEach(element => {
            if(element[dataKey] < min){
                min = element[dataKey];
            }
            else if(element[dataKey] > max){
                max = element[dataKey];
            }
        });
    
        setValues([Math.round(min* 100) / 100,Math.round(max* 100) / 100,Math.round(data[data.length-1][dataKey]* 100) / 100]);

    }, [data])

    return(
        <div className='p_chart chart_stats'>
            <div>
                <h2>{title}</h2>
            </div>
            <div style={{display: "flex"}}>
                <FilterWrapper title={"Lowest"}><h2>{values[0]}%</h2></FilterWrapper>
                <FilterWrapper title={"Highest"}><h2>{values[1]}%</h2></FilterWrapper>
                <FilterWrapper title={"End"}><h2>{values[2]}%</h2></FilterWrapper>
            </div>
        </div>
    );
}

export default ChartStats;