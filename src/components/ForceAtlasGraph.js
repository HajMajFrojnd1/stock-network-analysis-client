import React, { useEffect, useState } from "react";
import { SigmaContainer, useSigma, useLoadGraph } from "@react-sigma/core";
import { useWorkerLayoutForceAtlas2 } from "@react-sigma/layout-forceatlas2";

import GraphSettingsController from "./GraphSettingsController";

const ForceAtlasGraph = ({graphInstance, style, listener, functions, useHook = false}) => {

    const settings ={   settings: {
                            gravity: 5,
                            edgeWeightInfluence: 1,
                            linLogMode: true
                        } 
                    }

    const [coloring, setColoring] = useState("Louvain");

    const FA2Worker = ({listener, updateMainGraph}) => {
        const { start, stop, kill, isRunning } = useWorkerLayoutForceAtlas2(settings);
        const sigma = useSigma();

        useEffect(() => {
            listener.addListener(start,"start");
            listener.addListener(stop,"stop");
        return () => {
            listener.removeListener(start,"start");
            listener.removeListener(stop,"stop");
                graphInstance.updatePositions(sigma.getGraph());
            kill();
        };
        }, [start,stop,kill]);

        useEffect(() =>{
            if(!isRunning){
                if(updateMainGraph){
                    updateMainGraph();
                }
            }
        }, [isRunning]);

        return null;
    }

    const FA2Graph = ({graphInstance, functions}) => {

        const sigma = useSigma();

        
        const loadGraph = useLoadGraph();

        useEffect(() => {
            if(coloring === "Sector"){
                sigma.setGraph(graphInstance.getSectorGraph());
                loadGraph(graphInstance.getSectorGraph());
            }
            else if (coloring === "Louvain"){
                sigma.setGraph(graphInstance.getLouvainGraph());
                loadGraph(graphInstance.getLouvainGraph());
            }
            else if (coloring === "Betweenness"){
                sigma.setGraph(graphInstance.getBetweennessGraph());
                loadGraph(graphInstance.getBetweennessGraph());
            }
            else if (coloring === "Degree"){
                sigma.setGraph(graphInstance.getDegreeGraph());
                loadGraph(graphInstance.getDegreeGraph());
            }
            else if (coloring === "Closeness"){
                sigma.setGraph(graphInstance.getClosenessGraph());
                loadGraph(graphInstance.getClosenessGraph());
            }
        },[coloring])

        useEffect(() => {

        }, [graphInstance]);

        useEffect(() => {


        }, []);

        const fetchCompany = async (func, node) => {
            const data = await (
              await fetch(
                "http://127.0.0.1:8081/company/"+node
              )
            ).json().then( result => {
                func(result);
              }
            );
          }

        useEffect(() => {
            let graph = sigma.getGraph();
            sigma.on("clickNode", ({node}) => {
                fetchCompany(functions.setStockInformation, graph.getNodeAttribute(node, "label"));
            });
    
            sigma.on("enterNode", ({node}) => {
                let nodes_no_Edge = graph.nodes().filter(n => !graph.neighbors(node).includes(n))
                nodes_no_Edge.push(node);
                nodes_no_Edge.forEach(n => {
                    graph.setNodeAttribute(n, "color", graph.getNodeAttribute(n, "color") + "5F");
                })
                graph.forEachEdge(node, edge => graph.setEdgeAttribute(edge, "color", "#000000"))
            });
    
            sigma.on("leaveNode", ({node}) => {
                let nodes_no_Edge = graph.nodes().filter(n => !graph.neighbors(node).includes(n))
                nodes_no_Edge.push(node);
                nodes_no_Edge.forEach(n => {
                    graph.setNodeAttribute(n, "color", graph.getNodeAttribute(n, "color").substr(0,7));
                })
                graph.forEachEdge(node, edge => graph.setEdgeAttribute(edge, "color", "#CCCCCC"))
            });

            return () => {
                sigma.removeAllListeners();
            }
        },[])

        return null;

    }

    const FA2GraphNoInstance = ({graph}) => {

        const sigma = useSigma();
        const loadGraph = useLoadGraph();

        useEffect(() => {
            
            sigma.setGraph(graph);
            loadGraph(graph);

        },[loadGraph])

        return null;

    }

    if(useHook){
        return(
            <SigmaContainer graph={graphInstance} style={{width: "100%", height: "100%"}}>
                
            </SigmaContainer>
        )
    }

    return (
        <div style={style}>
            <SigmaContainer style={{width: "100%", height: "100%"}}>
                <FA2Graph   graphInstance={graphInstance} 
                            functions={functions}
                            />
                { !useHook && 
                    <FA2Worker  listener={listener}/>
                }
                { useHook 
                    
                }
            </SigmaContainer>
            <GraphSettingsController    graphInstance={graphInstance}
                                        setColoring={setColoring}
                                        colorOption={coloring}
                                        />
        </div>
    );
}


export default ForceAtlasGraph;