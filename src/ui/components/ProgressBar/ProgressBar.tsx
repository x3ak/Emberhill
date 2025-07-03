// src/components/ProgressBar.tsx
import {useEffect, useRef, useState} from 'react';

import styles from "./ProgressBar.module.css";
import {SIMULATION_SPEED} from "../../../hooks/useGame.ts";

type ProgressBarProps = {
    totalDuration: number;
    elapsedTime: number;
    playing: boolean;
}

function clamp(number: number, min: number, max: number): number {
    return Math.min(Math.max(number, min), max);
}

export default function ProgressBar({
                                        totalDuration,
                                        elapsedTime,
                                        playing,
                                    }: ProgressBarProps) {
    const [visualPercentage, setVisualPercentage] = useState(0);

    // Clamp the percentage between 0 and 100 to prevent overflow
    const animationFrameId = useRef<number>(0);
    const animationStartTimeRef = useRef<number>(performance.now());

    useEffect(() => {
        animationStartTimeRef.current = performance.now();
        const animate = () => {
            if (playing) {
                const timeSinceAnimationStart = (performance.now() - animationStartTimeRef.current) / 1000; // in seconds

                const totalElapsedTime = elapsedTime + timeSinceAnimationStart * SIMULATION_SPEED;

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

    return (
        <div
            className={styles.container}
            role="progressbar"
        >
            <div
                className={styles.progressBar}
                style={{width: percentage.toString().concat("%")}}
            />
        </div>
    );
};