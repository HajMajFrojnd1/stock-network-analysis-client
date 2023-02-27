
const Button = (props) => {

    return (

        <div style={{display:"flex", justifyContent:"center"}}>
                <button className={props.class} 
                        onClick={e => {props.onClick();}}>
                {props.class === "special-button" && 
                    <img alt="" src={props.image}></img>
                }
                {(props.class === "main-button" || props.class === "secondary-button") && 
                    props.text
                }    
                </button>
        </div>

    );

}

export default Button;