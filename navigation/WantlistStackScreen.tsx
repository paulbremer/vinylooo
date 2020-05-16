import React from 'react'
import { Text, View } from 'react-native'
import { createStackNavigator } from '@react-navigation/stack'
import { createDrawerNavigator } from '@react-navigation/drawer'
import Wantlist from '../screens/Wantlist'
import Sorting from '../screens/Sorting'
import CustomIcon from '../components/CustomIcon'
import Colors from '../constants/Colors'

const WantlistDrawer = createDrawerNavigator()

const CustomDrawerContent = ({ navigation }) => {
    return <Sorting navigation={navigation} />
}

const Drawer = ({ navigation }) => {
    return (
        <WantlistDrawer.Navigator drawerContent={() => <CustomDrawerContent navigation={navigation} />}>
            <WantlistDrawer.Screen name="Collection" component={Wantlist} />
        </WantlistDrawer.Navigator>
    )
}

const WantlistStack = createStackNavigator()

function WantlistStackScreen({ navigation }) {
    return (
        <WantlistStack.Navigator>
            <WantlistStack.Screen
                name="Wantlist"
                component={Drawer}
                options={{
                    headerTitle: (
                        <Text
                            style={{
                                fontFamily: 'kulimpark-bold'
                            }}
                        >
                            Your wantlist
                        </Text>
                    ),
                    headerStyle: {
                        backgroundColor: 'rgb(252,252,252)'
                    },
                    headerTintColor: '#240549',
                    headerTitleStyle: {
                        fontWeight: 'bold'
                    },
                    headerRight: () => (
                        <CustomIcon
                            name="add"
                            color={Colors.purple}
                            style={{ marginRight: 24 }}
                            onPress={() => navigation.navigate('addAlbumModal')}
                        />
                    )
                }}
            />
        </WantlistStack.Navigator>
    )
}

export default WantlistStackScreen
