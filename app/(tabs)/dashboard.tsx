import NewTaskModel from "@/components/NewTaskModal";
import TaskItem from "@/components/TaskItem";
import { Colors } from "@/constants/Colors";
import { getUser } from "@/lib/auth";
import { supabase } from "@/lib/supabase";
import { Task, User } from "@/types";
import { Text } from "@react-navigation/elements";
import { format } from "date-fns";
import { useEffect, useState } from "react";
import { FlatList, StyleSheet, TouchableOpacity, useColorScheme, View } from "react-native";
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
    }, [user, tasks]);

    const todaysDate = format(new Date(), "MMMM do");

    return (
        <SafeAreaView style={[styles.mainContainer, { backgroundColor: themeBackgroundColor }]}>
            <View style={styles.headerContainer}>
                <Text style={[styles.header, { color: themeTextColor }]}>{todaysDate}</Text>
                <TouchableOpacity style={styles.addButton} onPress={showModal}>
                    <Text style={styles.addButtonText}>+</Text>
                </TouchableOpacity>
            </View>
            <FlatList
                data={tasks}
                keyExtractor={(item) => item.id}
                renderItem={({ item }) => <TaskItem item={item} onDelete={deleteTask} />}
                contentContainerStyle={{ paddingBottom: 80, gap: 12 }}
                showsVerticalScrollIndicator={false}
            />
            <NewTaskModel
                visible={visible}
                onClose={hideModal}
                value={newTaskTitle}
                onChangeText={setNewTaskTitle}
                onSubmit={addTask}
            />
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
    headerContainer: {
        flexDirection: "row",
        justifyContent: "space-between",
    },
    addButton: {
        width: 60,
        height: 60,
        borderRadius: 30,
        alignItems: "center",
        justifyContent: "center",
    },
    addButtonText: {
        color: Colors.primary,
        fontSize: 36,
        lineHeight: 36,
        textAlign: "center",
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
