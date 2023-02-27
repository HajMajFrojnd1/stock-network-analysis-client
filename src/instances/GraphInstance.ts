import Graph from "graphology";
import {setGraphLouvain} from "../scripts/graphUtilityFunctions";
import louvain, {DetailedLouvainOutput} from "graphology-communities-louvain";
import { getRandomColor, stringToColour, scaleRange } from "../scripts/utilityFunctions";

type MyDetailedLouvainOutput = DetailedLouvainOutput & {colors: string[]};

type Obj = {[k: string]: any};

class GraphInstance {

    private graph: Graph;
    private louvainDetails: MyDetailedLouvainOutput;
    private sectorColors: Obj = {};
    private startGraph: Graph;

    constructor(graph: Graph){
        this.graph = graph;
        this.calculateLouvain();
        this.graphSectors();
        this.startGraph = graph.copy();
    }

    private graphSectors(): void {

        this.graph.forEachNode((node, attributes) => {
            if(!(attributes.sector in this.sectorColors)){
                this.sectorColors[attributes.sector] = stringToColour(attributes.sector);
            }
        })

    }

    public calculateLouvain(): void {
        louvain.assign(this.graph, {
            getEdgeWeight: "weight",
            randomWalk: true
        });

        this.louvainDetails = {...louvain.detailed(this.graph), colors: []};
        this.calculateLouvainColors();

    }

    private calculateLouvainColors(): void {

        if(this.louvainDetails !== undefined){
            this.louvainDetails.colors = []
            for(let i = 0; i< this.louvainDetails.count; i++){
                this.louvainDetails.colors.push(getRandomColor(i+1, this.louvainDetails.count))
            }
        }

    }

    public getLouvainGraph(): Graph{

        let graph: Graph = this.graph.copy();

        graph.forEachNode(node => {
  
            graph.setNodeAttribute(
                node, 
                "color", 
                this.louvainDetails.colors[this.graph.getNodeAttribute(node, "community")]
            );

      
        });


        return graph;
    }

    public getSectorGraph(): Graph{

        let graph: Graph = this.graph.copy();

        graph.forEachNode(node => {
  
            graph.setNodeAttribute(
                node, 
                "color", 
                stringToColour(this.graph.getNodeAttribute(node, "sector"))
            );

      
        });


        return graph;
    }

    public getGraph(): Graph{
        return this.graph;
    }

    public updatePositions(graph: Graph): void{
        try{
            this.graph.mapNodes((node,attributes) =>{
                let other = graph.getNodeAttributes(node);
                attributes.x = other.x;
                attributes.y = other.y;
            })
        }catch{

        }
    }

    public getLouvainColors() : string[]{
        return this.louvainDetails.colors;
    }

    public getSectorColors() : Obj{
        return this.sectorColors;
    }

    public setSectorColor(sector: string, color : string) : void {
        this.sectorColors[sector] = color;
    }

    public setLouvainColor(color : string, index: number): void{
        if(index >= this.louvainDetails.colors.length || index < 0){
            return;
        }
        this.louvainDetails.colors[index] = color;
    }

    public setGraph(graph: Graph): void{
        this.graph = graph;
        this.calculateLouvain();
        this.graphSectors();
        this.startGraph = graph.copy();
    }

    public reduceGraphEdgesWeight(weight:number): void {

        let edges: String[] = this.graph.filterEdges(edge => {return this.graph.getEdgeAttribute(edge, "weight") < weight})

        edges.forEach(edge => {
            this.graph.dropEdge(edge);
        })

        this.calculateSizes();

    }

    public reduceGraphNodesDegree(degree: number): void {

        let nodes: String[] = this.graph.filterNodes(node => {return this.graph.degree(node) < degree})

        nodes.forEach(node => {
            this.graph.dropNode(node);
        })

    }

    public reduceGraphEdgesWeightOpposite(weight:number): void {

        let edges: String[] = this.graph.filterEdges(edge => {return this.graph.getEdgeAttribute(edge, "weight") > weight})

        edges.forEach(edge => {
            this.graph.dropEdge(edge);
        })

        this.calculateSizes();

    }

    public reduceGraphNodesDegreeOpposite(degree: number): void {

        let nodes: String[] = this.graph.filterNodes(node => {return this.graph.degree(node) > degree})

        nodes.forEach(node => {
            this.graph.dropNode(node);
        })

    }

    public resetGraph(): void {
        this.graph = this.startGraph.copy();
    }

    private calculateSizes():void {
        let min = 1; 
        let max = 1;
        this.graph.forEachNode(node => {

            let degree = this.graph.degree(node);
            if(degree > max) {
              max = degree;
            }
    
            if(degree === 0){
              this.graph.dropNode(node);
            }
  
          });
    
          this.graph.mapNodes((node,attributes) => {
            attributes.size = Math.pow(scaleRange(this.graph.degree(node), 2, 4, min, max),2);
          });
    }

    public getNodes(): Array<String>{
        return this.graph.nodes();
    }

    public getDegreeSum(): number{
        return this.graph.nodes().map((node) => this.graph.degree(node)).reduce((sum, degree) => sum + degree);
    }

}

export {GraphInstance};