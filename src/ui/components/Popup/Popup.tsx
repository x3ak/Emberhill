import styles from './Popup.module.css'
import closeIcon from '@/icons/close.png'

type PopupProps = {
    x: number;
    y: number;
    children: React.ReactNode;
    onClose: () => void;
}

export default function Popup({ x, y, children, onClose }: PopupProps) {

    const top = y + window.scrollY;
    const left = x + window.scrollX;

    return (
        <div className={styles.popup} style={{ top: top, left: left }}>
            <div className={styles.closeIcon}><img src={closeIcon} alt="close" title="close" onClick={onClose} width="24"/></div>
            <div className="popup-body">{children}</div>
        </div>
    )
}