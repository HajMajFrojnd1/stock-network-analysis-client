import TemporalTopBar from "./TemporalTopBar";
import { useState, useEffect, useCallback } from "react";
import GraphFetch from "../scripts/graphFetching";
import { parseDate } from "../scripts/utilityFunctions";
import MySigmaController from "./MySigmaController";
import ComplexListener from "../scripts/ComplexListener";
import { aggr } from "../settings/graphFilters";
import { GraphInstance } from "../instances/GraphInstance.ts";
import ForceAtlasGraph from "./ForceAtlasGraph";
import Graph from "graphology";
import { stringToColour } from "../scripts/utilityFunctions";
import Information from "./Information";
import FilterWrapper from "./FilterWrapper";
import Input from "./Input";
import Button from "./Button";
import Switch from 'react-input-switch';
import PortfolioChart from "./PortoflioChart";
import HistoryFetch from "../scripts/historyFetching";
import { Stocks } from "../instances/StockHistory.ts";
import { parseOptionsDate } from "../scripts/utilityFunctions";

const PortfolioLayout = ({toggleMode}) => {

    const [aggrValue, setAggrValue] = useState(1);
    const [rangeType, setRangeType] = useState("month");
    const [simType, setSimType] = useState("gaussian-based");
    const [currentDateRange, setCurrentDateRange] = useState([null,null]);
    const [dateOptions, setDateOptions] = useState([]);
    const [simTypes, setSimTypes] = useState([]);
    const [graphInstance, setGraphInstance] = useState(null);
    const [degreeValue, setDegreeValue] = useState(1);
    const [weightValue, setWeightValue] = useState(0.1);
    const [toggleDegrees, settoggleDegrees] = useState(false);
    const [toggleFilterMode, settoggleFilterMode] = useState(false);
    const [showPortfolio, setShowPortfolio] = useState(false);
    const [graphNodes,setGraphNodes] = useState(null);
    const [chartData1, setChartData1] = useState(null);
    const [chartData2, setChartData2] = useState(null);
    const [portfolioRange, setPortfolioRange] = useState("1Month");
    const [, updateState] = useState();
    const forceUpdate = useCallback(() => updateState({}), []);

    const controllerListener = new ComplexListener();

    const updateAggrValue = (value) => {
        setAggrValue(value);
        dataFetch(value, rangeType, simType);
    }    
    
    const updateRangeType = (type) => {
        setRangeType(type);
        if (aggrValue < aggr[type].min || aggrValue > aggr[type].max){
            updateAggrValue(aggr[rangeType].min);
        }
        dataFetch(aggrValue,type,simType);
    }

    const updateShowPortfolio = () => {
        setShowPortfolio(!showPortfolio);
    }

    const setOptions = async () => {
        let sim = await GraphFetch.fetchSimTypes();
        setSimType(sim[0].name);
        setSimTypes(sim.map((el) => {return el.name}));
        dataFetch(aggrValue,rangeType,sim[0].name);
    }

    const updateDateOptions = (options) =>{
        setCurrentDateRange(parseOptionsDate(options[0].dates))
        setDateOptions(options);
    }

    const applyFilter = () => {
        graphInstance.resetGraph();
        if(!toggleFilterMode){
            graphInstance.reduceGraphEdgesWeight(weightValue);
            if(toggleDegrees)
                for(let i = 0; i < 20; i++)
                    graphInstance.reduceGraphNodesDegree(degreeValue);
            else
                graphInstance.reduceGraphNodesDegree(degreeValue);
        }
        else{
            //graphInstance.reduceGraphEdgesWeightOpposite(weightValue);
            if(toggleDegrees)
                for(let i = 0; i < 20; i++)
                    graphInstance.reduceGraphNodesDegreeOpposite(degreeValue);
            else
                graphInstance.reduceGraphNodesDegreeOpposite(degreeValue);
        }
        graphInstance.calculateLouvain();
        setGraphNodes(graphInstance.getNodes())
        forceUpdate();
    }

    const resetGraph = () => {
        graphInstance.resetGraph();
        controllerListener.cleanListeners();
        setGraphNodes(graphInstance.getNodes())
        forceUpdate();
    }

    const changeOptions = (id, date) => {
        
        setCurrentDateRange(parseOptionsDate(date));
        fetchGraph(id);
    }


    const getGraphFromData = (data) => {

        const graph = new Graph();
        // map labels to id so i can later fetch information by ticker
        const id_to_label = {}

        data.nodes.forEach(element => {

            id_to_label[element.id] = element.label

            graph.addNode(element.label, {
    
              label:element.label, 
              color: stringToColour(String(element.sector)),
              x: Math.random(),
              y: Math.random(),
              size: 5,
              sector: element.sector
            });
          });
    
        data.edges.forEach(element => {
            
            graph.addEdge(
                id_to_label[element.source],
                id_to_label[element.target],
                {
                    weight: element.weight
                }
            );
              
        });

        return graph;

    }

    const updateGraphInstance = (graphI) => {
        setGraphInstance(graphI);
        setGraphNodes(graphI.getNodes());
    }

    const fetchGraph = async (id) =>{
        const data = await GraphFetch.fetchGraphId(id);
        updateGraphInstance(new GraphInstance(getGraphFromData(data[0].data)));
    }

    const dataFetch = async (aggregate,type, sim_type) => {
        
        const data = await GraphFetch.fetchNoDataSimilarity(aggregate,type,sim_type);

        let options = [];
        data.forEach(element => {
            options.push({ dates: parseDate(element.start,element.end), id: element.id})
        });

        updateDateOptions(options);
        fetchGraph(options[0].id);
    }

    const updateChart = (range) =>{
        setPortfolioRange(range);
        HistoryFetch.fetchPortfolioData(range, ["SPX"], currentDateRange[0], currentDateRange[1]).then((data) =>{
            let dates = data.splice(data.length-1, 1)[0];
            let stocks = Stocks.fromFetchedData(data);
            let changes = stocks.getAverageChanges();
            let fin = changes.map((change, idx) => {
                return {
                    name: dates[idx],
                    "SPX Change": change
                }
            })
            setChartData1(fin);

        });
        HistoryFetch.fetchPortfolioData(range, graphNodes, currentDateRange[0], currentDateRange[1]).then((data) =>{
            let dates = data.splice(data.length-1, 1)[0];
            let degrees = graphInstance.getDegreeSum();
            console.log(data);
            data = data.map((stock) => {
                return {...stock, weight: graphInstance.getGraph().degree(stock.ticker)/degrees}
            });
            let stocks = Stocks.fromFetchedData(data);
            let changes = stocks.getDegreeWeightedChanges();
            let fin = changes.map((change, idx) => {
                return {
                    name: dates[idx],
                    "Custom Graph Change": change
                }
            })
            setChartData2(fin);

        });
    }

    useEffect(() => {
        dataFetch(aggrValue, rangeType, simType);
    }, [aggrValue,rangeType,simType])

    useEffect(() => {

        if(graphNodes){

            updateChart(portfolioRange)

        }

    }, [graphNodes])

    useEffect(() => {
        setOptions();
    },[]);

    return (
        <div className="mw">
            <div className="left-side" style={{width:"85%",marginRight:0}}>
                <TemporalTopBar dateOptions={dateOptions} 
                                aggrValue={aggrValue}
                                rangeType={rangeType}
                                simTypesOptions={simTypes}
                                aggrChange={updateAggrValue}
                                rangeChange={updateRangeType}
                                toggleMode={toggleMode}
                                changeOptions={changeOptions}
                                types={["month","year"]}
                                modes={1}
                                />
                {
                    graphInstance && !showPortfolio &&

                    <div className="graph-wrap">
                        <ForceAtlasGraph    graphInstance={graphInstance} 
                                            style={{width:"100%",height:"100%", border: "4px solid #0A0A0A", boxSizing: "border-box", position: "relative"}}
                                            listener={controllerListener}
                                            />
                        <MySigmaController listener={controllerListener}/>
                    </div>

                }
                {
                    showPortfolio &&
                    <PortfolioChart data={chartData1}
                                    dataTwo={chartData2}
                                    updateChart={updateChart}
                                    range={portfolioRange}
                                    />
                }
            </div>
                <div className="right-side" style={{marginLeft: "1rem", width:"15%"}}>                
                    <Information>
                        <FilterWrapper title="Degree">
                            <Input  type="number" 
                                    aggrValue={degreeValue} 
                                    onChange={setDegreeValue}
                                    style={{width: "100%", boxSizing: "border-box"}}
                                    />
                        </FilterWrapper>
                        <FilterWrapper title="Edge Weight">
                            <Input  type="number" 
                                    floats={true}
                                    aggrValue={weightValue} 
                                    onChange={setWeightValue}
                                    />
                        </FilterWrapper>
                        <FilterWrapper title="Degree Reduction">
                            <Switch on={true}
                                    off={false} 
                                    value={toggleDegrees} 
                                    onChange={settoggleDegrees} 
                                    styles={{
                                        container: {
                                            width: "6rem",
                                            height: "2.5rem",
                                        },
                                        button: {
                                            right: "3rem",
                                        },
                                        buttonChecked: {
                                            left: "3rem"
                                        }
                                    }}
                                    />;
                        </FilterWrapper>
                        <FilterWrapper title="Opposite Mode">
                            <Switch on={true}
                                    off={false} 
                                    value={toggleFilterMode} 
                                    onChange={settoggleFilterMode} 
                                    styles={{
                                        container: {
                                            width: "6rem",
                                            height: "2.5rem",
                                        },
                                        button: {
                                            right: "3rem",
                                        },
                                        buttonChecked: {
                                            left: "3rem"
                                        }
                                    }}
                                    />;
                        </FilterWrapper>
                        <div className="portfolio_btns">
                            <Button class="main-button"
                                    text="Apply"
                                    onClick={applyFilter}
                                    />
                            <Button class="secondary-button"
                                    text="Reset"
                                    onClick={resetGraph}
                                    />
                        </div>
                    </Information>
                        <div className="portfolio_btns">
                            <Button class="main-button"
                                    text={!showPortfolio ? "Show Portfolio" : "Hide Portfolio"}
                                    onClick={updateShowPortfolio}
                                    />
                        </div>
                </div>
        </div>
    )

}

export default PortfolioLayout;