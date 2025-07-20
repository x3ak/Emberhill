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

        return (
            <span><span className={amount.actual < amount.total ? styles.warn : ''}>{amount.actual}</span> / {amount.total}</span>
        );
    }

    return (<div className={styles.tile}>
        <img src={icon} alt={iconAlt} title={iconAlt}/>
        <div className={styles.spacer}></div>
        <div className={styles.textContainer}>
            <span className={styles.amountText}>{renderAmountText()}</span>
        </div>
    </div>)
}