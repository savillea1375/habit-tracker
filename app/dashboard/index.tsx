import ChevronRight from "@/components/ChevronRight";
import { getUser } from "@/lib/auth";
import { supabase } from "@/lib/supabase";
import { Task, User } from "@/types";
import { Text } from "@react-navigation/elements";
import { useRouter } from "expo-router";
import { useEffect, useState } from "react";
import {
    FlatList,
    Modal,
    Pressable,
    SafeAreaView,
    StyleSheet,
    TextInput,
    TouchableOpacity,
    View,
} from "react-native";

const mockTasks = [
    { id: "1", name: "exercise", userId: "user1" },
    { id: "2", name: "Meditate", userId: "user1" },
    { id: "3", name: "Read", userId: "user1" },
];

const Home = () => {
    // Modal state
    const [visible, setVisible] = useState(false);
    const [newTaskTitle, setNewTaskTitle] = useState("");

    // Modal functions
    const showModal = () => setVisible(true);
    const hideModal = () => setVisible(false);

    const [tasks, setTasks] = useState(mockTasks);
    const [user, setUser] = useState<User | null>(null);

    const router = useRouter();

    const addTask = async () => {
        const trimmed = newTaskTitle.trim();
        if (trimmed === "") return;

        const { data, error } = await supabase
            .from("habits")
            .insert([
                {
                    name: trimmed,
                    user_id: user?.id,
                },
            ])
            .select()
            .single();

        if (error) {
            console.error("Error creating task:", error);
            return;
        }

        setTasks((prev) => [data, ...prev]);
        setNewTaskTitle("");
        hideModal();
    };

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
                    <Text style={styles.taskText}>{item.name}</Text>
                    <ChevronRight size={24} color="#CCC" />
                </View>
            </TouchableOpacity>
        );
    };

    useEffect(() => {
        const fetchUser = async () => {
            const u = await getUser();

            if (u) {
                setUser(u);
            }
        };

        fetchUser();
    }, []);

    useEffect(() => {
        const fetchTasks = async () => {
            if (!user) return;

            const { data, error } = await supabase
                .from("habits")
                .select("*")
                .eq("user_id", user.id)
                .order("created_at", { ascending: true });

            if (error) {
                console.error("Error loading tasks:", error);
            } else {
                setTasks(data);
            }
        };

        fetchTasks();
    }, [user]);

    return (
        <SafeAreaView style={styles.mainContainer}>
            <FlatList
                data={tasks}
                keyExtractor={(item) => item.id}
                renderItem={renderTask}
                contentContainerStyle={{ paddingBottom: 80 }}
            />
            <TouchableOpacity style={styles.addButton} onPress={showModal}>
                <Text style={styles.addButtonText}>+</Text>
            </TouchableOpacity>
            <Modal visible={visible} onRequestClose={hideModal} animationType="fade" transparent>
                <Pressable style={styles.backdrop} onPress={hideModal} />
                <View style={styles.modalMain}>
                    <Text style={styles.modalTitle}>New Task</Text>
                    <TextInput
                        style={styles.input}
                        placeholder="e.g. Gym"
                        placeholderTextColor="#ccc"
                        value={newTaskTitle}
                        onChangeText={setNewTaskTitle}
                    />
                    <TouchableOpacity style={styles.submitButton} onPress={addTask}>
                        <Text style={styles.submitButtonText}>Add Task</Text>
                    </TouchableOpacity>
                </View>
            </Modal>
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
    backdrop: {
        flex: 1,
        backgroundColor: "rgba(0,0,0,0.3)",
    },
    modalMain: {
        position: "absolute",
        bottom: 0,
        width: "100%",
        padding: 24,
        backgroundColor: "#fff",
        borderTopLeftRadius: 24,
        borderTopRightRadius: 24,
        shadowColor: "#000",
        shadowOpacity: 0.1,
        shadowRadius: 8,
        elevation: 10,
    },
    modalTitle: {
        fontSize: 18,
        fontWeight: "600",
        marginBottom: 12,
    },
    input: {
        borderWidth: 1,
        borderColor: "#ddd",
        borderRadius: 8,
        padding: 12,
        fontSize: 16,
        marginBottom: 16,
    },
    submitButton: {
        backgroundColor: "#ACCAEB",
        paddingVertical: 12,
        borderRadius: 8,
        alignItems: "center",
    },
    submitButtonText: {
        color: "#fff",
        fontWeight: "600",
        fontSize: 16,
    },
});

export default Home;
