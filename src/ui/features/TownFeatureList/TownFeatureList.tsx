import type {MainContentSection} from "@/features/MainContentArea/MainContentArea.tsx";

export default function TownFeatureList({setActiveSection, activeSection}: {setActiveSection: any, activeSection : MainContentSection}) {
    const townFeatureList = ['storage', 'warmstone'].map(townFeatureId => {
        const sectionClassName = `nav-item ${activeSection.type == 'town_feature' && activeSection.feature == townFeatureId ? 'active' : ''}`

        return (
            <li key={townFeatureId} className={sectionClassName} onClick={() => {setActiveSection({type: 'town_feature', feature: townFeatureId})}}>{townFeatureId}</li>
        )
    })

    return (
        <ul className="nav-list">
            {townFeatureList}
        </ul>

    )
}