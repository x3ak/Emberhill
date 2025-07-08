import styles from "@/features/Building/Building.module.css";

export type BuildingSubSection =
    | 'processes'
    | 'progression'
    | 'statistics';

export default function BuildingNavigation({onNavigate, currentSection}: {onNavigate: (section: BuildingSubSection) => void, currentSection: BuildingSubSection}) {
    return (
        <ul className={styles.buildingNavigation}>
            <li onClick={() => onNavigate('processes')} className={ currentSection === 'processes' ? styles.active : ''}>🔨 Tasks</li>
            <li onClick={() => onNavigate('progression')} className={ currentSection === 'progression' ? styles.active : ''}>↑ Upgrade</li>
            <li onClick={() => onNavigate('statistics')} className={ currentSection === 'statistics' ? styles.active : ''}>📊 Statistics</li>
        </ul>
    )
}