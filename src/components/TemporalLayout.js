import TemporalTopBar from "./TemporalTopBar";
import { useState, useEffect, useCallback } from "react";
import GraphFetch from "../scripts/graphFetching";
import { parseDate } from "../scripts/utilityFunctions";
import { SemipolarLoading } from "react-loadingg";
import Graph from "graphology";
import { stringToColour } from "../scripts/utilityFunctions";
import TemporalGraphAnimation from "./TemporalGraphAnimation";
import {setGraphLouvain} from "../scripts/graphUtilityFunctions";
import forceAtlas2 from 'graphology-layout-forceatlas2';
import MySigmaController from "./MySigmaController";
import ComplexListener from "../scripts/ComplexListener";
import { aggr } from "../settings/graphFilters";
import { parseOptionsDate } from "../scripts/utilityFunctions";



const TemporalLayout = ({toggleMode}) => {

    const [aggrValue, setAggrValue] = useState(2);
    const [rangeType, setRangeType] = useState("day");
    const [simType, setSimType] = useState("gaussian-based");
    const [currentDateRange, setCurrentDateRange] = useState(null);
    const [rangeTexts, setRangeTexts] = useState([]);
    const [dateOptions, setDateOptions] = useState([]);
    const [simTypes, setSimTypes] = useState([]);
    const [aggregatedGraphs, setAggregatedGraphs] = useState([]);
    const [aggregatedGraphsPos, setAggregatedGraphsPos] = useState(0);
    const [currentGraph, setCurrentGraph] = useState(null);
    const [nextGraph, setNextGraph] = useState(null);
    const [isLoading , setIsLoading] = useState(true);
    const [reset, setReset] = useState(false);
    const [, updateState] = useState();
    const forceUpdate = useCallback(() => updateState({}), []);

    const nodePositions = {};
    const controllerListener = new ComplexListener();

    const settings =    {   settings: {
                                gravity: 5,
                                edgeWeightInfluence: 1,
                                linLogMode: true
                                },
                            iterations: 2000
                        }

    const updateAggrValue = (value) => {
        controllerListener.cleanListeners();
        if(value == 1) return;
        setAggrValue(value);
        dataFetch(value, rangeType, simType);
    }    
    
    const updateRangeType = (type) => {
        controllerListener.cleanListeners();
        setRangeType(type);
        if (aggrValue < aggr[type].min || aggrValue > aggr[type].max){
            updateAggrValue(2);
            return;
        }
        dataFetch(aggrValue,type,simType);
    }

    const changeOptions = (id, date) => {
        setCurrentDateRange(parseOptionsDate(date));
    }


    const setOptions = async () => {
        let sim = await GraphFetch.fetchSimTypes();
        setSimType(sim[0].name);
        setSimTypes(sim.map((el) => {return el.name}));
        dataFetch(aggrValue,rangeType,sim[0].name);
    }

    const updateDateOptions = (options) =>{
        setDateOptions(options);
        setCurrentDateRange(parseOptionsDate(options[0].dates));
    }

    const updateTemporalGraph = () =>{

        setIsLoading(true);

        let index = aggregatedGraphsPos + 1;
        if(index === aggregatedGraphs.length){
            index = 0;
        }
        
        setAggregatedGraphsPos(index);

        let n_graph;

        setCurrentGraph(aggregatedGraphs[index]);
        if(index + 1 === aggregatedGraphs.length){
            setNextGraph(aggregatedGraphs[0]);
            
        }
        else{
            setNextGraph(aggregatedGraphs[index+1]);
        }

        
        aggregatedGraphs.forEach(aggregatedGraph => {
            aggregatedGraph.forEachNode((node, attributes) => {
                if(attributes.old_x !== undefined){
                    aggregatedGraph.setNodeAttribute(node, "x", attributes.old_x);
                    aggregatedGraph.setNodeAttribute(node, "y", attributes.old_y);
                }
            });
        })

        setReset(!reset)

        forceUpdate();

    }

    const createGraphFixedPosition = (data) =>{
        const graph = new Graph();
        const id_to_label = {}

        data.nodes.forEach(element => {

            if(!(element.label in nodePositions)){
                nodePositions[element.label] = {
                    x: Math.random(),
                    y: Math.random()
                }
            }

            id_to_label[element.id] = element.label

            graph.addNode(element.label, {
    
              label:element.label, 
              color: stringToColour(String(element.sector)),
              x: nodePositions[element.label].x,
              y: nodePositions[element.label].y,
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

            
        setGraphLouvain(graph);
        forceAtlas2.assign(graph, settings);

        graph.mapNodes((node,attributes) =>{
            attributes.old_x = attributes.x;
            attributes.old_y = attributes.y
            attributes.old_color = attributes.color
        })

        return graph;
    }

    const resetGraphs = (graphs) => {
        setAggregatedGraphsPos(0);
        setAggregatedGraphs(graphs);
        setCurrentGraph(graphs[0]);
        setNextGraph(graphs[1]);
        forceUpdate();
    }

    const fetchAggregatedGraphs = async () => {

        let start = new Date(currentDateRange[0]);
        let end = new Date(currentDateRange[1]);
        const ranges = await GraphFetch.fetchNoDataSimilarity(1,rangeType,simType);
        let rangeGraphs = [];

        ranges.forEach(range => {
            let date = new Date(range.start);
            if(date.getTime() >= start.getTime() && date.getTime() <= end.getTime()){
                rangeGraphs.push(range);
            }
        });


        let ran = rangeGraphs.map(range => {
            let dates = parseOptionsDate(parseDate(range.start,range.end))
            return dates[0] + " " + dates[1];
        })


        setRangeTexts(ran.reverse());

        let finalGraphs = rangeGraphs.map((range) => {
            return GraphFetch.fetchGraphId(range.id);
        });
        Promise.all(finalGraphs).then((pgraphs) => {
            let graphs = pgraphs.map((graph) => {
                return createGraphFixedPosition(graph[0].data);
            })
            resetGraphs(graphs);
            setIsLoading(false);
        });

        controllerListener.cleanListeners();

    }

    const dataFetch = async (aggregate,type, sim_type) => {
        
        const data = await GraphFetch.fetchNoDataSimilarity(aggregate,type,sim_type);


        let options = [];
        data.forEach(element => {
            options.push({ dates: parseDate(element.start,element.end), id: element.id})
        });
        options.splice(0,1)

        updateDateOptions(options);
    }


    useEffect(() => {
        if(currentGraph){
            setIsLoading(false);
        }
    }, [currentGraph,nextGraph]);

    useEffect(() => {
        if(currentDateRange){
            setIsLoading(true);
            fetchAggregatedGraphs();
        }
    },[currentDateRange])

    useEffect(() => {
        setOptions();
    },[]);

    if(!isLoading){

        return (
            <div className="mw">
                <div className="left-side" style={{marginRight:0}}>
                    <TemporalTopBar dateOptions={dateOptions} 
                                    aggrValue={aggrValue}
                                    rangeType={rangeType}
                                    simTypesOptions={simTypes}
                                    aggrChange={updateAggrValue}
                                    rangeChange={updateRangeType}
                                    changeOptions={changeOptions}
                                    toggleMode={toggleMode}
                                    modes={2}
                                    />
                    {
                        isLoading && <SemipolarLoading size={"large"}/>
                    }
                    {
                        !isLoading  && <TemporalGraphAnimation  currentGraph={currentGraph.copy()}
                                                                nextGraph={nextGraph.copy()}
                                                                listener={controllerListener}
                                                                update={updateTemporalGraph}
                                                                currentDate={rangeTexts[aggregatedGraphsPos]}
                                                                />
                                                                
                                                            }                   
                
                        <MySigmaController  listener={controllerListener}
                                            reset={reset}
                                            />
                </div>
            </div>
        )

    }

    return (
        <div className="mw">
            <div className="left-side" style={{marginRight:0}}>
                <TemporalTopBar dateOptions={dateOptions} 
                                aggrValue={aggrValue}
                                rangeType={rangeType}
                                simTypesOptions={simTypes}
                                aggrChange={updateAggrValue}
                                rangeChange={updateRangeType}
                                changeOptions={changeOptions}
                                toggleMode={toggleMode}
                                modes={2}
                                />
                {
                    isLoading && <SemipolarLoading size={"large"}/>
                }
                {
                    !isLoading  && <TemporalGraphAnimation  currentGraph={currentGraph.copy()}
                                                            nextGraph={nextGraph.copy()}
                                                            listener={controllerListener}
                                                            update={updateTemporalGraph}
                                                            currentDate={rangeTexts[aggregatedGraphsPos]}
                                                            />
                                                            
                                                        }                   
            
                    
            </div>
        </div>
    )

}

export default TemporalLayout;