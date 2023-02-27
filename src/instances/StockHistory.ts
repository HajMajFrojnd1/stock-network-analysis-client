
type Obj = {[k: string]: any};

class HistoricalPrice {

    date: Date;
    open: number;
    high: number;
    low: number;
    close: number;
    weight: number;

    constructor(date: string, open: number, high: number, low:number, close: number, weight: number) {

        this.date = new Date(date.split("T")[0]);
        this.open = open;
        this.high = high;
        this.low = low;
        this.close = close;
        this.weight = weight;

    }
    public getChange(): number{
        return (this.open - this.close) / this.close * 100;
    }

    public getOpen(): number{
        return this.open;
    }

    public getClose(): number{
        return this.close;
    }

    public getWeight(): number{
        return this.weight;
    }

}

class StockHistory {

    ticker: string;
    data: HistoricalPrice[];

    constructor(ticker: string, data: object[]){
        this.ticker = ticker;
        this.data = data.map((price) => {
            return new HistoricalPrice( price["date"],
                                        price["open"], 
                                        price["high"], 
                                        price["low"], 
                                        price["close"],
                                        price["weight"]);
        })
    }

    public getChange(): number{
        let last = this.data[this.data.length - 1];
        return (this.data[0].open - last.close) / last.close * 100;
    }

    public getAverageChange(): number{

        let sumValues = this.data.map((prices)=> {
            return prices.getChange();
        }).reduce((accumulator, currentValue) => accumulator + currentValue,0);
        return sumValues /this.data.length;
    }

    public getBetweenDatesChanges(weighted = false): Array<number>{

        let values: Array<number> = []
        values.push(0);
        for(let i = 0; i < this.data.length-1; i++){
            if(weighted)
                values.push(this.change(this.data[0].getOpen(), this.data[i].getClose())*this.data[i].getWeight());
            else
                values.push(this.change(this.data[0].getOpen(), this.data[i].getClose()));
        }   

        return values;
    }

    private change(open: number, close: number): number{
        return (close - open) / open * 100;
    }

}

class Stocks{

    stocks: StockHistory[] = [];

    constructor(data: Obj){
        let key: string;
        for(key in data){
            this.stocks.push(new StockHistory(key,data[key]));
        }
    }


    public static fromFetchedData(data: object[]): Stocks{
        let sorted = {};
        data.forEach((prices) => {
            let ticker = prices["ticker"];
            delete prices["ticker"]
            if(!(ticker in sorted)){
                sorted[ticker] = [];
            }
            sorted[ticker].push(prices);
        })

        return new Stocks(sorted);
    }

    public getChanges(weighted = false): Array<Array<number>> {
        return this.stocks.map((stock) => {
            return stock.getBetweenDatesChanges(weighted);
        });
    }

    public getDegreeWeightedChanges(): Array<number> {
        return this.getChanges(true).reduce((accumulator, currentValue) => accumulator.map((value, idx) => value + currentValue[idx]));
    }

    public getAverageChanges(): Array<number> {
        return this.getChanges().reduce((accumulator, currentValue) => accumulator.map((value, idx) => value + currentValue[idx])).map((value) => value/this.stocks.length);
    }

}

export {Stocks};