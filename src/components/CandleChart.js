import { ChartCanvas, Chart } from "react-stockcharts";
import {CandlestickSeries} from "react-stockcharts/lib/series";
import { XAxis, YAxis } from "react-stockcharts/lib/axes";
import { fitDimensions } from "react-stockcharts/lib/helper";
import React from "react";
import PropTypes from "prop-types";

class CandleChart extends React.Component {
    
    render() {

        const { type, data, width, height } = this.props;

        return(
            <ChartCanvas    seriesName="SPX"
                            width={width}
                            height={height}
                            ratio={2}
                            type={"hybrid"}
                            data={data.data}
                            xScale={data.xScale}
                            xAccessor={data.xAccessor}
                            displayXAccessor={data.displayXAccessor}
                            xExtents={data.xExtents}>
                <Chart id={1} yExtents={d => [d.high, d.low]}>
                    <XAxis axisAt="bottom" orient="bottom" ticks={6} />
                    <YAxis axisAt="left" orient="left" ticks={5} />
                    <CandlestickSeries />
                </Chart>
            </ChartCanvas>
        );
    }
}

CandleChart.propTypes = {
    data: PropTypes.array.isRequired,
    width: PropTypes.number.isRequired,
    height: PropTypes.number.isRequired,
    type: PropTypes.oneOf(["svg", "hybrid"]).isRequired
  };
  
CandleChart.defaultProps = {
    type: "hybrid"
};

CandleChart = fitDimensions(CandleChart);

export default CandleChart;