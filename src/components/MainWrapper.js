import "../index.css"
import SideBar from "./SideBar";
import TopBar from "./TopBar";
import DisplayGraph from "./GraphExample";
import TemporalLayout from "./TemporalLayout";
import { aggr } from "../settings/graphFilters";
import { parseDate } from "../scripts/utilityFunctions";
import { useState, useEffect } from "react";
import GraphFetch from "../scripts/graphFetching";
import PortfolioLayout from "./PortfolioBuilder";
import CandleSicksTrend from "./CandleSticksTrend";

const MainWrapper = () => {

    const [stockInformation, setStockInformation] = useState(0);
    const [graphsData, setGraphsData] = useState([]);
    const [rangeType, setRangeType] = useState("day");
    const [aggrValue, setAggrValue] = useState(1);
    const [dateOptions, setDateOptions] = useState([]);
    const [simType, setSimType] = useState("gaussian_based");
    const [simTypes, setSimTypes] = useState([]);
    const [layout, setLayout] = useState("single");
    const [isTemporalLayout, setIsTemporalLayout] = useState(3);

    const layout_types = {
        single: "single",
        double_sideways: "double_sideways",
        double_upper: "double_upper",
        triple: "triple",
        quad: "quad"
    }

    const toggleMode = (mode) => {
        setIsTemporalLayout(mode);
    }

    const updateLayout = (layout) => {
        setLayout(layout);
    }
    
    const updateStockInformation = (data) => {
        setStockInformation(data);
    }

    const updateRangeType = (type) => {
        setRangeType(type);
        if (aggrValue < aggr[type].min || aggrValue > aggr[type].max){
            updateAggrValue(aggr[rangeType].min);
        }
        dataFetch(aggrValue,type,simType);
    }

    const updateAggrValue = (value) => {
        setAggrValue(value);
        dataFetch(value,rangeType,simType);
    }

    const updateGraphsData = (data) => {
        setGraphsData(data);
    }

    const updateSimType = (value) => {
        setSimType(value);
        dataFetch(aggrValue,rangeType,value);
    }

    const updateDateOptions = (options) => {
        setDateOptions(options);
    }

    const changeOptions = (id) => {
        fetchGraph(id);
    }

    const fetchGraph = async (id) =>{
        const data = await GraphFetch.fetchGraphId(id);
        updateGraphsData(data[0].data);
    }

    const setOptions = async () => {
        let sim = await GraphFetch.fetchSimTypes();
        setSimType(sim[1].name);
        setSimTypes(sim.map((el) => {return el.name}));
    }

    const dataFetch = async (aggregate,type,simType) => {

        const data = await GraphFetch.fetchNoDataSimilarity(aggregate,type,simType);
        let options = [];
        data.forEach(element => {
            options.push({ dates: parseDate(element.start,element.end), id: element.id})
        });
        updateDateOptions(options);
        setOptions();
        fetchGraph(options[0].id);

    }

    useEffect(() => {
    
        console.log("hurray");

    }, [graphsData.graph]);

    useEffect(() => {
    
        dataFetch(aggrValue,"day",simType);

    }, []);

    if(isTemporalLayout === 3){
        return (
            <CandleSicksTrend   toggleMode={toggleMode}
                                simTypes={simTypes}
                                />
        )
    }

    if(isTemporalLayout === 2){
        return (
            <PortfolioLayout toggleMode={toggleMode}/>
        )
    }
    if(isTemporalLayout === 1){
        return (
            <TemporalLayout toggleMode={toggleMode}/>
        )
    }
    
    return (
        <div className="mw">
            <div className="left-side">
                <TopBar layoutOptions={layout_types} 
                        dateOptions={dateOptions} 
                        simTypesOptions={simTypes}
                        rangeType={rangeType} 
                        aggrValue={aggrValue} 
                        simType={simType}
                        changeLayout={updateLayout} 
                        changeOptions={changeOptions} 
                        rangeChange={updateRangeType} 
                        aggrChange={updateAggrValue}
                        simChange={updateSimType}
                        toggleMode={toggleMode}
                        />
                <div className="graph_right_side" >
                <DisplayGraph   graphsData={graphsData} 
                                setStockInformation={updateStockInformation}
                                layout={layout}
                                />
                <SideBar    stockInformation={stockInformation} 
                        graphsData={graphsData}
                        />
                </div>
            </div>

        </div>
    );
}

export default MainWrapper;