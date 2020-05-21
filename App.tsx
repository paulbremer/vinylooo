import React, { useState, useEffect } from 'react'
import * as Font from 'expo-font'
import ReduxThunk from 'redux-thunk'
import { Provider } from 'react-redux'
import { Text, View } from 'react-native'
import { AppearanceProvider } from 'react-native-appearance'
import { createStore, combineReducers, applyMiddleware } from 'redux'
import { NavigationContainer, DefaultTheme } from '@react-navigation/native'
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs'
import { createStackNavigator } from '@react-navigation/stack'
import FeedStackScreen from './navigation/FeedStackScreen'
import CollectionStackScreen from './navigation/CollectionStackScreen'
import WantlistStackScreen from './navigation/WantlistStackScreen'
import DiscoverStackScreen from './navigation/DiscoverStackScreen'
import AccountStackScreen from './navigation/AccountStackScreen'
import CustomIcon from './components/CustomIcon'
import AddAlbum from './screens/AddAlbum'
import AddAlbumManually from './screens/AddAlbumManually'
import Colors from './constants/Colors'
import albumsReducer from './store/reducers/albums'
import wantlistReducer from './store/reducers/wantlist'
import { init } from './helpers/db'

init()
    .then(() => {
        console.log('Initialized database')
    })
    .catch((err) => {
        console.error('Initializing db failed 😢', err)
    })

const rootReducer = combineReducers({
    albums: albumsReducer,
    wantlist: wantlistReducer
})

const store = createStore(rootReducer, applyMiddleware(ReduxThunk))

const RootStack = createStackNavigator()
const ScanAlbumStack = createStackNavigator()
const Tab = createBottomTabNavigator()

const MyTheme = {
    ...DefaultTheme,
    colors: {
        ...DefaultTheme.colors,
        background: 'rgb(255, 255, 255)',
        text: Colors.grey,
        primary: Colors.primaryColor
    }
}

const ScanAlbumScreen = () => {
    return (
        <ScanAlbumStack.Navigator>
            <ScanAlbumStack.Screen
                name="AddAlbum"
                component={AddAlbum}
                options={({ route, navigation }) => ({
                    headerTitle: (
                        <Text
                            style={{
                                fontFamily: 'kulimpark-bold'
                            }}
                        >
                            Scan barcode
                        </Text>
                    ),
                    headerBackTitleVisible: false,
                    headerLeft: null,
                    headerBackImage: () => <CustomIcon name="back" color="#ffffff" style={{ marginLeft: 24 }} />,
                    headerStyle: {
                        backgroundColor: Colors.purple,
                        borderBottomWidth: 0,
                        borderBottomColor: '#ff2200',
                        shadowOpacity: 0
                    },
                    headerTintColor: '#fff',
                    headerRight: () => (
                        <CustomIcon
                            name="close"
                            color="#ffffff"
                            style={{ marginRight: 24 }}
                            onPress={() => navigation.goBack()}
                        />
                    )
                })}
            />
            <ScanAlbumStack.Screen
                name="AddAlbumManually"
                component={AddAlbumManually}
                options={({ navigation }) => ({
                    headerTitle: (
                        <Text
                            style={{
                                fontFamily: 'kulimpark-bold'
                            }}
                        >
                            Add manually
                        </Text>
                    ),
                    headerBackTitleVisible: false,
                    headerBackImage: () => <CustomIcon name="back" color="#ffffff" style={{ marginLeft: 24 }} />,
                    headerStyle: {
                        backgroundColor: Colors.purple,
                        borderBottomWidth: 0,
                        borderBottomColor: '#ff2200',
                        shadowOpacity: 0
                    },
                    headerTintColor: '#fff',
                    headerRight: () => (
                        <CustomIcon
                            name="close"
                            color="#ffffff"
                            style={{ marginRight: 24 }}
                            onPress={() => navigation.navigate('Collection')}
                        />
                    )
                })}
            />
        </ScanAlbumStack.Navigator>
    )
}

const MainStackScreen = () => {
    return (
        <Tab.Navigator
            screenOptions={({ route }) => ({
                tabBarIcon: ({ focused, color, size }) => {
                    let iconName

                    if (route.name === 'FEED') {
                        iconName = 'sort'
                    } else if (route.name === 'COLLECTION') {
                        iconName = 'lp'
                    } else if (route.name === 'WANTLIST') {
                        iconName = 'discover'
                    } else if (route.name === 'ACCOUNT') {
                        iconName = 'user'
                    }

                    return <CustomIcon name={iconName} color={focused ? Colors.primaryColor : Colors.grey} />
                }
            })}
            tabBarOptions={{
                activeTintColor: Colors.primaryColor,
                inactiveTintColor: '#8D819D'
            }}
        >
            <Tab.Screen name="FEED" component={FeedStackScreen} />
            <Tab.Screen name="COLLECTION" component={CollectionStackScreen} />
            <Tab.Screen name="WANTLIST" component={WantlistStackScreen} />
            <Tab.Screen name="ACCOUNT" component={AccountStackScreen} />
        </Tab.Navigator>
    )
}

export default function App() {
    const [fontsLoaded, setFontsLoaded] = useState(false)

    useEffect(() => {
        const loadFonts = async () => {
            await Font.loadAsync({
                icomoon: require('./assets/fonts/icomoon.ttf'),
                'kulimpark-regular': require('./assets/fonts/KulimPark-Regular.ttf'),
                'kulimpark-bold': require('./assets/fonts/KulimPark-Bold.ttf')
            })

            setFontsLoaded(true)
        }
        loadFonts()
    }, [])

    if (!fontsLoaded) {
        return (
            <View>
                <Text>loading...</Text>
            </View>
        )
    }

    return (
        <Provider store={store}>
            <AppearanceProvider>
                <NavigationContainer theme={MyTheme}>
                    <RootStack.Navigator mode="modal">
                        <RootStack.Screen name="Main" component={MainStackScreen} options={{ headerShown: false }} />
                        <RootStack.Screen
                            name="addAlbumModal"
                            component={ScanAlbumScreen}
                            options={{ headerShown: false }}
                        />
                    </RootStack.Navigator>
                </NavigationContainer>
            </AppearanceProvider>
        </Provider>
    )
}
