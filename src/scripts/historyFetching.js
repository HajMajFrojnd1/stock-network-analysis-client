
class HistoryFetch {

    static fetchAllBetween = async (start,end) => {

        return await (
          await fetch(
            "http://127.0.0.1:8081/hostorical/" + start + "/" + end
          )
        ).json();
    
    }

    static fetchSpx = async (start,end) => {

        return await (
            await fetch(
              "http://127.0.0.1:8081/spx" + start + "/" + end
            )
          ).json();

    }

    static fetchPortfolioData = async (range,tickers, from = null, to = null) => {
      const requestOptions = {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ tickers: tickers, range:range, from: from, to: to})
      };

      return await (
        await fetch(
          "http://127.0.0.1:8081/portfolio/data",
          requestOptions
        )
      ).json();


    };

}

export default HistoryFetch;