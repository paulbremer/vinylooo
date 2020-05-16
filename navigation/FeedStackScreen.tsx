import React from 'react'
import { Text, View } from 'react-native'
import { createStackNavigator } from '@react-navigation/stack'

const FeedStack = createStackNavigator()

function FeedScreen() {
    return (
        <View
            style={{
                flex: 1,
                justifyContent: 'space-between',
                alignItems: 'center',
                padding: 48,
                backgroundColor: '#fcfcfc'
            }}
        >
            <Text>Feed</Text>
        </View>
    )
}

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
