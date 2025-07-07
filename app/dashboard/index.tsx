import { signOut } from "@/lib/auth";
import { Button } from "@react-navigation/elements";
import { Text, View } from "react-native";

const Home = () => {
    return (
        <View>
            <Button onPress={signOut}>Sign out</Button>
            <Text>HELLO</Text>
        </View>
    );
};

export default Home;
