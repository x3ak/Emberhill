// src/components/ProgressBar.tsx
import {useEffect, useRef, useState} from 'react';

type ProgressBarProps = {
    totalDuration: number;
    elapsedTime: number;
    isActive: boolean;
    color?: string;
    height?: string;
}

function clamp(number: number, min: number, max: number): number {
    return Math.min(Math.max(number, min), max);
}

export default function ProgressBar({
                                        totalDuration,
                                        elapsedTime,
                                        isActive,
                                        color = 'bg-yellow-500',
                                        height = 'h-2'
                                    }: ProgressBarProps) {
    const [visualPercentage, setVisualPercentage] = useState(0);

    // Clamp the percentage between 0 and 100 to prevent overflow
    const animationFrameId = useRef<number>(0);
    const animationStartTimeRef = useRef<number>(performance.now());

    useEffect(() => {
        animationStartTimeRef.current = performance.now();
        const animate = () => {
            if (isActive) {
                const timeSinceAnimationStart = (performance.now() - animationStartTimeRef.current) / 1000; // in seconds

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
    }, [elapsedTime, totalDuration, isActive])

    const percentage = clamp(visualPercentage, 0, 100)

    return (
        <div
            className={`w-full bg-zinc-700 rounded-full overflow-hidden ${height}`}
            role="progressbar"
        >
            <div
                className={`h-full ${color}`}
                style={{width: percentage.toString().concat("%")}}
            />
        </div>
    );
};