import styles from "@/features/Building/Building.module.css";
import type {BuildingState} from "@/shared/types/building.types.ts";

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
        <ul className={styles.buildingNavigation}>
            <li onClick={() => onNavigate('processes')} className={ currentSection === 'processes' ? styles.active : ''}>🔨 Tasks</li>
            <li onClick={() => onNavigate('progression')} className={ currentSection === 'progression' ? styles.active : ''}>↑ Upgrade {buildingState.canLevelUp ? '🔴': ''}</li>
            <li onClick={() => onNavigate('statistics')} className={ currentSection === 'statistics' ? styles.active : ''}>📊 Statistics</li>
        </ul>
    )
}