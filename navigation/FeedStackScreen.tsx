import React from 'react'
import { Text } from 'react-native'
import { createStackNavigator } from '@react-navigation/stack'
import FeedScreen from '../screens/Feed'

const FeedStack = createStackNavigator()

function FeedStackScreen() {
    return (
        <FeedStack.Navigator>
            <FeedStack.Screen
                name="Feed"
                component={FeedScreen}
                options={{
                    headerTitle: (
                        <Text
                            style={{
                                fontFamily: 'kulimpark-bold'
                            }}
                        >
                            Your feed
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
        </FeedStack.Navigator>
    )
}

export default FeedStackScreen
