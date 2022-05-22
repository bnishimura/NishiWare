import React, { useState } from 'react';
import { useSpring, animated } from '@react-spring/web';
import useMeasure from 'react-use-measure';
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';

import './tag_filter.css';
import Tags from './tags';

function ballparkTagListLen(tagList) {
    // assuming letters are square and --font-sx == 12px
    const SIZE = 12;
    return SIZE * tagList.reduce( (p, c) => { 
        return p + c.length;
        }, 0);
    // this is correct
}

function getExpandedHeight(tagList, barWidth) {
    if (typeof barWidth !== "undefined") {
        let fullLen = ballparkTagListLen(tagList);
        const EXTRA_WIDTH = 25;
        let res = 28;
        while (fullLen > barWidth) {
            res += EXTRA_WIDTH;
            fullLen /= 2;
        }
        return String(res) + 'px';
    }
    return '0';
}

export default function TagFilter(props) {
    // it should probably change depending on the number of tags
    const tagList = props.homeInfo.tags;

    const [expanded, toggle] = useState(false);
    const [ref, { width }] = useMeasure();
    let expanded_height = getExpandedHeight(tagList, width);
    const AnimatedIcon = animated(ExpandMoreIcon);
    const iconProp = useSpring({ rotateZ: expanded ? 180 : 0 });
    const expandableProp = useSpring({ height: expanded ? expanded_height : `0` });
    const tagProp = useSpring({ borderWidth: expanded ? `1px` : `0px`,
                                fontSize: expanded ? `var(--font-sx)` : `0px`,
                                margin: `1px 3px 2px 0`,
    });

    const handleClick = () => toggle(!expanded);
    const clickTag = (tag) => { 
        const index = props.homeInfo.filters.current.indexOf(tag);
        if (index === -1)
            props.homeInfo.filters.current.push(tag);
        else
            props.homeInfo.filters.current.splice(index, 1);
        props.homeInfo.setCount(props.homeInfo.stateCount+1);
    }

    return (
        <div className='tag-filter'>
            <div className='toggle-bar' onClick={handleClick} ref={ref}>
                <AnimatedIcon className='expand-icon' 
                style={iconProp}
                onClick={handleClick}/>
            </div>

            <animated.div className='expandable-bar' 
            style={expandableProp}>
                {tagList.map((tag, index) => {
                    return (
                    <Tags key={index} prefix="animated" clickTag={clickTag} state={tagProp}>{tag}</Tags>
                    )
                })}
            </animated.div>
        </div>
    )
};
