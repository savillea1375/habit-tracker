import { useLocalSearchParams } from "expo-router";
import { StyleSheet, Text, View } from "react-native";

const Task = () => {
    const { id } = useLocalSearchParams();

    return (
        <View style={styles.mainContainer}>
            <Text style={styles.taskId}>{id}</Text>
        </View>
    );
};

const styles = StyleSheet.create({
    mainContainer: {
        paddingTop: 100,
    },
    taskId: {
        color: "black",
    },
});

export default Task;
