import React, { useState, useEffect } from 'react';

function Timer({ initialTime }) {
    const [timeLeft, setTimeLeft] = useState(initialTime);

    useEffect(() => {
        const timer = setInterval(() => {
            setTimeLeft(prev => prev - 1);
        }, 1000);

        if (timeLeft <= 0) {
            clearInterval(timer);
        }

        return () => clearInterval(timer);
    }, [timeLeft]);

    return (
        <div id="timer">
            <p>Time Left: <span>{timeLeft}</span>s</p>
        </div>
    );
}

export default Timer;
