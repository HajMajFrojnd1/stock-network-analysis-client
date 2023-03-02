import { ResponsiveContainer, LineChart, Line, CartesianGrid, XAxis, YAxis, Tooltip,Legend } from 'recharts';
import ChartRangeOptions from './ChartOptions';
import { chartOptions } from '../settings/graphFilters';
import ChartStats from './ChartStats';

const PortfolioChart = ({data, dataTwo, updateChart, solo = false, range}) => {

    

    if(!solo){
        return (
            <div style={{width: "100%", height: "100%", display: "flex", flexFlow: "column"}}>
                <div style={{width: "100%",display: "flex", marginBottom: "1rem"}}>
                    <ChartStats title={"SPX Performance" + " " + range}
                                data={data}
                                dataKey="SPX Change"
                                />
                    <ChartStats title={"Custom Portfolio Performance" + " " + range}
                                data={dataTwo}
                                dataKey="Custom Graph Change" 
                                />
                </div>
                <div style={{display: "flex", height: "calc(60% - 1rem)", position: "relative", width: "100%", boxSizing: "border-box"}}>
                    <div className='p_chart'>
                        <div className='chart'>
                            <ResponsiveContainer>
                                <LineChart  data={data}>
                                    <defs>
                                        <linearGradient id="colorUv" x1="0%" y1="0%" x2="0%" y2="100%">
                                        <stop offset="0%" stopColor="green" />
                                        <stop offset="100%" stopColor="red" />
                                        </linearGradient>
                                    </defs>
                                    <Line   type="monotone" 
                                            dataKey="SPX Change" 
                                            stroke="url(#colorUv)" 
                                            strokeWidth={2}
                                            />
                                    <CartesianGrid stroke="#ccc" />
                                    <XAxis dataKey="name" />
                                    <YAxis />
                                    <Tooltip/>
                                    <Legend verticalAlign="top" height={36}/>
                                </LineChart>
                            </ResponsiveContainer>
                            
                        </div>
                    </div>
                    <div className='p_chart'>
                        <div className='chart'>
                            <ResponsiveContainer>
                                <LineChart  data={dataTwo}>
                                    <Line   type="monotone" 
                                            dataKey="Custom Graph Change" 
                                            stroke="url(#colorUv)" 
                                            strokeWidth={2}
                                            />
                                    <CartesianGrid stroke="#ccc" />
                                    <XAxis dataKey="name" />
                                    <YAxis />
                                    <Tooltip/>
                                    <Legend verticalAlign="top" height={36}/>
                                </LineChart>
                            </ResponsiveContainer>
                        </div>                    
                    </div>
                    <ChartRangeOptions  options={chartOptions}
                                        updateChart={updateChart}
                                        />
                </div>
            </div>
        );
    }

    return (

        <div className='p_chart'>
            <div className='chart'>
                <ResponsiveContainer>
                    <LineChart  data={data}>
                            <defs>
                                <linearGradient id="colorUv" x1="0%" y1="0%" x2="0%" y2="100%">
                                <stop offset="0%" stopColor="green" />
                                <stop offset="100%" stopColor="red" />
                                </linearGradient>
                            </defs>
                        <Line   type="monotone" 
                                dataKey="change" 
                                stroke="url(#colorUv)" 
                                strokeWidth={2}
                                />
                        <CartesianGrid stroke="#ccc" />
                        <XAxis dataKey="name" />
                        <YAxis />
                        <Tooltip/>
                        <Legend verticalAlign="top" height={36}/>
                    </LineChart>
                </ResponsiveContainer>
            </div>
            <ChartRangeOptions  options={chartOptions}
                                updateChart={updateChart}
                                />
        </div>

    );

}

export default PortfolioChart;