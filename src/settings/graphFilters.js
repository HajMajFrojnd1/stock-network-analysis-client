const types = [
    "day", 
    "month", 
    "year",
    "historical"
];
const aggr = {
    "day": {min: 1, max: 30},
    "month": {min: 1, max: 6}, 
    "year": {min: 1, max: 3},
    "historical": {min: 1, max:1}
};

const chartOptions = [
    "1Month",
    "3Month",
    "6Month",
    "1Year",
    "3Year",
    "All",
    "GraphPeriod"
]

module.exports.aggr = aggr;
module.exports.types = types;
module.exports.chartOptions = chartOptions;