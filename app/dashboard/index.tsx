import TaskItem from "@/components/TaskItem";
import { Colors } from "@/constants/Colors";
import { getUser } from "@/lib/auth";
import { supabase } from "@/lib/supabase";
import { Task, User } from "@/types";
import { Text } from "@react-navigation/elements";
import { format } from "date-fns";
import { useEffect, useState } from "react";
import {
    FlatList,
    KeyboardAvoidingView,
    Modal,
    Platform,
    Pressable,
    StyleSheet,
    TextInput,
    TouchableOpacity,
    useColorScheme,
    View,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

const TASK_HEIGHT = 72;

const Home = () => {
    // Modal state
    const [visible, setVisible] = useState(false);
    const [newTaskTitle, setNewTaskTitle] = useState("");

    // Modal functions
    const showModal = () => setVisible(true);
    const hideModal = () => setVisible(false);

    const [tasks, setTasks] = useState<Task[]>();
    const [user, setUser] = useState<User | null>(null);

    // Add a task
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

        setTasks((prev) => [...(prev ?? []), data]);
        setNewTaskTitle("");
        hideModal();
    };

    const colorScheme = useColorScheme();
    const themeBackgroundColor =
        colorScheme === "dark" ? Colors.dark.background : Colors.light.background;
    const themeTextColor = colorScheme === "dark" ? Colors.dark.text : Colors.light.text;

    const deleteTask = (id: string) => {
        setTasks((prev) => prev?.filter((task) => task.id !== id));
    };

    // Get the current user info
    useEffect(() => {
        const fetchUser = async () => {
            const u = await getUser();

            if (u) {
                setUser(u);
            }
        };

        fetchUser();
    }, []);

    // Get users tasks
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

    const todaysDate = format(new Date(), "MMMM do");

    return (
        <SafeAreaView style={[styles.mainContainer, { backgroundColor: themeBackgroundColor }]}>
            <Text style={[styles.header, { color: themeTextColor }]}>{todaysDate}</Text>
            <FlatList
                data={tasks}
                keyExtractor={(item) => item.id}
                renderItem={({ item }) => <TaskItem item={item} onDelete={deleteTask} />}
                contentContainerStyle={{ paddingBottom: 80 }}
            />
            <TouchableOpacity style={styles.addButton} onPress={showModal}>
                <Text style={styles.addButtonText}>+</Text>
            </TouchableOpacity>
            <Modal visible={visible} onRequestClose={hideModal} animationType="fade" transparent>
                <KeyboardAvoidingView
                    behavior={Platform.OS === "ios" ? "padding" : "height"}
                    style={styles.keyboardAvoiding}
                >
                    <View style={styles.modalContainer}>
                        <Pressable style={styles.backdrop} onPress={hideModal} />
                        <View style={styles.modalMain}>
                            <Text style={styles.modalTitle}>New Task</Text>
                            <TextInput
                                style={styles.input}
                                placeholder="e.g. Gym"
                                placeholderTextColor="#ccc"
                                value={newTaskTitle}
                                onChangeText={setNewTaskTitle}
                                autoFocus
                            />
                            <TouchableOpacity style={styles.addTaskbutton} onPress={addTask}>
                                <Text style={styles.addTaskButtonText}>Add Task</Text>
                            </TouchableOpacity>
                        </View>
                    </View>
                </KeyboardAvoidingView>
            </Modal>
        </SafeAreaView>
    );
};

const styles = StyleSheet.create({
    mainContainer: {
        flex: 1,
        justifyContent: "center",
        alignContent: "center",
        paddingHorizontal: 12,
    },
    header: {
        fontSize: 38,
        fontWeight: "600",
        marginBottom: 12,
    },
    task: {
        backgroundColor: Colors.primary,
        padding: 18,
        borderRadius: 12,
        marginBottom: 8,
        height: TASK_HEIGHT,
        justifyContent: "center",
    },
    taskText: {
        fontSize: 16,
        fontWeight: "500",
        color: "#000",
    },
    taskTextWrapper: {
        flexDirection: "row",
        justifyContent: "space-between",
        alignItems: "center",
    },
    taskRow: {
        backgroundColor: Colors.primary,
        borderRadius: 12,
        height: TASK_HEIGHT,
        marginBottom: 8,
        overflow: "hidden",
    },
    addButton: {
        position: "absolute",
        bottom: 30,
        right: 30,
        backgroundColor: Colors.primary,
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
        color: "#000",
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
    addTaskbutton: {
        backgroundColor: Colors.primary,
        paddingVertical: 12,
        borderRadius: 8,
        alignItems: "center",
    },
    addTaskButtonText: {
        color: "#fff",
        fontWeight: "600",
        fontSize: 16,
    },
    keyboardAvoiding: {
        flex: 1,
        justifyContent: "flex-end",
    },
    modalContainer: {
        flex: 1,
        justifyContent: "flex-end",
    },
    deleteButton: {
        backgroundColor: "#FF6B6B",
        justifyContent: "center",
        alignItems: "flex-end",
        paddingHorizontal: 20,
        borderRadius: 12,
        height: TASK_HEIGHT,
    },
    deleteText: {
        color: "white",
        fontWeight: "600",
        fontSize: 16,
    },
});

export default Home;
