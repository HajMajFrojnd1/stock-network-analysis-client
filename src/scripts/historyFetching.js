
class HistoryFetch {

    static fetchAllBetween = async (start,end) => {

        return await (
          await fetch(
            "http://164.90.189.8:8081/hostorical/" + start + "/" + end
          )
        ).json();
    
    }

    static fetchSpx = async (start,end) => {

        return await (
            await fetch(
              "http://164.90.189.8:8081/spx/" + start + "/" + end
            )
          ).json();

    }

    static fetchPortfolioData = async (range,tickers, from = null, to = null) => {
      const requestOptions = {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ tickers: tickers, range:range, from: from, to: to})
      };
      console.log(requestOptions);
      return await (
        await fetch(
          "http://164.90.189.8:8081/portfolio/data",
          requestOptions
        )
      ).json();
    };

    static fetchSpxCandlesticks = async () => {
      return await (
        await fetch(
          "http://164.90.189.8:8081/spx/candlesticks"
        )
      ).json();
    }

}

export default HistoryFetch;