import React from "react";
import { Platform, View, Text, Button } from "react-native";
import { createAppContainer, createSwitchNavigator } from "react-navigation";
import { createStackNavigator } from "react-navigation-stack";
import { createDrawerNavigator, DrawerItems } from "react-navigation-drawer";

import AuthScreen from "../screens/user/AuthScreen";
import StartupScreen from "../screens/StartupScreen";
import FeedScreen from "../screens/Feed";

const defaultNavOptions = {
    headerStyle: {
        backgroundColor: 'white'
    },
    headerTitleStyle: {
        fontFamily: "open-sans-bold"
    },
    headerBackTitleStyle: {
        fontFamily: "open-sans"
    },
    headerTintColor: "white"
};

const AuthNavigator = createStackNavigator(
    {
        Auth: AuthScreen
    },
    {
        defaultNavigationOptions: defaultNavOptions
    }
);

const MainNavigator = createDrawerNavigator(
    {
        Feed: FeedScreen,
    },
    {
        contentComponent: props => {
            return (
                <View style={{ flex: 1, paddingTop: 20 }}>
                    <Text> MAIN </Text>
                </View>
            );
        }
    }
);

const MainContainerNavigator = createSwitchNavigator({
    Startup: StartupScreen,
    Auth: AuthNavigator,
    Main: MainNavigator
});

export default createAppContainer(MainContainerNavigator);
