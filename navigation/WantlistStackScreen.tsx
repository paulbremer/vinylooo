import React from 'react'
import { Text, View } from 'react-native'
import { createStackNavigator } from '@react-navigation/stack'
import { createDrawerNavigator } from '@react-navigation/drawer'
import { DrawerActions } from '@react-navigation/native'
import AlbumDetail from '../screens/AlbumDetail'
import Wantlist from '../screens/Wantlist'
import Sorting from '../screens/Sorting'
import CustomIcon from '../components/CustomIcon/CustomIcon'
import Colors from '../constants/Colors'

const WantlistDrawer = createDrawerNavigator()

const CustomDrawerContentWantlist = ({ navigation }) => {
    return <Sorting from="wantlist" navigation={navigation} />
}

const DrawerForWantlist = ({ navigation }) => {
    return (
        <WantlistDrawer.Navigator drawerContent={() => <CustomDrawerContentWantlist navigation={navigation} />}>
            <WantlistDrawer.Screen name="Wantlist" component={Wantlist} />
        </WantlistDrawer.Navigator>
    )
}

const WantlistStack = createStackNavigator()

function WantlistStackScreen({ navigation }) {
    return (
        <WantlistStack.Navigator>
            <WantlistStack.Screen
                name="Wantlist"
                component={Wantlist}
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
                    // headerLeft: () => (
                    //     <CustomIcon
                    //         name="sort"
                    //         color={Colors.purple}
                    //         style={{ marginLeft: 24 }}
                    //         onPress={() => navigation.dispatch(DrawerActions.toggleDrawer())}
                    //     />
                    // ),
                    headerRight: () => (
                        <CustomIcon
                            name="add"
                            color={Colors.purple}
                            style={{ marginRight: 24 }}
                            onPress={() =>
                                navigation.navigate('addAlbumModal', {
                                    screen: 'AddAlbum',
                                    params: { from: 'wantlist' }
                                })
                            }
                        />
                    )
                }}
            />
            <WantlistStack.Screen
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
        </WantlistStack.Navigator>
    )
}

export default WantlistStackScreen
