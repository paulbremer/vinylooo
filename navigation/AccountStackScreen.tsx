import React from "react";
import { Text, View } from "react-native";
import { createStackNavigator } from "@react-navigation/stack";

const AccountStack = createStackNavigator();

function AccountScreen() {
    return (
        <View
            style={{
                flex: 1,
                justifyContent: "center",
                alignItems: "center",
                backgroundColor: "#fff"
            }}>
            <Text>Account</Text>
        </View>
    );
}

function AccountStackScreen() {
    return (
        <AccountStack.Navigator>
            <AccountStack.Screen
                name="Account"
                component={AccountScreen}
                options={{
                    headerTitle: (
                        <Text
                            style={{
                                fontFamily: "kulimpark-bold"
                            }}>
                            Account
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
        </AccountStack.Navigator>
    );
}

export default AccountStackScreen;
