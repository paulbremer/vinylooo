import React from 'react'
import { Text } from 'react-native'
import { createStackNavigator } from '@react-navigation/stack'
import AccountScreen from '../screens/Account'

const AccountStack = createStackNavigator()

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
                                fontFamily: 'kulimpark-bold'
                            }}
                        >
                            Your account
                        </Text>
                    ),
                    headerStyle: {
                        backgroundColor: 'rgb(252,252,252)'
                    },
                    headerTintColor: '#240549',
                    headerTitleStyle: {
                        fontWeight: 'bold'
                    }
                }}
            />
        </AccountStack.Navigator>
    )
}

export default AccountStackScreen
