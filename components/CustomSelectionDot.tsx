import { Circle, Group, Shadow } from "@shopify/react-native-skia";
import React, { useCallback } from "react";
import { useColorScheme } from "react-native";
import type { SelectionDotProps } from "react-native-graph";
import {
    runOnJS,
    useAnimatedReaction,
    useDerivedValue,
    useSharedValue,
    withSpring,
} from "react-native-reanimated";

export const CIRCLE_RADIUS = 5;
export const CIRCLE_RADIUS_MULTIPLIER = 6;

export function CustomSelectionDot({
    isActive,
    color,
    circleX,
    circleY,
}: SelectionDotProps): React.ReactElement {
    const circleRadius = useSharedValue(0);
    const circleStrokeRadius = useDerivedValue(
        () => circleRadius.value * CIRCLE_RADIUS_MULTIPLIER,
        [circleRadius]
    );

    const circleColor = useColorScheme() === "dark" ? "#AAAAAA" : "#333333";
    const shadowColor = useColorScheme() === "dark" ? "rgba(255,255,255,0.3)" : "rgba(0,0,0,0.5)";

    const setIsActive = useCallback(
        (active: boolean) => {
            circleRadius.value = withSpring(active ? CIRCLE_RADIUS : 0, {
                mass: 1,
                stiffness: 1000,
                damping: 50,
                velocity: 0,
            });
        },
        [circleRadius]
    );

    useAnimatedReaction(
        () => isActive.value,
        (active) => {
            runOnJS(setIsActive)(active);
        },
        [isActive, setIsActive]
    );

    return (
        <Group>
            <Circle
                opacity={0.05}
                cx={circleX}
                cy={circleY}
                r={circleStrokeRadius}
                color={circleColor}
            />
            <Circle cx={circleX} cy={circleY} r={circleRadius} color={color}>
                <Shadow dx={0} dy={0} color={shadowColor} blur={4} />
            </Circle>
        </Group>
    );
}
