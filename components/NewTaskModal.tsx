import { Colors } from "@/constants/Colors";
import { Text } from "@react-navigation/elements";
import {
    KeyboardAvoidingView,
    Modal,
    Platform,
    StyleSheet,
    TouchableOpacity,
    View,
} from "react-native";
import { Pressable, TextInput } from "react-native-gesture-handler";

const NewTaskModel = ({
    visible,
    onClose,
    value,
    onChangeText,
    onSubmit,
}: {
    visible: boolean;
    onClose: () => void;
    value: string;
    onChangeText: (text: string) => void;
    onSubmit: () => void;
}) => {
    return (
        <Modal visible={visible} onRequestClose={onClose} animationType="fade" transparent>
            <KeyboardAvoidingView
                behavior={Platform.OS === "ios" ? "padding" : "height"}
                style={styles.keyboardAvoiding}
            >
                <View style={styles.modalContainer}>
                    <Pressable style={styles.backdrop} onPress={onClose} />
                    <View style={styles.modalMain}>
                        <Text style={styles.modalTitle}>New Task</Text>
                        <TextInput
                            style={styles.input}
                            placeholder="e.g. Gym"
                            placeholderTextColor="#ccc"
                            value={value}
                            onChangeText={onChangeText}
                            autoFocus
                        />
                        <TouchableOpacity style={styles.addTaskbutton} onPress={onSubmit}>
                            <Text style={styles.addTaskButtonText}>Add Task</Text>
                        </TouchableOpacity>
                    </View>
                </View>
            </KeyboardAvoidingView>
        </Modal>
    );
};

const styles = StyleSheet.create({
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
});

export default NewTaskModel;
