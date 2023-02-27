
const FilterWrapper = ({children,title,style}) =>{

    return(

        <div className="fwrap">
            <span>{title}</span>
            <div style={style} className="fwrap-child">
                {children}
            </div>
        </div>

    );

}


export default FilterWrapper;