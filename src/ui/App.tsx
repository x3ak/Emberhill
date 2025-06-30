import {game} from '../core/engine';
import ResourceBar from './ResourceBar';
import Building from './Building';
import {useState} from 'react';

import Warmstone from './Warmstone.tsx';
import Sidebar from './Sidebar.tsx';

function browserLoop() {
    let last = performance.now();

    setInterval(() => {
        const now = performance.now();
        const deltaTime = (now - last) / 1000;
        last = now;

        game.dispatch({type: 'TICK', payload: {deltaTime}})

    }, 200);
}

browserLoop();

type Section = string;

export default function App() {
    const [activeSection, setActiveSection] = useState<Section>('home');

    function saveState() {

        const gameState = game.getState();

        localStorage.setItem('GAME_STATE', JSON.stringify({
            'resources': gameState.resources,
            'warmstone': gameState.warmstone,
            'buildings': Array.from(gameState.buildings.entries()),
        }));
    }

    function loadState() {
        let retriever = (key: any, value: any) => {
            if (key == 'buildings') {
                return new Map(value)
            }

            return value;
        }

        let loadedState = JSON.parse(localStorage.getItem('GAME_STATE') || '{}', retriever);
        game.setState(loadedState);
    }

    return (
        <div className="min-h-screen flex flex-col bg-zinc-900 text-gray-100 font-sans">
            <ResourceBar/>

            <div className="flex flex-6">
                <div className="flex flex-1"></div>
                {/* Sidebar */}
                <aside className="w-64 bg-zinc-800 p-4 border-r border-zinc-700 flex-1">
                    <Sidebar onSelect={setActiveSection} activeSection={activeSection} />
                </aside>

                {/* Main Section */}
                <main className=" p-6 overflow-auto flex-3">
                    {activeSection === 'home' && (
                        <div className="text-center text-lg">Welcome! Select something from the sidebar.</div>
                    )}
                    <div className='fixed bottom-4 right-4 z-50 flex flex-col gap-2 items-end'>
                        <Warmstone/>
                        <div className="flex gap-2">
                            <button title="Save" onClick={saveState} className="bg-green-500 hover:bg-green-600 text-white font-bold p-3 rounded shadow-lg transition-transform transform hover:scale-110">
                                💾
                            </button>
                            <button title="Load" onClick={loadState} className="bg-amber-500 hover:bg-amber-600 text-white font-bold p-3 rounded shadow-lg transition-transform transform hover:scale-110">
                                📂
                            </button>
                        </div>
                    </div>
                    {activeSection !== 'home' && <Building buildingId={activeSection as any}/>}
                </main>
                
                <div className="flex flex-1"></div>
            </div>
        </div>
    );

}