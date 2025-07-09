type PopupProps = {
    x: number;
    y: number;
    children: React.ReactNode;
    onClose: () => void;
}

import styles from './Popup.module.css'

export default function Popup({ x, y, children, onClose }: PopupProps) {

    const top = y + window.scrollY;
    const left = x + window.scrollX;

    return (
        <div className={styles.popup} style={{ top: top, left: left }}>
            <div className="popup-body">{children}</div>
            <div className="popup-footer" onClick={onClose}>[close]</div>
        </div>
    )
}