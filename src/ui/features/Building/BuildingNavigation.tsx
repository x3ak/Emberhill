import type {BuildingState} from "@/shared/types/game.types.ts";

export type BuildingSubSection =
    | 'processes'
    | 'progression'
    | 'statistics';

type BuildingNavigationProps = {
    onNavigate: (section: BuildingSubSection) => void,
    currentSection: BuildingSubSection,
    buildingState: BuildingState,
}

export default function BuildingNavigation({onNavigate, currentSection, buildingState}: BuildingNavigationProps) {
    return (
        <ul className='nav-list row-nav'>
            <li onClick={() => onNavigate('processes')} className={`nav-item ${ currentSection === 'processes' ? 'active' : ''}`}>🔨 Tasks</li>
            <li onClick={() => onNavigate('progression')} className={`nav-item ${ currentSection === 'progression' ? 'active' : ''}`}>↑ Upgrade {buildingState.canLevelUp ? '🔴': ''}</li>
            <li onClick={() => onNavigate('statistics')} className={`nav-item ${ currentSection === 'statistics' ? 'active' : ''}`}>📊 Statistics</li>
        </ul>
    )
}