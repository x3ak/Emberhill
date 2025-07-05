import {useEffect, useState} from 'react';

import BuildingsList from '@/features/BuildingsList/BuildingsList.tsx';
import type {BuildingId} from "@/shared/types/building.types.ts";
import MainContentArea, {type MainContentSection} from "@/features/MainContentArea/MainContentArea.tsx";
import TownFeatureList from "@/features/TownFeatureList/TownFeatureList.tsx";
import {uiStateManager} from "./UIStateManager.ts";

function LoadingScreen() {
    return (
        <div>The warmstone awakens ...</div>
    )
}

export default function App() {
    const [activeSection, setActiveSection] = useState<MainContentSection>({type: 'page', pageId: 'home'});

    const [isGameReady, setGameReady] = useState(false);

    useEffect(() => {
        const handleGameReady = () => {
            console.log("Game state received, UI is now ready");
            setGameReady(true);
        }

        const unsubscribe = uiStateManager.onReady(handleGameReady);

        uiStateManager.initialize();

        return () => { unsubscribe() };

    }, []);

    function setActiveBuilding(buildingId: BuildingId) {
        setActiveSection({type: 'building', buildingId: buildingId});
    }

    if (!isGameReady) {
        return <LoadingScreen />;
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