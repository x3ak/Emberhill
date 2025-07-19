import styles from "./IconWithAmount.module.css";

type IconWithAmountProps = {
    icon: string,
    iconAlt: string,
    amount: number | {actual: number, total: number},
};
export default function IconWithAmount({icon, iconAlt, amount}: IconWithAmountProps) {

    const renderAmountText = () => {
        if (typeof amount === 'number') {
            return `${amount}`;
        }

        return `${amount.actual} / ${amount.total}`;
    }

    return (<div className={styles.tile}>
        <img src={icon} alt={iconAlt} title={iconAlt}/>
        <div className={styles.spacer}></div>
        <div className={styles.textContainer}>
            <span>{renderAmountText()}</span>
        </div>
    </div>)
}