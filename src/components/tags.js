import React, { useState } from "react";
import { animated } from "@react-spring/web";
import "./tags.css";


// receives a tags array as children returns inlined tags
const Tags = (props) => {
    const [active, toggle] = useState(false);
    return (
            <animated.div 
            key={props.children + props.prefix} 
            className="tags" 
            onClick={props.clickTag ? (e) => { 
                props.clickTag(e.target.innerText);
                toggle(!active);
            } : null}
            style={props.state ?
            active ? {...props.state, borderColor: "gold"} :
                     {...props.state, borderColor: "rgb(41, 41, 41)"}
            : null }
            >
                {props.children}
            </animated.div>
    )
}



export default Tags;
