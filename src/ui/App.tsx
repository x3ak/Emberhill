import {useState} from 'react';

import {game} from '../core/engine';
import BuildingsList from '@/features/BuildingsList/BuildingsList.tsx';
import type {BuildingId} from "@/shared/types/building.types.ts";
import MainContentArea, {type MainContentSection} from "@/features/MainContentArea/MainContentArea.tsx";
import TownFeatureList from "@/features/TownFeatureList/TownFeatureList.tsx";

let timeSpeed: number = 10;

function browserLoop() {
    let last = performance.now();

    setInterval(() => {
        const now = performance.now();
        const deltaTime = (now - last) / 1000 * timeSpeed;
        last = now;

        game.dispatch({type: 'TICK', payload: {deltaTime}})

    }, 800);
}

browserLoop();

export default function App() {
    const [activeSection, setActiveSection] = useState<MainContentSection>({type: 'page', pageId: 'home'});

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

    function setActiveBuilding(buildingId: BuildingId) {
        setActiveSection({type: 'building', buildingId: buildingId});
    }

    return (
        <div className="game-layout">
            <nav className="sidebar-nav">
                <div className="section-heading">Town features</div>
                <TownFeatureList setActiveSection={setActiveSection} activeSection={activeSection} />
                <div className="section-heading">Buildings</div>
                <BuildingsList onSelect={setActiveBuilding} activeSection={activeSection} />
                <div className="section-heading">Misc</div>
                <div >
                    <div>
                        <button title="Save" onClick={saveState}> 💾 </button>
                        <button title="Load" onClick={loadState}> 📂 </button>
                    </div>
                </div>
            </nav>


            <main className="main-content-area">
                <MainContentArea activeSection={activeSection} />
            </main>
        </div>
    );

}