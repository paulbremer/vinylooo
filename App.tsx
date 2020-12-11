import React, { useState, useEffect, useMemo, useReducer, useContext, createContext } from 'react'
import * as Font from 'expo-font'
import ReduxThunk from 'redux-thunk'
import { Provider } from 'react-redux'
import { AsyncStorage, Text, View, Button } from 'react-native'
import Toast from 'react-native-toast-message'
import { AppearanceProvider } from 'react-native-appearance'
import { createStore, combineReducers, applyMiddleware } from 'redux'
import { NavigationContainer, DefaultTheme } from '@react-navigation/native'
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs'
import { createStackNavigator } from '@react-navigation/stack'
// import NavigatorContainer from './navigation/NavigatorContainer'
import FeedStackScreen from './navigation/FeedStackScreen'
import CollectionStackScreen from './navigation/CollectionStackScreen'
import WantlistStackScreen from './navigation/WantlistStackScreen'
import DiscoverStackScreen from './navigation/DiscoverStackScreen'
import AccountStackScreen from './navigation/AccountStackScreen'
import CustomIcon from './components/CustomIcon/CustomIcon'
import AddAlbum from './screens/AddAlbum'
import AddAlbumManually from './screens/AddAlbumManually'
import Colors from './constants/Colors'
import albumsReducer from './store/reducers/albums'
import wantlistReducer from './store/reducers/wantlist'
import { init } from './helpers/db'

import { AuthContext } from './utils/authContext';

require('react-native').unstable_enableLogBox()

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

// const AuthContext = createContext({});


// const authContext = (
//     () => ({
//         signIn: async data => {
//             // In a production app, we need to send some data (usually username, password) to server and get a token
//             // We will also need to handle errors if sign in failed
//             // After getting token, we need to persist the token using `AsyncStorage`
//             // In the example, we'll use a dummy token

//             dispatch({ type: 'SIGN_IN', token: 'dummy-auth-token' });
//         },
//         signOut: () => dispatch({ type: 'SIGN_OUT' }),
//         signUp: async data => {
//             // In a production app, we need to send user data to server and get a token
//             // We will also need to handle errors if sign up failed
//             // After getting token, we need to persist the token using `AsyncStorage`
//             // In the example, we'll use a dummy token

//             dispatch({ type: 'SIGN_IN', token: 'dummy-auth-token' });
//         },
//     }),
//     []
// );


const ScanAlbumScreen = () => {
    return (
        <ScanAlbumStack.Navigator mode="modal">
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
                options={({ route, navigation }) => ({
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
                            onPress={() =>
                                route.params.from === 'collection'
                                    ? navigation.navigate('Collection')
                                    : navigation.navigate('Wantlist')
                            }
                        />
                    )
                })}
            />
        </ScanAlbumStack.Navigator>
    )
}

const MainStackScreen = () => {
    return (
        <>
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

            <Stack.Screen
                name="addAlbumModal"
                component={ScanAlbumScreen}
                options={{ headerShown: false }}
            />
        </>
    )
}

function SplashScreen() {
    return (
        <View>
            <Text>Loading...</Text>
        </View>
    );
}

function HomeScreen() {
    const { signOut } = useContext(AuthContext);

    return (
        <View>
            <Text>Signed in!</Text>
            <Button title="Sign out" onPress={signOut} />
        </View>
    );
}

function ConnectScreen() {
    const [username, setUsername] = React.useState('');
    const [password, setPassword] = React.useState('');

    const { signIn } = useContext(AuthContext);

    return (
        <View>
            <Button title="Connect Discogs account" onPress={() => signIn({ username, password })} />
        </View>
    );
}

const Stack = createStackNavigator();

export default function App() {
    const [state, dispatch] = useReducer(
        (prevState, action) => {
            switch (action.type) {
                case 'RESTORE_TOKEN':
                    return {
                        ...prevState,
                        userToken: action.token,
                        isLoading: false,
                    };
                case 'SIGN_IN':
                    return {
                        ...prevState,
                        isSignout: false,
                        userToken: action.token,
                    };
                case 'SIGN_OUT':
                    return {
                        ...prevState,
                        isSignout: true,
                        userToken: null,
                    };
            }
        },
        {
            isLoading: true,
            isSignout: false,
            userToken: null,
        }
    );

    const [fontsLoaded, setFontsLoaded] = useState(false)

    useEffect(() => {
        // Fetch the token from storage then navigate to our appropriate place
        const bootstrapAsync = async () => {
            let userToken;

            console.log('x bootstrapAsync ', userToken)

            try {
                userToken = await AsyncStorage.getItem('userToken');
            } catch (e) {
                // Restoring token failed
            }

            // After restoring token, we may need to validate it in production apps

            // This will switch to the App screen or Auth screen and this loading
            // screen will be unmounted and thrown away.
            dispatch({ type: 'RESTORE_TOKEN', token: userToken });
        };

        bootstrapAsync();

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

    // if (!fontsLoaded) {
    //     return (
    //         <View>
    //             <Text>loading...</Text>
    //         </View>
    //     )
    // }

    // In a production app, we need to send some data (usually username, password) to server and get a token
    // We will also need to handle errors if sign in failed
    // After getting token, we need to persist the token using `AsyncStorage`
    const authContextValue = useMemo(
        () => ({
            signIn: async data => {
                // In a production app, we need to send some data (usually username, password) to server and get a token
                // We will also need to handle errors if sign in failed
                // After getting token, we need to persist the token using `AsyncStorage`
                // In the example, we'll use a dummy token

                dispatch({ type: 'SIGN_IN', token: 'dummy-auth-token' });
            },
            signOut: () => dispatch({ type: 'SIGN_OUT' }),
            signUp: async data => {
                // In a production app, we need to send user data to server and get a token
                // We will also need to handle errors if sign up failed
                // After getting token, we need to persist the token using `AsyncStorage`
                // In the example, we'll use a dummy token

                dispatch({ type: 'SIGN_IN', token: 'dummy-auth-token' });
            },
        }),
        [],
    );

    return (
        <AuthContext.Provider value={authContextValue}>
            <Provider store={store}>
                <NavigationContainer>
                    <Stack.Navigator mode="modal">
                        {console.log('xxx ', state.userToken)}
                        {state.isLoading ? (
                            <Stack.Screen name="Splash" component={SplashScreen} />
                        ) : state.userToken == null ? (
                            <Stack.Screen
                                name="SignIn"
                                component={ConnectScreen}
                                options={{
                                    title: 'Connect',
                                    animationTypeForReplace: state.isSignout ? 'pop' : 'push',
                                }}
                            />
                        ) : (
                                    <Stack.Screen
                                        name="Main"
                                        component={MainStackScreen}
                                        options={{ headerShown: false }}
                                    />
                                )}
                    </Stack.Navigator>
                </NavigationContainer>
            </Provider>
        </AuthContext.Provider >

        // <Provider store={store}>
        //     <AppearanceProvider>
        //         {/* <NavigatorContainer /> */}

        //         <NavigationContainer theme={MyTheme}>
        //             <RootStack.Navigator mode="modal">
        //                 <RootStack.Screen name="Main" component={MainStackScreen} options={{ headerShown: false }} />
        //                 <RootStack.Screen
        //                     name="addAlbumModal"
        //                     component={ScanAlbumScreen}
        //                     options={{ headerShown: false }}
        //                 />
        //             </RootStack.Navigator>
        //         </NavigationContainer>
        //     </AppearanceProvider>
        // </Provider>

        // <NavigationContainer theme={MyTheme}>
        // <RootStack.Navigator mode="modal">
        // <RootStack.Screen name="Main" component={MainStackScreen} options={{ headerShown: false }} />
        // <RootStack.Screen
        //     name="addAlbumModal"
        //     component={ScanAlbumScreen}
        //     options={{ headerShown: false }}
        // />
        // {/* </RootStack.Navigator> */ }
        // </NavigationContainer>
    )
}
