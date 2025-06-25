import {game} from '../core/engine';
import ResourceBar from './ResourceBar';
import Building from './Building';
import Hearhstone from './Warmstone.tsx';

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

export default function App() {

    return (
        <div className="bg-zinc-900 text-gray-200 font-sans min-h-screen flex flex-col">
            <ResourceBar/>

            <main className="flex-grow p-5 flex flex-col items-center gap-10">
                <div className="flex justify-center gap-5">

                    <Building buildingId='woodcutter'/>
                    <Building buildingId='quarry'/>
                    <Building buildingId='mine'/>
                    <Hearhstone />

                </div>

                <div className="bg-zinc-800 border-2 border-purple-500 rounded-lg p-6 w-72 text-center shadow-xl">
                    <h3 className="text-xl font-bold text-purple-400">The Warmstone (Lvl 2)</h3>
                    <p className="text-sm text-gray-400 mt-2">Next Lvl: 400 Wood, 200 Stone</p>
                    <button
                        className="bg-purple-600 text-white font-bold py-2 px-6 rounded mt-4 w-full disabled:bg-zinc-600 disabled:cursor-not-allowed">
                        Level Up
                    </button>
                </div>

            </main>

        </div>
    )

}
