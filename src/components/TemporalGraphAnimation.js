import ForceAtlasGraph from "./ForceAtlasGraph";
import { useState, useEffect, useCallback } from "react";
import {getPositionAlongTheLine, transitionColor} from "../scripts/utilityFunctions"
import { GraphInstance } from "../instances/GraphInstance.ts";
import { UndirectedGraph } from "graphology";

const TemporalGraphAnimation = ({currentGraph, nextGraph, listener, update, currentDate}) =>{

    const [graph, setGraph] = useState(null);
    const [firstTime, setFirstTime] = useState(true);
    const [, updateState] = useState();
    const forceUpdate = useCallback(() => updateState({}), []);
    const [animationStarted, setAnimationStarted] = useState(false);
    let percentage = 0;

    const getUnioinEdges = (graph1, graph2) => {

        let edges = []
        graph1.forEachEdge((edge, attributes, source, target) => {

            if(!(graph2.hasEdge(source, target) || graph2.hasEdge(target,source))){
                edges.push(edge);
            }else{
                graph1.setEdgeAttribute(edge, "color", "#00FF00");
            }

        })

        return edges;
    }


    const addEdges = (graph1, graph2) => {
        
        let edges = getUnioinEdges(graph2,graph1);
        let length = 4000;
        let one_reduction_time = Math.floor(length / edges.length);
        let i = 0;

        const addEdge = () =>{
            setTimeout(() => {
                let att = graph2.getEdgeAttribute(edges[i++], "source");
                if(i < edges.length)
                    addEdge();
            }, one_reduction_time);
        }

        addEdge();

    }

    const reduceEdges = (graph1, graph2) => {

        let edges = getUnioinEdges(graph1,graph2);
        let length = 5000;
        let one_reduction_time = Math.floor(length / edges.length);
        let i = 0;

        for(; i < edges.length; i++){
            graph1.dropEdge(edges[i]);
        }
    }

    const animateNodes = () =>{
        if(animationStarted){
            setTimeout(() => {
                if(percentage < 1){
                    percentage += 0.001;
                    animateNodes();
                    graph.updateEachNodeAttributes((node, attributes) => {
                        if(graph.hasNode(node) && nextGraph.hasNode(node)){
                            let other_attributes = nextGraph.getNodeAttributes(node);
                            let pos = getPositionAlongTheLine(
                                            attributes.old_x, 
                                            attributes.old_y, 
                                            other_attributes.x, 
                                            other_attributes.y, 
                                            percentage
                                        );
                            let color = transitionColor(
                                            String(other_attributes.color).substr(1), 
                                            String(attributes.old_color).substr(1), 
                                            percentage
                                        );
                            return {
                                ...attributes,
                                x: pos.x,
                                y: pos.y,
                                color: color
                            }
                        }
                        return{
                            ...attributes
                        }

                    });
                    forceUpdate();
                }else{
                    percentage = 1;
                    graph.updateEachNodeAttributes((node, attributes) => {
                        if(graph.hasNode(node && nextGraph.hasNode(node))){
                            let other_attributes = nextGraph.getNodeAttributes(node);
                            let pos = getPositionAlongTheLine(
                                                                attributes.old_x, 
                                                                attributes.old_y, 
                                                                other_attributes.x, 
                                                                other_attributes.y, 
                                                                percentage
                                                            );
                            let color = transitionColor(
                                                            String(other_attributes.color).substr(1), 
                                                            String(attributes.old_color).substr(1), 
                                                            percentage
                                                        );
                            return {
                                ...attributes,
                                x: pos.x,
                                y: pos.y,
                                color: color
                            }
                        }
                        return{
                            ...attributes
                        }

                    });
                    forceUpdate();
                    setTimeout(() => {
                            setTimeout(() => {
                                update();
                            },500);
                    },500);
                }
                
            }, 10)
        }
    }

    const animate = () => {
        setAnimationStarted(!animationStarted);
    }    

    const stopAnimate = () => {
        setAnimationStarted(false);
    }

    useEffect(() => {
        if(currentGraph){
            currentGraph.mapNodes((node,attributes) =>{
                attributes.old_x = attributes.x;
                attributes.old_y = attributes.y
                attributes.old_color = attributes.color
            })
            setGraph(currentGraph);

            listener.addListener(animate, "start");
            listener.addListener(stopAnimate, "stop");
        }
        
        if(animationStarted){
            animateNodes();
            reduceEdges(currentGraph,nextGraph);
        }

        

        return(() => {
            listener.removeListener(animate, "start");
            listener.removeListener(stopAnimate, "stop");
        })

    },[])

    useEffect(() => {
        if(animationStarted){
            animateNodes();
            reduceEdges(currentGraph,nextGraph);
        }
    }, [animationStarted])

    if(graph){
        return (
            <div style={{width:"100%",height:"100%", position: "relative"}}>

                <ForceAtlasGraph    graphInstance={graph}
                                    style={{width:"100%",height:"100%"}}    
                                    useHook={true}
                                    />
                <div className="temporal_current_date">
                    {
                        currentDate !== undefined && currentDate
                    }
                </div>
            </div>
        );
    }
    return null;
}

export default TemporalGraphAnimation;