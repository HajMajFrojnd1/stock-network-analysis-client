
const Information = (props) =>{

    return(

        <div className="container">
            {typeof props.title === "string" && <p>{props.title}</p>}
            {props.children}
        </div>

    );

}

export default Information;