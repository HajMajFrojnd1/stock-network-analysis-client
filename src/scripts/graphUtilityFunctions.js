import louvain from "graphology-communities-louvain";
import {getRandomColor} from "../scripts/utilityFunctions";

function setGraphLouvain(graph){
        
    louvain.assign(graph, {
        getEdgeWeight: "weight",
        randomWalk: true
    });
  
    var detailed = louvain.detailed(graph);
        
    let colors = [];
  
    for(let i = 0; i< detailed.count; i++){
        colors.push(getRandomColor(i+1,detailed.count))
    }
    graph.forEachNode(node => {
  
        graph.setNodeAttribute(node, "color", colors[graph.getNodeAttribute(node, "community")]);
  
    });
  
  }

export {setGraphLouvain};