import {coreAPI} from "@/core/core.api.ts";

import styles from './ResourceAmountDisplay.module.css'
import {useRef, useState} from "react";
import Popup from "@/components/Popup/Popup.tsx";
import {createPortal} from "react-dom";
import {useResourcesState} from "@/hooks/useResourcesState.ts";
import type {ResourceAmount} from "@/shared/types/game.types.ts";

type ResourceAmountDisplayProps = {
    resourceAmount: ResourceAmount,
    showTownAmount?: boolean,
}

export function ResourceAmountDisplay({resourceAmount, showTownAmount}: ResourceAmountDisplayProps) {
    const [isPopupVisible, setIsPopupVisible] = useState<boolean>(false);
    const openerRef = useRef<HTMLElement>(null);

    const resourcesState = useResourcesState();

    const handleClick = () => {
        if (isPopupVisible) {
            setIsPopupVisible(false);
            return;
        }

        const rect = openerRef.current?.getBoundingClientRect();
        if (rect) {
            setIsPopupVisible(true);
        }
    }

    const closePopup = () => setIsPopupVisible(false)

    switch (resourceAmount.type) {
        case "resource":
            const resourceData = coreAPI.getResourceData(resourceAmount.id);

            const inTownAmount: number = resourcesState.resources.get(resourceData.id) || 0;

            return (
                <span>
                    <span className={`${styles.amountNeededPill} ${isPopupVisible ? styles.active : ''}`} ref={openerRef} onClick={handleClick}>
                        {resourceData.icon && (
                            <img
                                src={resourceData.icon}
                                alt={resourceData.name}
                                title={resourceData.name}
                                className={styles.icon}
                            />
                        )}
                        <span>x {resourceAmount.amount}</span>

                        {showTownAmount && (<span>({inTownAmount})</span>)}

                    </span>
                    {isPopupVisible && createPortal(
                        <Popup onClose={closePopup} openerRef={openerRef}>
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