import { useEffect, useState, useCallback } from "react";

const ChartRangeOptions = ({options, setOption, updateChart}) => {

    const [chartOptions, setChartOptions] = useState([]);
    const [, updateState] = useState();
    const forceUpdate = useCallback(() => updateState({}), []);
    const [first, setFirst] = useState(true);
    
    const clickRange = (index) => {
        let i = 0;
        const newOptions = chartOptions.map(option =>{
            if (i === index){
                let x = i;
                i++;
                return (
                    <p  onClick={() => {
                                updateChart(option.props.children)
                                clickRange(x)
                            }
                        } 
                        style={{background: "linear-gradient(#fd3e3b 0%, #fb6634 100%)"}}
                        >
                        {option.props.children}
                    </p>
                );
            }
            else {
                let x = i;
                i++;
                return(
                    <p  onClick={() => {
                                updateChart(option.props.children)
                                clickRange(x)
                            }
                        } >
                        {option.props.children}
                    </p>
                )
            }
        })
        setChartOptions(newOptions);
    }

    useEffect(() => {
        if(first && chartOptions.length > 0){
            let i = 0;
            let _chartOptions = []
            options.forEach(element => {
                let x = i;
                if(i === 0){
                    _chartOptions.push(<p   onClick={() => {
                                                    updateChart(element);
                                                    clickRange(x);
                                                }
                                            } 
                                            style={{background: "linear-gradient(#fd3e3b 0%, #fb6634 100%)"}}
                                            >
                                            {element}
                                        </p>
                                        )
                    
                }else{
                    _chartOptions.push(
                                        <p  onClick={() => {
                                                updateChart(element);
                                                clickRange(x);
                                            }
                                        } >
                                            {element}
                                        </p>
                                        )
                }
                i++;
            });
            setChartOptions(_chartOptions);
            setFirst(!first);
        }
    },[chartOptions])

    useEffect(() => {
        let i = 0;
        let _chartOptions = []
        options.forEach(element => {
            let x = i;
            if(i === 0){
                _chartOptions.push(<p   onClick={() => clickRange(x)} 
                                        style={{background: "linear-gradient(#fd3e3b 0%, #fb6634 100%)"}}
                                        >
                                        {element}
                                    </p>
                                    )
                
            }else{
                _chartOptions.push(
                                    <p  onClick={() => clickRange(x)}>
                                        {element}
                                    </p>
                                    )
            }
            i++;
        });
        setChartOptions(_chartOptions);
    }, [])

    return (
        <div    onMouseEnter={(e) => {
                    e.target.style.opacity = 1;
                }} 
                onMouseLeave={(e) => {
                    e.target.style.opacity = 0.1;
                }} 
                className="chart_options">
            {chartOptions}
        </div>
    );
}

export default ChartRangeOptions;