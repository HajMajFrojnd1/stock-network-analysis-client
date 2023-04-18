import Graph from "graphology";
import {setGraphLouvain} from "../scripts/graphUtilityFunctions";
import louvain, {DetailedLouvainOutput} from "graphology-communities-louvain";
import { getRandomColor, stringToColour, scaleRange, interpolateHeatColor} from "../scripts/utilityFunctions";
import betweennessCentrality from "graphology-metrics/centrality/betweenness";
import closenessCentrality from "graphology-metrics/centrality/closeness";
import {degreeCentrality} from "graphology-metrics/centrality/degree";

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
        this.calculateCentralities();
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

    private getMinMiddleMaxCentralityValues(centrality:string): number[]{

        let min = 0;
        let max = 0;
        let cent: Obj;

        if(centrality == "betweennessCentrality"){
            cent = this.getBetweennessCentrality();
        }else if(centrality == "closenessCentrality"){
            cent = this.getClosenessCentrality();
        }else{
            cent = this.getDegreeCentrality();
        }

        for (let key in cent){

            if(cent[key] > max){
                max = cent[key];
            }else if(cent[key] < min){
                min = cent[key];
            }

        }

        let middle = min + (max - min)/2;

        return [min, middle, max];
    }

    private setCentralityColor(color:string, graph: Graph):void{
        let [min, middle, max] = this.getMinMiddleMaxCentralityValues(color);
        graph.forEachNode(node => {
            let value = this.graph.getNodeAttribute(node, color);
            graph.setNodeAttribute(
                node, 
                "color", 
                interpolateHeatColor(min,middle,max,value)
            );
        });
    }

    public getBetweennessGraph(): Graph{
        let graph: Graph = this.graph.copy();
        this.setCentralityColor("betweennessCentrality", graph);
        return graph;
    }

    public getClosenessGraph(): Graph{
        let graph: Graph = this.graph.copy();
        this.setCentralityColor("closenessCentrality", graph);
        return graph;
    }

    public getDegreeGraph(): Graph{
        let graph: Graph = this.graph.copy();
        this.setCentralityColor("degreeCentrality", graph);
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
        this.calculateCentralities();
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
        this.calculateCentralities();
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

    public calculateDegreeCentrality(): Obj {
        degreeCentrality.assign(this.graph);
        return this.getAttributes("degreeCentrality");
    }

    public calculateBetweennessCentrality(): Obj {
        betweennessCentrality.assign(this.graph);
        return this.getAttributes("betweennessCentrality");
    }

    public calculateClosenessCentrality(): Obj {
        closenessCentrality.assign(this.graph);
        return this.getAttributes("closenessCentrality");
    }

    public getDegreeCentrality(): Obj{
        return this.getAttributes("degreeCentrality");
    }
    
    public getBetweennessCentrality(): Obj{
        return this.getAttributes("betweennessCentrality");
    }
    
    public getClosenessCentrality(): Obj {
        return this.getAttributes("closenessCentrality");
    }

    private getAttributes(attribute:string): Obj{
        const cent:Obj = {};
        this.graph.forEachNode(node => { cent[this.graph.getNodeAttribute(node, "label")] = this.graph.getNodeAttribute(node, attribute)})
        return cent;
    }

    public hasCalculatedCentralities(): boolean {

        let degree = this.graph.getNodeAttribute("A", "degreeCentrality") != undefined;
        let closeness = this.graph.getNodeAttribute("A", "closenessCentrality") != undefined;
        let betweenness = this.graph.getNodeAttribute("A", "betweennessCentrality") != undefined;

        return degree && closeness && betweenness;
    }

    public async calculateCentralities(): Promise<boolean> {
        this.calculateBetweennessCentrality();
        this.calculateClosenessCentrality();
        this.calculateDegreeCentrality();

        return true;
    }

}

export {GraphInstance};