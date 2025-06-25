import {game} from '../core/engine';
import ResourceBar from './ResourceBar';
import Building from './Building';

import Warmstone from './Warmstone.tsx';

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

    // const processesList =

    return (
        <div className="bg-zinc-900 text-gray-200 font-sans min-h-screen flex flex-col">
            <ResourceBar/>

            <main className="flex-grow p-5 flex flex-col items-center gap-10">
                <div className="flex justify-center gap-5">

                    <Building buildingId='woodcutter'/>
                    <Building buildingId='quarry'/>
                    <Building buildingId='campfire'/>
                    <Warmstone />

                </div>


            </main>

        </div>
    )

}
