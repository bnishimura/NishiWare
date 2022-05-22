import React, {useState, useRef, useEffect} from 'react';

function getCSize(innerWidth) {
    function remToPx(rem) {
        return rem * parseFloat(getComputedStyle(document.documentElement).fontSize);
    };
    // this assumes maxWidth will always be 54rem
    // must change this if --size-content changes on layout.css
    const maxWidth = remToPx(54);
    return innerWidth > maxWidth ?
        0.7 * maxWidth :
        0.7 * innerWidth;
}

const SnakeGame = () => {
    // Constants 
    const BLOCK_COUNT = 20; // BLOCK_COUNT squares on both axes
    const FRAME_RATE = 12;
    const [csize, setCSize] = useState(0);
    const scale = useRef(csize/BLOCK_COUNT);
    // game state and references
    const canvas = useRef();
    const callback = useRef();
    const timer = useRef();
    const [isOver, setOver] = useState(true);
    const [isFirstRender, setFirstRender] = useState(true);
    let input = null;

    // Helper functions
    const getInitialVelocity = (head) => {
        return head.x > BLOCK_COUNT/2 ? 
            {x: -1, y: 0} :
            {x: 1, y: 0};
    }

    const randomizePos = () => {
        const x = Math.floor(Math.random()*BLOCK_COUNT);
        const y = Math.floor(Math.random()*BLOCK_COUNT);
        return {x: x, y: y};
    }

    // snake state
    const [head, setHead] = useState(randomizePos());
    const [trail, setTrail] = useState([]);
    const [apple, setApple] = useState(randomizePos());
    const [dir, setDir] = useState(getInitialVelocity(head));
    const [length, setLength] = useState(1);


    const inBoundary = (pos) => {
        if (pos.x >= BLOCK_COUNT ||
            pos.x < 0 ||
            pos.y >= BLOCK_COUNT ||
            pos.y < 0) return false;
        return true;
    }

    // Drawing functions
    function drawFrame() {
        const ctx = canvas.current.getContext("2d");
        drawBackground(ctx);
        drawSnake(ctx, head, trail);
        drawApple(ctx, apple);
    };

    const drawBackground = (ctx) => {
        ctx.fillStyle="black";
        ctx.fillRect(0, 0,
            csize, csize);
        return;
    }

    const drawSnake = (ctx, head, trail) => {
        //const scale = scale.current;
        ctx.fillStyle="green";
        ctx.fillRect(head.x * scale.current,
            head.y * scale.current,
            scale.current,
            scale.current);
        ctx.fillStyle="lime";
        trail.forEach(elem => 
            ctx.fillRect(
                elem.x * scale.current,
                elem.y * scale.current,
                scale.current,
                scale.current)
        );
        return;
    }

    const drawApple = (ctx, apple) => {
        // const scale.current = SCALE.current;
        ctx.fillStyle="red";
        ctx.fillRect(apple.x * scale.current,
            apple.y * scale.current,
            scale.current,
            scale.current);
        return;
    }

    // initial screen
    function showStartingScreen() {
        const ctx = canvas.current.getContext("2d");
        const x = csize / 2;
        const y = csize / 4;
        ctx.fillStyle = 'gray';
        ctx.fillRect(0, 0, csize, csize);
        ctx.textAlign = 'center';
        ctx.fillStyle = 'white';
        ctx.font = '30px Arial';
        ctx.fillText('Snake Game', x, y);
        ctx.fillText('Press any key to start the game', x, 2*y);
        ctx.fillText('use arrow keys or WASD to move', x, 3*y);
    };

    // final screen
    function showEndScreen() {
        const ctx = canvas.current.getContext("2d");
        const x = csize / 2;
        const y = csize / 4;
        ctx.fillStyle = 'gray';
        ctx.fillRect(0, 0, csize, csize);
        ctx.textAlign = 'center';
        ctx.fillStyle = 'white';
        ctx.font = '30px Arial';
        ctx.fillText('Game Over', x, y);
        const lengthText = `You died with a length of: ${length}`
        ctx.fillText(lengthText, x, 2*y);
        ctx.fillText('Press any key to play again', x, 3*y);
    };

    // main game
    function setInitialState() {
        const newHead = randomizePos();
        setHead(newHead);
        setTrail([]);
        setApple(randomizePos());
        setDir(getInitialVelocity(newHead));
        setLength(1);
    }

    function isDead() {
        // check if head hits body
        for (let i = 0; i < trail.length; i++) {
            if (trail[i].x === head.x && trail[i].y === head.y)
                return true;
        }
        // check if head in bounds
        if (!inBoundary(head)) return true;
        return false;
    };

    const handleResize = () => {
        if (typeof window !== undefined) {
            const newCSize = getCSize(window.innerWidth);
            setCSize(newCSize);
            scale.current = newCSize/BLOCK_COUNT;
        }
    }

    useEffect(() => {
        // draw the right screens when window size changes
        if (isOver && isFirstRender) {
            // game has not yet started
            showStartingScreen();
        }
        else if (isOver && !isFirstRender) {
            showEndScreen();
        }
    }, [csize]);

    useEffect(() => {
        if (typeof window !== undefined) {
            window.addEventListener('resize', handleResize);
            const newWidth = getCSize(window.innerWidth)
            setCSize(newWidth);
            scale.current = newWidth/BLOCK_COUNT;
        }
        document.getElementById('canvas').focus();
    }, []);

    useEffect(() => {
        callback.current = gameLoop;
    });

    useEffect(() => {
        if (isOver && isFirstRender)
            // game has not yet started
            showStartingScreen();
        else if (!isOver && !isFirstRender) {
            // game has started
            function tick() {
                callback.current();
            }
            timer.current = setInterval(tick, 1000/FRAME_RATE);
        } 
        else if (isOver && !isFirstRender) {
            // game has ended
            clearInterval(timer.current);
        }
    }, [isOver, isFirstRender]);

    function gameLoop() {
        // check border collision and head-trail intersection
        if (isDead()) { 
            setOver(true);
            setInitialState();
            showEndScreen();
            return;
        }

        const newTrail = [...trail];
        let newApple = {...apple};
        const newHead = {
            x: head.x + dir.x,
            y: head.y + dir.y,
        }

        // check apple collision
        if (head.x === apple.x && head.y === apple.y) {
            setLength(length+1);
            const last = trail[trail.length-1];
            newApple = randomizePos();
            while (newApple.x === head.x && newApple.y === head.y)
                // check if collides with trail too?
                newApple = randomizePos();
            newTrail.push(last);
        }

        newTrail.unshift(head);
        newTrail.pop();
        
        setHead(newHead);
        setTrail(newTrail);
        setApple(newApple);
        drawFrame();
    }

    const gameHandler = (e) => {
        // coordinates reference is the canvas
        // so positive y is down and positive x is right
        switch (e.keyCode) {
            case 37:
            case 65:
                input = {x: -1, y: 0};
                break;
            case 38:
            case 87:
                input = {x: 0, y: -1};
                break;
            case 39:
            case 68:
                input = {x: 1, y: 0};
                break;
            case 40:
            case 83:
                input = {x: 0, y: 1};
                break;
            default:
                return;
        };
        // snake can't go the opposite direction
        if (dir.x * input.x >= 0 && dir.y * input.y >= 0)
            setDir(input);
    };

    const startingScreenHandler = () => {
        setFirstRender(false);
        setOver(false);
    }

    return (
        <div 
        onKeyDown={isOver ? 
            startingScreenHandler : 
            (e, dir) => gameHandler(e, dir)}
        onClick={isOver ? 
            (e, dir) => startingScreenHandler : 
            null}
        style = {{
            maxWidth: `var(--size-content)`,
            padding: `0 auto`,
        }}
        >
            <canvas
                tabIndex="0"
                ref={canvas}
                style={{ 
                    maxWidth: `var(--size-content)`,
                }}
                width={csize}
                height={csize}
                id='canvas'
            />
        </div>
    );
};

export default SnakeGame;
