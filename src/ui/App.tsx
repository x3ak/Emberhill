import {useState} from 'react';

import BuildingsList from '@/features/BuildingsList/BuildingsList.tsx';
import type {BuildingId} from "@/shared/types/building.types.ts";
import MainContentArea, {type MainContentSection} from "@/features/MainContentArea/MainContentArea.tsx";
import TownFeatureList from "@/features/TownFeatureList/TownFeatureList.tsx";
import {coreAPI} from "../core/core.api.ts";

function browserLoop() {
    setInterval(() => {
        coreAPI.sendTick();

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