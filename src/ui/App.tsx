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

    }, 2000);
}

browserLoop();

type Section = string;

export default function App() {
    const [activeSection, setActiveSection] = useState<Section>('home');

    return (
        <div className="min-h-screen flex flex-col bg-zinc-900 text-gray-100 font-sans">
            <ResourceBar/>

            <div className="flex flex-6">
                <div className="flex flex-1"></div>
                {/* Sidebar */}
                <aside className="w-64 bg-zinc-800 p-4 border-r border-zinc-700 flex-1">
                    <Sidebar onSelect={setActiveSection}/>
                </aside>

                {/* Main Section */}
                <main className=" p-6 overflow-auto flex-3">
                    {activeSection === 'home' && (
                        <div className="text-center text-lg">Welcome! Select something from the sidebar.</div>
                    )}
                    <div className='fixed bottom-4 right-4 z-50 '>
                        <Warmstone/>

                    </div>
                    {activeSection === 'woodcutter' && <Building buildingId='woodcutter' processId='cut_tree_oak'/>}
                    {activeSection === 'campfire' && <Building buildingId='campfire' processId='burn_log_oak'/>}
                </main>
                <div className="flex flex-1"></div>
            </div>
        </div>
    );

}