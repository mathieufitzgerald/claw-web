import React from 'react';

function ClawMachineCard({ machine, onClick }) {
    return (
        <div className="machine-box" onClick={onClick}>
            <img src={`machine.jpg`} alt={machine.name} />
            <h2>{machine.name}</h2>
            <p>Status: <span className={`status ${machine.status}`}>{machine.status === 'online' ? 'Online' : 'Offline'}</span></p>
            <p>Queue: <span>{machine.queue}</span> players</p>
        </div>
    );
}

export default ClawMachineCard;
