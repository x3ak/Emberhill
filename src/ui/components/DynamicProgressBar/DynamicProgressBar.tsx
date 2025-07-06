// src/components/DynamicProgressBar.tsx
import {useEffect, useRef, useState} from 'react';

import styles from "./DynamicProgressBar.module.css";
import {clamp} from "@/shared/Utils.ts";
import {SIMULATION_SPEED} from "@/shared/Globals.ts";

type ProgressBarProps = {
    totalDuration: number;
    elapsedTime: number;
    playing: boolean;
    height?: string;
}

export default function DynamicProgressBar({
                                        totalDuration,
                                        elapsedTime,
                                        playing,
                                        height = '8px',
                                    }: ProgressBarProps) {
    const [visualPercentage, setVisualPercentage] = useState(0);

    // Clamp the percentage between 0 and 100 to prevent overflow
    const animationFrameId = useRef<number>(0);
    const animationStartTimeRef = useRef<number>(performance.now());

    useEffect(() => {

        animationStartTimeRef.current = performance.now();
        setVisualPercentage(elapsedTime / totalDuration * 100);

        const animate = () => {
            if (playing) {
                const timeSinceAnimationStart = ((performance.now() - animationStartTimeRef.current) / 1000) * SIMULATION_SPEED; // in seconds

                const totalElapsedTime = elapsedTime + timeSinceAnimationStart;

                setVisualPercentage(totalElapsedTime / totalDuration * 100);
            }


            animationFrameId.current = requestAnimationFrame(animate);
        }

        animationFrameId.current = requestAnimationFrame(animate);

        return () => {
            if (animationFrameId.current) {
                cancelAnimationFrame(animationFrameId.current);
            }
        }
    }, [elapsedTime, totalDuration, playing])

    const percentage = clamp(visualPercentage, 0, 100)

    let progressBarClassName = `${styles.progressBar} ${playing ? '' : styles.inactive }`;

    return (
        <div
            className={styles.container}
            role="progressbar"
            style={{height: height}}
        >
            <div
                className={progressBarClassName}
                style={{width: percentage.toString().concat("%")}}
            />
        </div>
    );
};