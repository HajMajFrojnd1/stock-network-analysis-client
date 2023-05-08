import "../index.css"
import SideBar from "./SideBar";
import TopBar from "./TopBar";
import DisplayGraph from "./GraphExample";
import TemporalLayout from "./TemporalLayout";
import { aggr } from "../settings/graphFilters";
import { parseDate, parseOptionsDate } from "../scripts/utilityFunctions";
import { useState, useEffect } from "react";
import GraphFetch from "../scripts/graphFetching";
import PortfolioLayout from "./PortfolioBuilder";
import CandleSicksTrend from "./CandleSticksTrend";
import Button from "./Button";
import visual from "../images/graph_n.svg"
import chart from "../images/chart.svg"
import DashBoard from "./DashBoard";

const MainWrapper = () => {

    const [stockInformation, setStockInformation] = useState(0);
    const [graphsData, setGraphsData] = useState([]);
    const [rangeType, setRangeType] = useState("day");
    const [aggrValue, setAggrValue] = useState(1);
    const [dateOptions, setDateOptions] = useState([]);
    const [currentDate, setCurrentDate] = useState(null);
    const [simType, setSimType] = useState("gaussian_based");
    const [simTypes, setSimTypes] = useState([]);
    const [layout, setLayout] = useState("single");
    const [isTemporalLayout, setIsTemporalLayout] = useState(0);
    const [dashBoard, setDashBoard] = useState(false);
    const [graphInstance, setGraphInstance] = useState(null);

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
        setGraphInstance(null);
        setGraphsData(data);
    }

    const updateSimType = (value) => {
        setSimType(value);
        dataFetch(aggrValue,rangeType,value);
    }

    const updateDateOptions = (options) => {
        setDateOptions(options);
    }

    const changeOptions = (id, date) => {
        setCurrentDate(parseOptionsDate(date));
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
        setCurrentDate(parseOptionsDate(options[0].dates));
        fetchGraph(options[0].id);

    }

    useEffect(() => {
    
        dataFetch(aggrValue,"day",simType);

    }, []);

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
            <div className="main-navbar">
                <Button class="special-quad-button"  
                                image={visual}
                                onClick={
                                    () => setDashBoard(false)
                                }
                                />
                <Button class="special-quad-button"  
                                image={chart}
                                onClick={
                                    () => setDashBoard(true)
                                }
                                />
            </div>
            {!dashBoard &&
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
                                setInstance={setGraphInstance}
                                graphInstance={graphInstance}
                                layout={layout}
                                currentDate={currentDate}
                                />
                <SideBar    stockInformation={stockInformation} 
                            graphsData={graphsData}
                            />
                </div>
            </div>
            }
            {dashBoard &&
            <DashBoard  graphInstance={graphInstance}/>
            }
        </div>
    );
}

export default MainWrapper;