import { eventBus } from "@/lib/eventBus";
import { supabase } from "@/lib/supabase";
import { Task } from "@/types";
import { Text } from "@react-navigation/elements";
import Checkbox from "expo-checkbox";
import { useRouter } from "expo-router";
import { useEffect, useState } from "react";
import {
    Alert,
    Modal,
    Pressable,
    StyleSheet,
    TouchableWithoutFeedback,
    useColorScheme,
    View,
} from "react-native";
import EditTaskModal from "./EditTaskModal";
import GridView from "./GridView";

export default function TaskItem({
    item,
    onDelete,
}: {
    item: Task;
    onDelete: (id: string) => void;
}) {
    const [isChecked, setIsChecked] = useState(false);
    const [refreshTrigger, setRefreshTrigger] = useState(0);
    const [menuVisible, setMenuVisible] = useState(false);

    // Edit modal state
    const [modalVisible, setModalVisible] = useState(false);
    const [newTaskName, setNewTaskName] = useState(item.name);

    useEffect(() => {
        checkCompletion();
    }, [item.id]);

    // listen for changes inside [id]
    useEffect(() => {
        const off = eventBus.on("completionsChanged", (payload: any) => {
            if (!payload || payload.habitId !== item.id) return;
            // make GridView refetch completions
            setRefreshTrigger((r) => r + 1);
            // set today's checkbox
        });
        return off;
    });

    const checkCompletion = async () => {
        const today = new Date().toISOString().split("T")[0];

        const { data, error } = await supabase
            .from("habit_completions")
            .select("id")
            .eq("habit_id", item.id)
            .eq("completed_date", today)
            .single();

        if (!error && data) {
            setIsChecked(true);
        } else {
            setIsChecked(false);
        }
    };

    const handleCompletionToggle = async (checked: boolean) => {
        setIsChecked(checked);

        const today = new Date().toISOString().split("T")[0];

        try {
            // If task is being checked, insert into DB, else remove completion
            if (checked) {
                const { error } = await supabase.from("habit_completions").insert({
                    habit_id: item.id,
                    completed_date: today,
                    created_at: new Date().toISOString(),
                });

                if (error) {
                    setIsChecked(false);
                    console.error("handleCompletionToggle:", error);
                } else {
                    eventBus.emit("completionsChanged", {
                        habitId: item.id,
                        date: today,
                        present: true,
                    });
                    setRefreshTrigger((prev) => prev + 1);
                }
            } else {
                const { error } = await supabase
                    .from("habit_completions")
                    .delete()
                    .eq("habit_id", item.id)
                    .eq("completed_date", today);

                if (error) {
                    setIsChecked(false);
                    console.error("handleCompletionToggle:", error);
                } else {
                    eventBus.emit("completionsChanged", {
                        habitId: item.id,
                        date: today,
                        present: false,
                    });
                    setRefreshTrigger((prev) => prev + 1);
                }
            }
        } catch (error) {
            setIsChecked(!checked);
            console.log("Caught error:", error);
        }
    };

    const themeBackgroundColor = useColorScheme() === "dark" ? "#000" : "#fff";
    const themeFontColor = useColorScheme() === "dark" ? "#fff" : "000";
    const themeBorderColor = useColorScheme() === "dark" ? "#333" : "#ddd";

    const todayString = new Date().toISOString().split("T")[0];

    const router = useRouter();

    const handleDelete = async () => {
        setMenuVisible(false);

        const { error } = await supabase.from("habits").delete().eq("id", item.id);

        if (!error) onDelete(item.id);
    };

    const handleEdit = async () => {
        const { error } = await supabase
            .from("habits")
            .update({ name: newTaskName })
            .eq("id", item.id);

        setModalVisible(false);

        if (error) {
            Alert.alert("Error changing task name");
        }
    };

    return (
        <View
            style={[
                styles.mainContainer,
                { backgroundColor: themeBackgroundColor, borderColor: themeBorderColor },
            ]}
        >
            <TouchableWithoutFeedback
                onPress={() =>
                    router.push({
                        pathname: "/task/[id]",
                        params: { id: item.id, name: item.name },
                    })
                }
                onLongPress={() => setMenuVisible(!menuVisible)}
                style={[styles.mainContainer, { backgroundColor: "#fff" }]}
            >
                <View>
                    <View style={[styles.taskRow]}>
                        <Text style={[styles.taskText, { color: themeFontColor }]}>
                            {item.name}
                        </Text>
                        <Checkbox
                            style={styles.checkbox}
                            value={isChecked}
                            onValueChange={handleCompletionToggle}
                        />
                    </View>
                    <GridView
                        habitId={item.id}
                        createdAt={item.created_at}
                        refreshTrigger={refreshTrigger}
                        today={todayString}
                        todayCompleted={isChecked}
                    />
                </View>
            </TouchableWithoutFeedback>

            <Modal
                visible={menuVisible}
                transparent
                animationType="fade"
                onRequestClose={() => setMenuVisible(false)}
            >
                <Pressable style={styles.modalOverlay} onPress={() => setMenuVisible(false)}>
                    <View style={styles.modalBox}>
                        <Text style={styles.modalTitle}>{item.name}</Text>
                        <Pressable
                            style={styles.modalBtn}
                            onPress={() => {
                                setNewTaskName(item.name);
                                setMenuVisible(false);
                                setModalVisible(true);
                            }}
                        >
                            <Text style={styles.modalBtnText}>Edit</Text>
                        </Pressable>
                        <Pressable style={styles.modalBtn} onPress={handleDelete}>
                            <Text style={[styles.modalBtnText, { color: "#ef4444" }]}>Delete</Text>
                        </Pressable>
                        <Pressable style={styles.modalCancel} onPress={() => setMenuVisible(false)}>
                            <Text style={styles.modalCancelText}>Cancel</Text>
                        </Pressable>
                    </View>
                </Pressable>
            </Modal>
            <EditTaskModal
                visible={modalVisible}
                onClose={() => setModalVisible(false)}
                value={newTaskName}
                onChangeText={setNewTaskName}
                onSubmit={handleEdit}
            />
        </View>
    );
}

const styles = StyleSheet.create({
    mainContainer: {
        borderRadius: 12,
        padding: 14,
        borderWidth: 1,
    },
    taskText: {
        fontSize: 16,
    },
    taskRow: {
        flexDirection: "row",
        justifyContent: "space-between",
        alignItems: "center",
        marginBottom: 4,
    },
    checkbox: {
        padding: 12,
    },
    modalOverlay: {
        flex: 1,
        backgroundColor: "rgba(0,0,0,0.25)",
        justifyContent: "center",
        alignItems: "center",
    },
    modalBox: {
        backgroundColor: "#fff",
        borderRadius: 16,
        padding: 24,
        minWidth: 220,
        alignItems: "center",
        elevation: 8,
    },
    modalTitle: {
        fontSize: 18,
        fontWeight: "700",
        marginBottom: 18,
    },
    modalBtn: {
        paddingVertical: 10,
        width: "100%",
        alignItems: "center",
    },
    modalBtnText: {
        fontSize: 16,
        fontWeight: "600",
        color: "#222",
    },
    modalCancel: {
        marginTop: 8,
        paddingVertical: 8,
        width: "100%",
        alignItems: "center",
    },
    modalCancelText: {
        fontSize: 15,
        color: "#888",
    },
});
