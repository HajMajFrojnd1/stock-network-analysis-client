import { useState } from "react";
import { useEffect } from "react";
import { useCallback } from "react";
import "@react-sigma/core/lib/react-sigma.min.css";
import { stringToColour, scaleRange, getRandomColor } from "../scripts/utilityFunctions";
import {UndirectedGraph} from "graphology";
import ForceAtlasGraph from "./ForceAtlasGraph";
import MySigmaController from "./MySigmaController";
import ComplexListener from "../scripts/ComplexListener";
import { GraphInstance } from "../instances/GraphInstance.ts";
import HistoryFetch from "../scripts/historyFetching";
import { Stocks } from "../instances/StockHistory.ts";

const genericGraphStyle = {
  border: "4px solid #0A0A0A",
  boxSizing: "border-box",
  position: "relative"
}

const graphStyleDoubleTop = {
  width:"100%",
  height:"50%",
  ...genericGraphStyle
}

const graphStyleDoubleNext = {
  width:"50%",
  height:"100%",
  ...genericGraphStyle
}

const graphStyleQuad = {
  width:"50%",
  height:"50%",
  ...genericGraphStyle
}

const graphStyleSingle = {
  width:"100%",
  height:"100%",
  ...genericGraphStyle
}

 const DisplayGraph = (props) => {

    const [mainGraph, setMainGraph] = useState(new GraphInstance(new UndirectedGraph()));
    const [, updateState] = useState();
    const forceUpdate = useCallback(() => updateState({}), []);

    const controllerListener = new ComplexListener();

    const updateSigma = (data,graph) => {
      if("nodes" in data){

        graph.clear();
        graph.clearEdges();

        /*graph.setAttribute("from", props.currentDate[0]);
        graph.setAttribute("to", props.currentDate[1]);*/

        data.nodes.forEach(element => {
          graph.addNode(element.id, {
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
            element.source,
            element.target,
            {
              weight: element.weight
            }
            );
            
          });
  
        let max = 1;
        let min = 1;
  
        graph.forEachNode(node => {
          let degree = graph.degree(node);
          if(degree > max) {
            max = degree;
          }
  
          if(degree === 0){
            graph.dropNode(node);
          }

        });
  
        graph.mapNodes((node,attributes) => {
          attributes.size = Math.pow(scaleRange(graph.degree(node), 2, 4, min, max),2);
          attributes.color = stringToColour(String(attributes.sector));
        });

        mainGraph.setGraph(graph);
        props.setInstance(mainGraph);

        forceUpdate();
      }
      
  
    }
  
    useEffect(() => {
      if(props.graphInstance === null){
        const graph = mainGraph.getGraph();
        updateSigma(props.graphsData,graph);
      }else{
        mainGraph.setGraph(props.graphInstance.getGraph());
        props.setInstance(props.graphInstance);
        forceUpdate();
      }

    }, [props.graphsData]);


    if(props.layout === "double_sideways" && mainGraph.getGraph().nodes().length > 0){
      return (
        <div className="graph-wrap">
        
          <ForceAtlasGraph  graphInstance={mainGraph} 
                            coloring={"louvain"} 
                            style={graphStyleDoubleNext}
                            functions={{setStockInformation: props.setStockInformation}}
                            listener={controllerListener}
                            />
          <ForceAtlasGraph  graphInstance={mainGraph} 
                            style={graphStyleDoubleNext} 
                            functions={{setStockInformation: props.setStockInformation}}
                            listener={controllerListener}
                            />
  
          <MySigmaController listener={controllerListener}/>
  
        </div>
  
        );
    }

    if(props.layout === "double_upper" && mainGraph.getGraph().nodes().length > 0){
      return (
        <div className="graph-wrap">
        
          <ForceAtlasGraph  graphInstance={mainGraph} 
                            coloring={"louvain"} 
                            style={graphStyleDoubleTop}
                            functions={{setStockInformation: props.setStockInformation}}
                            listener={controllerListener}
                            />
          <ForceAtlasGraph  graphInstance={mainGraph} 
                            style={graphStyleDoubleTop} 
                            functions={{setStockInformation: props.setStockInformation}}
                            listener={controllerListener}
                            />
  
          <MySigmaController listener={controllerListener}/>
  
        </div>
  
        );
    }

    if(props.layout === "triple" && mainGraph.getGraph().nodes().length > 0){
      return (
        <div className="graph-wrap">
        
          <ForceAtlasGraph  graphInstance={mainGraph} 
                            style={graphStyleQuad}
                            functions={{setStockInformation: props.setStockInformation}}
                            listener={controllerListener}
                            />
          <ForceAtlasGraph  graphInstance={mainGraph} 
                            style={graphStyleQuad} 
                            functions={{setStockInformation: props.setStockInformation}}
                            listener={controllerListener}
                            />
          <ForceAtlasGraph  graphInstance={mainGraph} 
                            style={graphStyleDoubleTop} 
                            functions={{setStockInformation: props.setStockInformation}}
                            listener={controllerListener}
                            />
          
  
          <MySigmaController listener={controllerListener}/>
  
        </div>
  
        );
    }

    if(props.layout === "quad" && mainGraph.getGraph().nodes().length > 0){
      return (
        <div className="graph-wrap">
        
          <ForceAtlasGraph  graphInstance={mainGraph} 
                            style={graphStyleQuad}
                            functions={{setStockInformation: props.setStockInformation}}
                            listener={controllerListener}
                            />
          <ForceAtlasGraph  graphInstance={mainGraph} 
                            style={graphStyleQuad} 
                            functions={{setStockInformation: props.setStockInformation}}
                            listener={controllerListener}
                            />
          <ForceAtlasGraph  graphInstance={mainGraph} 
                            style={graphStyleQuad} 
                            functions={{setStockInformation: props.setStockInformation}}
                            listener={controllerListener}
                            />
          <ForceAtlasGraph  graphInstance={mainGraph} 
                            style={graphStyleQuad}
                            functions={{setStockInformation: props.setStockInformation}}
                            listener={controllerListener}
                            />
  
          <MySigmaController listener={controllerListener}/>
  
        </div>
  
        );
    }

    return (
      <div className="graph-wrap">
        { mainGraph.getGraph().nodes().length > 0 &&
        <ForceAtlasGraph  graphInstance={mainGraph} 
                          style={graphStyleSingle}
                          functions={{setStockInformation: props.setStockInformation}}
                          listener={controllerListener}
                          />
        }

        <MySigmaController listener={controllerListener}/>
        
      </div>

      );
    };
    //<LayoutNoverlapControl settings={noverlapSettings}/>

export default DisplayGraph;