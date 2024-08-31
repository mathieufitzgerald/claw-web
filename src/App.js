import React, { useState } from 'react';
import ClawMachineCard from './components/ClawMachineCard';
import ControlPanel from './components/ControlPanel';
import './styles.css';

function App() {
    const [selectedMachine, setSelectedMachine] = useState(null);

    const machines = [
        { id: 'machine1', name: "Mat's Claw Machine", status: 'online', queue: 0 },
        { id: 'machine2', name: 'Machine 2', status: 'offline', queue: 0 },
        { id: 'machine3', name: 'Machine 3', status: 'offline', queue: 0 },
        { id: 'machine4', name: 'Machine 4', status: 'offline', queue: 0 },
        { id: 'machine5', name: 'Machine 5', status: 'offline', queue: 0 },
        { id: 'machine6', name: 'Machine 6', status: 'offline', queue: 0 }
    ];

    const handleMachineClick = (machine) => {
        if (machine.status === 'online') {
            setSelectedMachine(machine);
        } else {
            alert('This machine is currently offline.');
        }
    };

    return (
        <div className="container">
            {!selectedMachine ? (
                <>
                    <h1>Claw Machine Arcade</h1>
                    <div className="machine-grid">
                        {machines.map(machine => (
                            <ClawMachineCard 
                                key={machine.id} 
                                machine={machine} 
                                onClick={() => handleMachineClick(machine)} 
                            />
                        ))}
                    </div>
                </>
            ) : (
                <ControlPanel 
                    machine={selectedMachine} 
                    onBack={() => setSelectedMachine(null)} 
                />
            )}
        </div>
    );
}

export default App;
