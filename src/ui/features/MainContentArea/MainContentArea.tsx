import TownStorage from "@/features/TownStorage/TownStorage.tsx";
import Warmstone from "@/features/Warmstone/Warmstone.tsx";
import Building from "@/features/Building/Building.tsx";
import type {BuildingId} from "@/shared/types/building.types.ts";


export type MainContentSection =
    | { type: 'building'; buildingId: BuildingId;}
    | { type: 'page'; pageId: 'home' }
    | { type: 'town_feature'; feature: 'storage' | 'warmstone' }

const townFeatureMap = {
    storage: TownStorage,
    warmstone: Warmstone,
}

export default function MainContentArea({activeSection} : {activeSection : MainContentSection}) {
    switch (activeSection.type) {
        case "building":
            return (
                <Building buildingId={activeSection.buildingId} />
            );
        case "town_feature":
            const ComponentToRender = townFeatureMap[activeSection.feature];
            return (<ComponentToRender />)
        case "page":
            return (<div>Page id: {activeSection.pageId}</div>)
        default:
            return (<div>not found section </div>)
    }
}