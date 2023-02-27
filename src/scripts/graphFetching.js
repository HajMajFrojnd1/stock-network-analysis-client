
class GraphFetch {


    static fetchNoData = async (aggregate,type) => {

        return await (
          await fetch(
            "http://127.0.0.1:8081/graphs/simple/" + 
                aggregate + 
                "/" + type
          )
        ).json();
    

    }

    static fetchNoDataSimilarity = async (aggregate,type,similarity) => {
        console.log(similarity);
        return await (
          await fetch(
            "http://127.0.0.1:8081/graphs/simple/" + 
                aggregate + 
                "/" + type + 
                "/" + similarity
          )
        ).json();
    

    }

    static fetchGraphId = async (id) =>{

        return await (
          await fetch(
            "http://127.0.0.1:8081/graphs/" + 
                id
          )
        ).json()

    }

    static fetchSimTypes = async () => {
        return await (
            await fetch("http://127.0.0.1:8081/graphs/types/sim_types")
        ).json()
    }

    static fetchTemporaryGraphs = async (type, sim_type, start, end) => {
        return await (
            await fetch("http://127.0.0.1:8081/temporary/graphs/" +
                type + 
                "/" + sim_type +
                "/" + start +
                "/" + end)
        ).json()
    
    }

}

export default GraphFetch;
