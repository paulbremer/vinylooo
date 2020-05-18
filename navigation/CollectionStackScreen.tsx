import React from 'react'
import { Text, View, Button } from 'react-native'
import { createStackNavigator, TransitionPresets } from '@react-navigation/stack'
import { createDrawerNavigator } from '@react-navigation/drawer'
import CustomIcon from '../components/CustomIcon'
import Library from '../screens/Library'
import Sorting from '../screens/Sorting'
import AddAlbum from '../screens/AddAlbumManually'
import AlbumDetail from '../screens/AlbumDetail'
import Colors from '../constants/Colors'
import { DrawerActions } from '@react-navigation/native'

const CollectionStack = createStackNavigator()
const LibraryDrawer = createDrawerNavigator()

const CustomDrawerContent = ({ navigation }) => {
    return <Sorting navigation={navigation} />
}

const Drawer = ({ navigation }) => {
    return (
        <LibraryDrawer.Navigator drawerContent={() => <CustomDrawerContent navigation={navigation} />}>
            <LibraryDrawer.Screen name="Collection" component={Library} />
        </LibraryDrawer.Navigator>
    )
}

const CollectionStackScreen = ({ navigation }) => {
    return (
        <CollectionStack.Navigator>
            <CollectionStack.Screen
                name="Drawer"
                component={Drawer}
                options={{
                    headerTitle: (
                        <Text
                            style={{
                                fontFamily: 'kulimpark-bold'
                            }}
                        >
                            Your collection
                        </Text>
                    ),
                    headerStyle: {
                        backgroundColor: 'rgb(252,252,252)'
                    },
                    headerTintColor: '#240549',
                    headerLeft: () => (
                        <CustomIcon
                            name="sort"
                            color={Colors.purple}
                            style={{ marginLeft: 24 }}
                            onPress={() => navigation.dispatch(DrawerActions.toggleDrawer())}
                        />
                    ),
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
            <CollectionStack.Screen
                name="Details"
                component={AlbumDetail}
                options={({ route }) => ({
                    headerTitle: (
                        <Text
                            style={{
                                fontFamily: 'kulimpark-bold'
                            }}
                        >
                            {route.params.album.basic_information.title}
                        </Text>
                    ),
                    headerStyle: {
                        backgroundColor: 'rgb(252,252,252)'
                    },
                    headerBackTitleVisible: false,
                    headerBackImage: () => <CustomIcon name="back" color={Colors.purple} style={{ marginLeft: 24 }} />,
                    headerTintColor: '#240549',
                    headerTitleStyle: {
                        fontWeight: 'bold'
                    }
                })}
            />
            <CollectionStack.Screen
                name="AddManually"
                component={AddAlbum}
                options={{
                    headerShown: false,
                    gestureEnabled: true,
                    cardOverlayEnabled: true,
                    ...TransitionPresets.ModalTransition
                }}
            />
        </CollectionStack.Navigator>
    )
}

export default CollectionStackScreen
