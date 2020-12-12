import React, { useState, useEffect, useMemo, useReducer, useContext } from 'react'
import * as Font from 'expo-font'
import * as AuthSession from 'expo-auth-session'
import ReduxThunk from 'redux-thunk'
import { Provider } from 'react-redux'
import { Text, View, Button } from 'react-native'
import AsyncStorage from '@react-native-community/async-storage'
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
import ErrorNotification from './components/Notifications/ErrorNotification'
import AddAlbum from './screens/AddAlbum'
import AddAlbumManually from './screens/AddAlbumManually'
import Colors from './constants/Colors'
import albumsReducer from './store/reducers/albums'
import wantlistReducer from './store/reducers/wantlist'
import { init } from './helpers/db'
import { getData, storeData, removeData, storeObject } from './helpers/storeData'
import makeid from './helpers/nonce'

import { AuthContext } from './utils/authContext';

require('react-native').unstable_enableLogBox()

const CONSUMER_KEY = 'tILfDjLHXNBVjcVQthxa'
const CONSUMER_SECRET = 'KIIXTQskHkIifimxKtedzTKnBSNigSZL'
const timestamp = Date.now()

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

function ConnectScreen() {
    const { authDiscogs } = useContext(AuthContext);

    const toastConfig = {
        'error': (internalState) => <ErrorNotification>{internalState.text1}</ErrorNotification>
    }

    return (
        <View style={{ height: '100%' }}>
            <Toast config={toastConfig} ref={(ref) => Toast.setRef(ref)} />

            {/* <Button title="Sign out 2" onPress={() => Toast.show({ type: 'error', position: 'bottom', text1: 'No user found', text2: 'This is some something 👋', visibilityTime: 4000, })} /> */}

            <Button title="Connect Discogs account" onPress={() => authDiscogs()} />
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
                        requestToken: action.requestToken,
                        requestTokenSecret: action.requestTokenSecret,
                        authToken: action.token,
                        authTokenSecret: action.tokenSecret,
                        userData: action.userData,
                        isLoading: false,
                    };
                case 'AUTH_DISCOGS_INIT':
                    return {
                        ...prevState,
                        isLoading: true,
                    };
                case 'AUTH_DISCOGS_SUCCESS':
                    return {
                        ...prevState,
                        requestToken: null,
                        requestTokenSecret: null,
                        authToken: action.authToken,
                        authTokenSecret: action.authTokenSecret,
                        isSignedIn: true,
                        isLoading: false,
                    };
                case 'AUTH_DISCOGS_ERROR':
                    return {
                        ...prevState,
                        requestToken: null,
                        requestTokenSecret: null,
                        authToken: null,
                        authTokenSecret: null,
                        userData: null,
                        isLoading: false,
                    };
                case 'SIGN_OUT':
                    return {
                        ...prevState,
                        isSignedIn: false,
                        requestToken: action.requestToken,
                        requestTokenSecret: action.requestTokenSecret,
                        authToken: null,
                        authTokenSecret: null,
                        userData: null,
                    };
            }
        },
        {
            isLoading: true,
            isSignedIn: false,
            requestToken: null,
            requestTokenSecret: null,
            authToken: null,
            authTokenSecret: null,
            userData: null,
        }
    );

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

        // Fetch the token from storage then navigate to our appropriate place
        const bootstrapAsync = async () => {
            let requestToken;
            let requestTokenSecret;
            let authToken;
            let authTokenSecret;
            let userData;

            try {
                requestToken = await AsyncStorage.getItem('requestToken');
                requestTokenSecret = await AsyncStorage.getItem('requestTokenSecret');
                authToken = await AsyncStorage.getItem('authToken');
                authTokenSecret = await AsyncStorage.getItem('authTokenSecret');
                userData = await AsyncStorage.getItem('userData');
            } catch (e) {
                // Restoring token failed
            }

            if (!requestToken) {
                getDiscogsToken();
            }

            dispatch({ type: 'RESTORE_TOKEN', requestToken: requestToken, requestTokenSecret: requestTokenSecret, token: authToken, tokenSecret: authTokenSecret, userData: userData });
        };

        bootstrapAsync();
    }, [])

    const getDiscogsToken = async () => {
        let newToken;
        let newTokenSecret;

        const getToken = async () => {
            let response = await fetch('https://api.discogs.com/oauth/request_token', {
                method: 'POST',
                headers: {
                    'Content-type': 'application/x-www-form-urlencoded',
                    Authorization: `OAuth oauth_consumer_key="${CONSUMER_KEY}", oauth_nonce="${makeid(
                        10
                    )}", oauth_signature="${CONSUMER_SECRET}&", oauth_signature_method="PLAINTEXT", oauth_timestamp="${timestamp}", oauth_callback="https://auth.expo.io/@paulbremer/vinylooo", oauth_callback_confirmed="true"`
                }
            })
            let data = await response.text()
            return data
        }

        // 2. SEND A GET REQUEST TO THE DISCOGS REQUEST TOKEN URL
        await getToken()
            .then(async (data) => {
                console.log('getDiscogsToken 2# ', data)
                const token = data.match('oauth_token=(.*)&oauth_token_secret')[1]
                const tokenSecret = data.match('oauth_token_secret=(.*)&oauth_callback_confirmed=true')[1]
                storeData('requestToken', token)
                storeData('requestTokenSecret', tokenSecret)
                newToken = token
                newTokenSecret = tokenSecret
            })
            .catch((err) => console.log(err))

        return { newToken, newTokenSecret }
    }

    const getIdentity = async (token, secret) => {
        console.log('getIdentity', token, secret)

        try {
            if (token !== null && secret !== null) {
                fetch('https://api.discogs.com/oauth/identity', {
                    method: 'GET',
                    headers: {
                        'Content-type': 'application/x-www-form-urlencoded',
                        Authorization: `OAuth oauth_consumer_key="${CONSUMER_KEY}",oauth_token="${token}", oauth_signature_method="PLAINTEXT",oauth_timestamp="${timestamp}", oauth_nonce="${makeid(
                            10
                        )}", oauth_version="1.0", oauth_signature="${CONSUMER_SECRET}%26${secret}`
                    }
                })
                    .then(async (data) => {
                        let json = await data.json()
                        if (json.username) {
                            storeData('username', json.username)
                            getUserInfo(token, secret)
                        } else {
                            console.log('heb geen username dus')
                            Toast.show({ type: 'error', text1: 'No user found', text2: 'This is some something 👋', visibilityTime: 4000, })
                            storeData('token', '')
                            storeData('secret', '')
                        }
                    })
                    .catch((err) => console.log(err))
            }
        } catch (error) {
            console.error(error)
        }
    }

    const getUserInfo = async (token, secret) => {
        console.log('getUserInfo', token, secret)
        try {
            if (token !== null && secret !== null) {
                fetch('https://api.discogs.com/users/paaaaaaaaaaul', {
                    method: 'GET',
                    headers: {
                        'Content-type': 'application/x-www-form-urlencoded',
                        Authorization: `OAuth oauth_consumer_key="${CONSUMER_KEY}",oauth_token="${token}", oauth_signature_method="PLAINTEXT",oauth_timestamp="${timestamp}", oauth_nonce="${makeid(
                            10
                        )}", oauth_version="1.0", oauth_signature="${CONSUMER_SECRET}%26${secret}`
                    }
                })
                    .then(async (data) => {
                        let json = await data.json()
                        console.log('💪🏼 ', json.username)
                        storeObject('userData', json)
                        // setUserInfo({ ...json, ...userInfo })
                        // setLoadedUserInfo(true)
                        // getCollectionValue(token, secret)
                    })
                    .catch((err) => console.error(err))
            }
        } catch (error) {
            console.error(error)
        }
    }

    const discogsAuth = async () => {
        if (!state.requestToken) {
            dispatch({ type: 'AUTH_DISCOGS_ERROR' })

            getDiscogsToken();

            Toast.show({
                type: 'error', position: 'bottom', topOffset: 0,
                bottomOffset: 0, text1: 'No requestToken', text2: 'This is broken, sorry 👋', visibilityTime: 4000,
            })
            return
        }

        // 3. REDIRECT YOUR USER TO THE DISCOGS AUTHORIZE PAGE
        let results = await AuthSession.startAsync({
            authUrl: `https://discogs.com/oauth/authorize?oauth_token=${state.requestToken}`
        })

        if (results.type === 'success') {
            await fetch('https://api.discogs.com/oauth/access_token', {
                method: 'POST',
                headers: {
                    'Content-type': 'application/x-www-form-urlencoded',
                    Authorization: `OAuth oauth_consumer_key="${CONSUMER_KEY}", oauth_nonce="${makeid(
                        10
                    )}", oauth_token="${results.params.oauth_token
                        }", oauth_signature="${CONSUMER_SECRET}&${state.requestTokenSecret}", oauth_signature_method="PLAINTEXT", oauth_timestamp="${timestamp}", oauth_verifier="${results.params.oauth_verifier
                        }"`
                }
            })
                .then(async (response) => {
                    let data = await response.text()
                    console.log('4# ', data)

                    if (response.status === 200) {
                        const finalToken = data.match('oauth_token=(.*)&oauth_token_secret')[1]
                        const finalTokenSecret = data.match('oauth_token_secret=(.*)')[1]

                        storeData('token', finalToken)
                        storeData('secret', finalTokenSecret)
                        await AsyncStorage.setItem('authToken', finalToken);
                        await AsyncStorage.setItem('authTokenSecret', finalTokenSecret);

                        await getIdentity(finalToken, finalTokenSecret)

                        dispatch({ type: 'AUTH_DISCOGS_SUCCESS', authToken: finalToken, authTokenSecret: finalTokenSecret })
                    }
                })
                .catch((err) => console.log(err))

            // try {
            //     await AsyncStorage.setItem('authToken', results.params.oauth_token);
            // } catch (e) {
            //     // Setting token failed
            // }
        } else {
            dispatch({ type: 'AUTH_DISCOGS_ERROR' })
        }
    }

    // In a production app, we need to send some data (usually username, password) to server and get a token
    // We will also need to handle errors if sign in failed
    // After getting token, we need to persist the token using `AsyncStorage`
    const authContextValue = useMemo(
        () => ({
            authDiscogs: async () => {
                dispatch({ type: 'AUTH_DISCOGS_INIT' })
                await discogsAuth();
            },
            signOut: async () => {
                removeData('requestToken')
                removeData('requestTokenSecret')
                removeData('authToken')
                removeData('authTokenSecret')
                removeData('userData')

                const { newToken, newTokenSecret } = await getDiscogsToken();

                dispatch({ type: 'SIGN_OUT', requestToken: newToken, requestTokenSecret: newTokenSecret });
            },
        }),
        [state],
    );

    if (!fontsLoaded) {
        return (
            <View>
                <Text>loading...</Text>
            </View>
        )
    }

    return (
        <AuthContext.Provider value={authContextValue}>
            <Provider store={store}>
                <NavigationContainer>
                    <Stack.Navigator mode="modal">
                        {state.isLoading ? (
                            <Stack.Screen name="Splash" component={SplashScreen} />
                        ) : state.authToken === null ? (
                            <Stack.Screen
                                name="SignIn"
                                component={ConnectScreen}
                                options={{
                                    title: 'Connect',
                                    animationTypeForReplace: state.isSignedIn ? 'push' : 'pop',
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
    )
}
