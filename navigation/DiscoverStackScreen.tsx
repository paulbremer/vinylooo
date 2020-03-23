import React from "react";
import { Text } from "react-native";
import { createStackNavigator } from "@react-navigation/stack";
import Discover from "../screens/Discover";

const DiscoverStack = createStackNavigator();

function DiscoverStackScreen() {
    return (
        <DiscoverStack.Navigator>
            <DiscoverStack.Screen
                name="Discover"
                component={Discover}
                options={{
                    headerTitle: (
                        <Text
                            style={{
                                fontFamily: "kulimpark-bold"
                            }}>
                            Discover
                        </Text>
                    ),
                    headerStyle: {
                        backgroundColor: "rgb(252,252,252)"
                    },
                    headerTintColor: "#240549",
                    headerTitleStyle: {
                        fontWeight: "bold"
                    }
                }}
            />
        </DiscoverStack.Navigator>
    );
}

export default DiscoverStackScreen;
