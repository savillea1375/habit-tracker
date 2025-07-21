import { Colors } from "@/constants/Colors";
import { useThemeColor } from "@/hooks/useThemeColor";
import Entypo from "@expo/vector-icons/Entypo";
import { useEffect } from "react";
import { GestureResponderEvent, Pressable, StyleSheet } from "react-native";
import Animated, {
    interpolate,
    useAnimatedStyle,
    useSharedValue,
    withSpring,
} from "react-native-reanimated";

const icon = {
    dashboard: (props: any) => <Entypo name="home" size={24} {...props} />,
    stats: (props: any) => <Entypo name="line-graph" size={24} {...props} />,
};

type RouteName = keyof typeof icon;

export default function TabBarButton({
    onPress,
    onLongPress,
    isFocused,
    routeName,
    label,
}: {
    onPress: (event: GestureResponderEvent) => void;
    onLongPress: (event: GestureResponderEvent) => void;
    isFocused: boolean;
    routeName: RouteName;
    label: string;
}) {
    const textColor = useThemeColor({}, "text");
    const scale = useSharedValue(0);

    useEffect(() => {
        scale.value = withSpring(typeof isFocused === "boolean" ? (isFocused ? 1 : 0) : isFocused, {
            duration: 350,
        });
    }, [scale, isFocused]);

    const animatedIconStyle = useAnimatedStyle(() => {
        const scaleValue = interpolate(scale.value, [0, 1], [1, 1.2]);
        const top = interpolate(scale.value, [0, 1], [0, 9]);

        return {
            transform: [
                {
                    scale: scaleValue,
                },
            ],
            top,
        };
    });

    const animatedTextStyle = useAnimatedStyle(() => {
        const opacity = interpolate(scale.value, [0, 1], [1, 0]);

        return {
            opacity,
        };
    });

    return (
        <Pressable onPress={onPress} onLongPress={onLongPress} style={styles.tabbarItem}>
            <Animated.View style={animatedIconStyle}>
                {icon[routeName]({
                    color: textColor,
                })}
            </Animated.View>
            <Animated.Text
                style={[
                    { color: isFocused ? Colors.primary : textColor, fontSize: 12 },
                    animatedTextStyle,
                ]}
            >
                {label}
            </Animated.Text>
        </Pressable>
    );
}

const styles = StyleSheet.create({
    tabbarItem: {
        flex: 1,
        justifyContent: "center",
        alignItems: "center",
        gap: 5,
    },
});
