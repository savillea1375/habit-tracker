import ChevronRight from "@/components/ChevronRight";
import { Text } from "@react-navigation/elements";
import { useRouter } from "expo-router";
import { useState } from "react";
import { FlatList, SafeAreaView, StyleSheet, TouchableOpacity, View } from "react-native";

const mockTasks = [
    { id: "1", title: "exercise" },
    { id: "2", title: "Meditate" },
    { id: "3", title: "Read" },
];

type Task = {
    id: string;
    title: string;
};

const Home = () => {
    const [tasks, setTasks] = useState(mockTasks);
    const router = useRouter();

    const renderTask = ({ item }: { item: Task }) => {
        return (
            <TouchableOpacity
                style={styles.task}
                onPress={() =>
                    router.push({
                        pathname: "/task/[id]",
                        params: { id: item.id },
                    })
                }
            >
                <View style={styles.taskTextWrapper}>
                    <Text style={styles.taskText}>{item.title}</Text>
                    <ChevronRight size={24} color="#CCC" />
                </View>
            </TouchableOpacity>
        );
    };

    return (
        <SafeAreaView style={styles.mainContainer}>
            <FlatList
                data={tasks}
                keyExtractor={(item) => item.id}
                renderItem={renderTask}
                contentContainerStyle={{ paddingBottom: 80 }}
            />
            <TouchableOpacity
                style={styles.addButton}
                onPress={() => {
                    // TODO add task to DB
                    console.log("Added");
                }}
            >
                <Text style={styles.addButtonText}>+</Text>
            </TouchableOpacity>
            {/*<Button onPress={signOut}>Sign out</Button>*/}
        </SafeAreaView>
    );
};

const styles = StyleSheet.create({
    mainContainer: {
        height: "100%",
        width: "100%",
        justifyContent: "center",
        alignContent: "center",
    },
    task: {
        backgroundColor: "#E6F0FA",
        padding: 18,
        borderRadius: 12,
        marginBottom: 8,
    },
    taskText: {
        fontSize: 16,
        fontWeight: "500",
    },
    chevron: {
        fontSize: 24,
        color: "#999",
    },
    taskTextWrapper: {
        flexDirection: "row",
        justifyContent: "space-between",
        alignItems: "center",
    },
    addButton: {
        position: "absolute",
        bottom: 30,
        right: 30,
        backgroundColor: "#ACCAEB",
        width: 60,
        height: 60,
        borderRadius: 30,
        alignItems: "center",
        justifyContent: "center",
        shadowColor: "#000",
        shadowOpacity: 0.2,
        shadowRadius: 4,
        elevation: 2,
    },
    addButtonText: {
        color: "#fff",
        fontSize: 36,
        lineHeight: 36,
        textAlign: "center",
    },
});

export default Home;
