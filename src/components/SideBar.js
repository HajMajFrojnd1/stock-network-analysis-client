import Information from "./Information";

const SideBar = (props) =>{

    return (

        <div className="right-side">
            <Information title="Stock Information">
                <div className="information">
                    <span>Company</span><p>{props.stockInformation.name}</p>
                </div>
                <div className="information">
                    <span>Ticker</span><p>{props.stockInformation.ticker}</p>
                </div>
                <div className="information">
                    <span>Industry</span><p>{props.stockInformation.industry}</p>
                </div>
                <div className="information">
                    <span>Sector</span><p>{props.stockInformation.sector}</p>
                </div>
            </Information>
            <Information title="Node Information">
            </Information>
        </div>

    );

}

export default SideBar;