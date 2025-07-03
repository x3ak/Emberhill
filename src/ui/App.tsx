import {useState} from 'react';

import {game} from '../core/engine';
import BuildingsList from '@/features/BuildingsList/BuildingsList.tsx';
import type {BuildingId} from "@/shared/types/building.types.ts";
import MainContentArea, {type MainContentSection} from "@/features/MainContentArea/MainContentArea.tsx";
import TownFeatureList from "@/features/TownFeatureList/TownFeatureList.tsx";
import {SIMULATION_SPEED} from "../hooks/useGame.ts";

function browserLoop() {
    let last = performance.now();

    setInterval(() => {
        const now = performance.now();
        const deltaTime = (now - last) / 1000 * SIMULATION_SPEED;
        last = now;

        game.dispatch({type: 'TICK', payload: {deltaTime}})

    }, 800);
}

browserLoop();

export default function App() {
    const [activeSection, setActiveSection] = useState<MainContentSection>({type: 'page', pageId: 'home'});

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
            </nav>


            <main className="main-content-area">
                <MainContentArea activeSection={activeSection} />
            </main>
        </div>
    );

}