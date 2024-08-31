import React, { useEffect, useRef, useState } from 'react';

// BroadcastBoxStream Component for HLS stream
const BroadcastBoxStream = ({ streamKey, whepUrl }) => {
    const videoRef = useRef(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        let peerConnection = new RTCPeerConnection();
        peerConnection.addTransceiver('audio', { direction: 'recvonly' });
        peerConnection.addTransceiver('video', { direction: 'recvonly' });

        peerConnection.ontrack = function (event) {
            if (event.track.kind === 'video') {
                const el = videoRef.current;
                el.srcObject = event.streams[0];
                el.autoplay = true;
                el.muted = true;

                // Add an event listener to detect when the video is actually loaded
                el.onloadeddata = () => {
                    setLoading(false); // Hide loading animation when stream starts
                };
            }
        };

        peerConnection.createOffer().then(offer => {
            peerConnection.setLocalDescription(offer);

            fetch(whepUrl, {
                method: 'POST',
                body: offer.sdp,
                headers: {
                    Authorization: `Bearer ${streamKey}`,
                    'Content-Type': 'application/sdp'
                }
            }).then(response => response.text())
              .then(answer => {
                  peerConnection.setRemoteDescription({
                      sdp: answer,
                      type: 'answer'
                  });
              })
              .catch(error => {
                  console.error('Error setting remote description:', error);
                  setLoading(false); // Hide loading animation on error
              });
        });

        return () => {
            peerConnection.close();
        };
    }, [streamKey, whepUrl]);

    return (
        <div className="stream-container">
            {loading && <div className="loading-animation">Loading...</div>}
            <video 
                ref={videoRef} 
                className="video" 
                style={{ display: loading ? 'none' : 'block' }} 
                controls={false} 
            />
        </div>
    );
};

// Main ControlPanel Component
const ControlPanel = () => {
    const streamKey = 'mat';
    const whepUrl = 'http://10.27.10.221:8080/api/whep';
    const [timer, setTimer] = useState(45);
    const [timerActive, setTimerActive] = useState(false);
    const [playButtonText, setPlayButtonText] = useState('Play');
    const [controlsDisabled, setControlsDisabled] = useState(true);

    const sendCommand = (command) => {
        fetch(`http://10.27.10.221:4000/${command}`) // Send command to local Node.js server
            .then(response => response.text())
            .then(data => console.log(data))
            .catch(error => console.error('Error sending command:', error));
    };

    const handleButtonPress = (command) => {
        if (!controlsDisabled) {
            sendCommand(`start-${command}`);
            if (!timerActive) {
                setTimerActive(true);
            }
        }
    };

    const handleButtonRelease = (command) => {
        if (!controlsDisabled) {
            sendCommand(`stop-${command}`);
        }
    };

    const handlePlayButtonClick = () => {
        if (playButtonText === 'Play') {
            setControlsDisabled(false);
            setPlayButtonText('Drop');
        } else {
            setControlsDisabled(true);
            setPlayButtonText('Dropping...');
            sendCommand('drop');
            setTimerActive(false);

            setTimeout(() => {
                setPlayButtonText('Play');
                setTimer(45);
            }, 5000);
        }
    };

    const handleKeyDown = (event) => {
        if (!controlsDisabled) {
            switch (event.key) {
                case 'ArrowUp':
                    handleButtonPress('fwd');
                    break;
                case 'ArrowDown':
                    handleButtonPress('back');
                    break;
                case 'ArrowLeft':
                    handleButtonPress('left');
                    break;
                case 'ArrowRight':
                    handleButtonPress('right');
                    break;
                case ' ':
                    if (playButtonText === 'Drop') {
                        handlePlayButtonClick(); // Handle drop
                    }
                    break;
                default:
                    break;
            }
        }
    };

    const handleKeyUp = (event) => {
        if (!controlsDisabled) {
            switch (event.key) {
                case 'ArrowUp':
                    handleButtonRelease('fwd');
                    break;
                case 'ArrowDown':
                    handleButtonRelease('back');
                    break;
                case 'ArrowLeft':
                    handleButtonRelease('left');
                    break;
                case 'ArrowRight':
                    handleButtonRelease('right');
                    break;
                default:
                    break;
            }
        }
    };

    useEffect(() => {
        window.addEventListener('keydown', handleKeyDown);
        window.addEventListener('keyup', handleKeyUp);

        return () => {
            window.removeEventListener('keydown', handleKeyDown);
            window.removeEventListener('keyup', handleKeyUp);
        };
    }, [controlsDisabled, playButtonText]); // Dependency array to ensure event listeners are updated

    useEffect(() => {
        if (timerActive && timer > 0) {
            const countdown = setInterval(() => {
                setTimer(prevTimer => prevTimer - 1);
            }, 1000);
            return () => clearInterval(countdown);
        }
    }, [timerActive, timer]);

    return (
        <div className="container">
            <BroadcastBoxStream streamKey={streamKey} whepUrl={whepUrl} />

            <div className="control-panel-container">
                <div className="timer">{timer > 0 ? `Time Remaining: ${timer} Sec` : 'Time Up!'}</div>

                <div className="joystick-controls">
                    <button onMouseDown={() => handleButtonPress('fwd')} onMouseUp={() => handleButtonRelease('fwd')} className="joystick-button">▲</button>
                    <div className="horizontal-buttons">
                        <button onMouseDown={() => handleButtonPress('left')} onMouseUp={() => handleButtonRelease('left')} className="joystick-button">◀</button>
                        <button onMouseDown={() => handleButtonPress('right')} onMouseUp={() => handleButtonRelease('right')} className="joystick-button">▶</button>
                    </div>
                    <button onMouseDown={() => handleButtonPress('back')} onMouseUp={() => handleButtonRelease('back')} className="joystick-button">▼</button>
                </div>

                <button onClick={handlePlayButtonClick} className="play-button">{playButtonText}</button>
            </div>
        </div>
    );
};

export default ControlPanel;
