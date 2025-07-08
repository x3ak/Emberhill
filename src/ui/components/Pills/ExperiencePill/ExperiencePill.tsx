import styles from './ExperiencePill.module.css';
import xpIcon from '../../../../assets/icons/xp_icon.png'

export default function ExperiencePill({amount}: {amount: number}) {
    return (
        <span className={styles.pill}>
            <img
                src={xpIcon}
                alt="XP"
                title="Experience"
                className={styles.icon} // Apply the .icon class
            />
            <span>x {amount}</span>
        </span>
    )
}