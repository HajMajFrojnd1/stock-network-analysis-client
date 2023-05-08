import { BarChart, Bar, XAxis, Tooltip, Legend, YAxis, CartesianGrid, ResponsiveContainer, ComposedChart, Line, Scatter } from 'recharts';
import { useState, useEffect } from 'react';
import regression from "regression"
import Button from './Button';
import { SemipolarLoading } from "react-loadingg";
import graph_bar from "../images/graph-bar.svg"
import linear from "../images/linear.svg"


const histogram = (data, numBins) => {
    // Determine the minimum and maximum values in the data
    var minValue = Math.min.apply(null, data);
    var maxValue = Math.max.apply(null, data);
  
    // Calculate the bin width and create the array of bin edges
    var binWidth = (maxValue - minValue) / numBins;
    var binEdges = [];
    for (var i = 0; i <= numBins; i++) {
      binEdges.push(minValue + i * binWidth);
    }
  
    // Initialize the array of bin counts
    var binCounts = Array(numBins).fill(0);
  
    // Loop over the data and increment the appropriate bin count
    for (var i = 0; i < data.length; i++) {
      var value = data[i];
      var binIndex = Math.floor((value - minValue) / binWidth);
      if (binIndex < 0) {
        // Handle the case where the value is less than the minimum value
        binCounts[0]++;
      } else if (binIndex >= numBins) {
        // Handle the case where the value is greater than or equal to the maximum value
        binCounts[numBins - 1]++;
      } else {
        binCounts[binIndex]++;
      }
    }
    
    return [binEdges.slice(0,-1), binCounts];
}


const DashBoard = ({graphInstance}) => {

    const calc_regression = (type) => {

        let first,second;

        if (type === "db"){
             first = graphInstance.getDegreeCentrality();
             second = graphInstance.getBetweennessCentrality()
        }else if (type === "bc"){
             first = graphInstance.getClosenessCentrality();
             second = graphInstance.getBetweennessCentrality()
        }else{
             first = graphInstance.getDegreeCentrality();
             second = graphInstance.getClosenessCentrality()
        }
    
        const first_data = [];
        const second_data = [];
        const final_data = [];

        for (let key in first){
            first_data.push(first[key]);
            second_data.push(second[key]);
            final_data.push({x: first[key], y: second[key]});
        }
    
        const result = regression.linear(first_data.map((xi ,index) => [xi, second_data[index]]));

        final_data.push({x: Math.min(...first_data), linear: Math.min(...first_data)*result.equation[0] + result.equation[1]});
        final_data.push({x: Math.max(...first_data), linear: Math.max(...first_data)*result.equation[0] + result.equation[1]});

        return final_data;
    
    }
    
    const getGraphData = (data) =>{
    
        const hist_data = [];
        for (let key in data) {
            hist_data.push(data[key]);
        }
    
        const [binEdges, binCounts] = histogram(hist_data, 32);
    
        return binCounts.map((val,index) => {
            return {
                name: String(binEdges[index]).slice(0, 7),
                value: val
            }
        })
    
    } 

    const calculateCentralities = () => {
        setIsLoading(true);
        graphInstance.calculateCentralities().then((val) => {

            setIsLoading(false);
            setHasCentralities(graphInstance.hasCalculatedCentralities());

        })
    }

    const [isLoading , setIsLoading] = useState(false);
    const [hasCentralities, setHasCentralities] = useState(graphInstance.hasCalculatedCentralities());
    const [isRegression, setRegression] = useState(false);

    

    return(
        <div className='dashboard'>
            <div className='dashboard-nav'>
                <Button class="special-quad-button"  
                                image={graph_bar}
                                onClick={
                                    () => setRegression(false)
                                }
                                />
                <Button class="special-quad-button"  
                                image={linear}
                                onClick={
                                    () => setRegression(true)
                                }
                                />
            </div>
            {isRegression &&
            <div className='dashboard-graphs'>
                <div className='dashboard-graph'>
                    <ResponsiveContainer className="graph-wrapper" width="100%" height="100%" >
                        <ComposedChart  data={calc_regression()}
                                        margin={{
                                            top: 50,
                                            right: 30,
                                            left: 20,
                                            bottom: 5,
                                        }}
                                        >
                            <XAxis label={{value: "Degree centrality", position: "insideBottom", offset: -3}} tickFormatter={(tick) => {return tick.toFixed(4)}} dataKey="x" type="number" domain={[dataMin => (dataMin - dataMin * 0.02), dataMax => (dataMax + dataMax * 0.02)]} allowDataOverflow={true}/>
                            <YAxis label={{value: 'Closeness centrality', angle: -90, position: 'insideLeft' }} tickFormatter={(tick) => {return tick.toFixed(4)}} type="number" domain={[dataMin => (dataMin - dataMin * 0.02), dataMax => (dataMax + dataMax * 0.02)]}/>
                            <Scatter name="lol" dataKey="y" fill="#8884d8"/>
                            <Line dataKey="linear" stroke="blue" dot={false}/>
                        </ComposedChart>
                    </ResponsiveContainer>
                </div>
                <div className='dashboard-graph'>
                    <ResponsiveContainer className="graph-wrapper" width="100%" height="100%" >
                        <ComposedChart  data={calc_regression("db")}
                                        margin={{
                                            top: 50,
                                            right: 30,
                                            left: 20,
                                            bottom: 5,
                                        }}
                                        >
                            <XAxis label={{value: "Degree Centrality", position: "insideBottom", offset: -3}} tickFormatter={(tick) => {return tick.toFixed(4)}} domain={[dataMin => (dataMin - dataMin * 0.02), dataMax => (dataMax + dataMax * 0.02)]} dataKey="x" type="number" allowDataOverflow={true}/>
                            <YAxis label={{value: 'Betweenness Centrality', angle: -90, position: 'insideLeft' }} tickFormatter={(tick) => {return tick.toFixed(4)}} type="number" domain={[dataMin => (dataMin - dataMin * 0.02), dataMax => (dataMax + dataMax * 0.02)]}/>
                            <Scatter name="lol" dataKey="y" fill="#8884d8"/>
                            <Line dataKey="linear" stroke="blue" dot={false}/>
                        </ComposedChart>
                    </ResponsiveContainer>
                </div>
                <div className='dashboard-graph'>
                    <ResponsiveContainer className="graph-wrapper" width="100%" height="100%" >
                        <ComposedChart  data={calc_regression("bc")}
                                        margin={{
                                            top: 50,
                                            right: 30,
                                            left: 20,
                                            bottom: 5,
                                        }}
                                        >
                            <XAxis label={{value: "Closeness centrality", position: "insideBottom", offset: -3}} tickFormatter={(tick) => {return tick.toFixed(4)}}  domain={[dataMin => (dataMin - dataMin * 0.01), dataMax => (dataMax + dataMax * 0.01)]} dataKey="x" type="number" allowDataOverflow={true}/>
                            <YAxis label={{value: 'Betweenness Centrality', angle: -90, position: 'insideLeft' }} tickFormatter={(tick) => {return tick.toFixed(4)}} type="number" domain={[dataMin => (dataMin - dataMin * 0.02), dataMax => (dataMax + dataMax * 0.02)]}/>
                            <Scatter name="lol" dataKey="y" fill="#8884d8"/>
                            <Line dataKey="linear" stroke="blue" dot={false}/>
                        </ComposedChart>
                    </ResponsiveContainer>
                </div>
            </div>    
            }
            {!isRegression &&
            <div className='dashboard-graphs'>
                <div className='dashboard-graph'>
                    <h2>Degree Centrality</h2>
                    <ResponsiveContainer width="100%" height="100%">
                        <BarChart
                        width={500}
                        height={300}
                        data={getGraphData(graphInstance.getDegreeCentrality())}
                        margin={{
                            top: 50,
                            right: 30,
                            left: 20,
                            bottom: 5,
                        }}
                        >
                        <CartesianGrid strokeDasharray="3 3" />
                        <XAxis dataKey="name" />
                        <YAxis />
                        <Tooltip />
                        <Legend />
                        <Bar dataKey="value" fill="#8884d8"/>
                        </BarChart>
                    </ResponsiveContainer>
                </div>
                <div className='dashboard-graph'>
                    <h2>Closeness Centrality</h2>
                    <ResponsiveContainer width="100%" height="100%">
                        <BarChart
                        width={500}
                        height={300}
                        data={getGraphData(graphInstance.getClosenessCentrality())}
                        margin={{
                            top: 50,
                            right: 30,
                            left: 20,
                            bottom: 5,
                        }}
                        >
                        <CartesianGrid strokeDasharray="3 3" />
                        <XAxis dataKey="name" />
                        <YAxis />
                        <Tooltip />
                        <Legend />
                        <Bar dataKey="value" fill="#8884d8" />
                        </BarChart>
                    </ResponsiveContainer>
                </div>
                <div className='dashboard-graph'>
                    <h2>Betweenness Centrality</h2>
                    <ResponsiveContainer width="100%" height="100%">
                        <BarChart
                        width={500}
                        height={300}
                        data={getGraphData(graphInstance.getBetweennessCentrality())}
                        margin={{
                            top: 50,
                            right: 30,
                            left: 20,
                            bottom: 5,
                        }}
                        >
                        <CartesianGrid strokeDasharray="3 3" />
                        <XAxis dataKey="name" />
                        <YAxis />
                        <Tooltip />
                        <Legend />
                        <Bar dataKey="value" fill="#8884d8" />
                        </BarChart>
                    </ResponsiveContainer>
                </div>
            </div>
            }
        </div>
    )
}

export default DashBoard;