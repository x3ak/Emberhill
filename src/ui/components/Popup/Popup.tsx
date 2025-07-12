import styles from './Popup.module.css'
import {useRef} from "react";
import {useOnClickOutside} from "@/hooks/useOnClickOutside.ts";

type PopupProps = {
    children: React.ReactNode;
    onClose: () => void;
    openerRef?: React.RefObject<HTMLElement | null>;
}

export default function Popup({ children, onClose, openerRef }: PopupProps) {
    const popupRef = useRef<HTMLDivElement>(null);

    useOnClickOutside(popupRef, (event) => {
        if (openerRef?.current && openerRef.current.contains(event.target as Node)) {
            // ignore click on opener
            return;
        }

        onClose();
    })

    let top = window.scrollY;
    let left = window.scrollX;

    if (openerRef) {
        const rect = openerRef.current?.getBoundingClientRect();

        if (rect) {
            top += rect.bottom;
            top += 8;
            left += rect.left;
        }
    }

    return (
        <div ref={popupRef} className={styles.popup} style={{ top: top, left: left }}>
            <div className="popup-body">{children}</div>
        </div>
    )
}