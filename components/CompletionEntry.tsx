import { useThemeColor } from "@/hooks/useThemeColor";
import { format } from "date-fns";
import React from "react";
import { StyleSheet, Text, TouchableOpacity, useColorScheme, View } from "react-native";
import Swipeable from "react-native-gesture-handler/ReanimatedSwipeable";

const CONTAINER_HEIGHT = 64;

export default function CompletionEntry({ completion }: { completion: any }) {
    const themeFontColor = useThemeColor({}, "text");
    const themeBackgroundColor = useColorScheme() === "dark" ? "#000" : "#fff";
    const themeBorderColor = useColorScheme() === "dark" ? "#333" : "#ddd";

    const formattedDate = format(completion.completed_date, "MMMM do, yyyy");

    const handleDelete = async () => {
        return null;
    };

    const renderRightActions = () => {
        return (
            <TouchableOpacity style={styles.deleteButton} onPress={handleDelete}>
                <Text style={styles.deleteText}>Delete</Text>
            </TouchableOpacity>
        );
    };

    return (
        <Swipeable
            renderRightActions={renderRightActions}
            rightThreshold={CONTAINER_HEIGHT / 2}
            overshootRight={false}
        >
            <View
                style={[
                    styles.mainContainer,
                    { backgroundColor: themeBackgroundColor, borderColor: themeBorderColor },
                ]}
            >
                <Text style={[{ color: themeFontColor }]}>{formattedDate}</Text>
            </View>
        </Swipeable>
    );
}

const styles = StyleSheet.create({
    mainContainer: {
        flexDirection: "row",
        justifyContent: "space-between",
        alignItems: "center",
        paddingVertical: 12,
        paddingHorizontal: 8,
        borderRadius: 12,
        borderWidth: 1,
        height: CONTAINER_HEIGHT,
    },
    deleteButton: {
        backgroundColor: "#FF6B6B",
        justifyContent: "center",
        alignItems: "flex-end",
        paddingHorizontal: 20,
        borderRadius: 12,
        height: CONTAINER_HEIGHT,
    },

    deleteText: {
        color: "white",
        fontWeight: "600",
        fontSize: 16,
    },
});
