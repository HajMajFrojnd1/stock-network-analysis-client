import Information from "./Information";

const SideBar = ({stockInformation, graphsData}) =>{

    return (

        <div className="right-side">
            <Information title="Stock Information">
                <div className="information">
                    <span>Company</span><p>{stockInformation.name}</p>
                </div>
                <div className="information">
                    <span>Ticker</span><p>{stockInformation.ticker}</p>
                </div>
                <div className="information">
                    <span>Industry</span><p>{stockInformation.industry}</p>
                </div>
                <div className="information">
                    <span>Sector</span><p>{stockInformation.sector}</p>
                </div>
            </Information>
            {("nodes" in graphsData) &&
                <Information title="Node Information">
                    <div className="information">
                        <span>Nodes</span><p>{graphsData.nodes.length}</p>
                    </div>
                    <div className="information">
                        <span>Edges</span><p>{graphsData.edges.length}</p>
                    </div>
                </Information>
            }
        </div>

    );

}

export default SideBar;