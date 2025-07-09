import type {ResourceAmount} from "@/shared/types/process.types.ts";
import {coreAPI} from "../../../core/core.api.ts";

import styles from './ResourceAmountDisplay.module.css'
import {useRef, useState} from "react";
import Popup from "@/components/Popup/Popup.tsx";
import {createPortal} from "react-dom";
import {useResourcesState} from "@/hooks/useResourcesState.ts";

import foldUpIcon from '@/icons/fold-up.png'

export function ResourceAmountDisplay({resourceAmount}: {resourceAmount: ResourceAmount}) {
    const [popupPos, setPopupPos] = useState<{x: number, y: number}| null>(null);
    const buttonRef = useRef<HTMLButtonElement>(null);

    const resourcesState = useResourcesState();

    const handleClick = () => {
        if (popupPos) {
            setPopupPos(null);
            return;
        }

        const rect = buttonRef.current?.getBoundingClientRect();
        if (rect) {
            setPopupPos({x: rect.left, y: rect.bottom + 8});
        }
    }

    const closePopup = () => setPopupPos(null)

    switch (resourceAmount.type) {
        case "resource":
            const resourceData = coreAPI.getResourceData(resourceAmount.id);

            return (
                <span>
                    <span className={`${styles.amountNeededPill} ${popupPos ? styles.active : ''}`} ref={buttonRef} onClick={handleClick}>
                        {resourceData.icon && (
                            <img
                                src={resourceData.icon}
                                alt={resourceData.name}
                                title={resourceData.name}
                                className={styles.icon}
                            />
                        )}
                        {!popupPos && (<span>x {resourceAmount.amount}</span>)}
                        {popupPos && (<span><img src={foldUpIcon} alt="hide details" width="16px" /></span>)}


                    </span>
                    {popupPos && createPortal(
                        <Popup x={popupPos.x} y={popupPos.y} onClose={closePopup}>
                            <div>
                                <ul>
                                    <li>Required: {resourceAmount.amount}</li>
                                    <li>You have: {resourcesState.resources.get(resourceData.id)}</li>
                                </ul>
                                <h4>{resourceData.name}</h4>
                                <p>{resourceData.description}</p>
                            </div>
                        </Popup>,
                        document.body
                    )}
                </span>

            );
        default:
            return (<span>UNSUPPORTED RESOURCE AMOUNT: {resourceAmount.type}</span>);
    }

}