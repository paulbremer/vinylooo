import React, { useState, useEffect } from 'react'
import * as AuthSession from 'expo-auth-session'
import { Text, View, TouchableOpacity, AsyncStorage } from 'react-native'
import { createStackNavigator } from '@react-navigation/stack'

const AccountStack = createStackNavigator()

const CONSUMER_KEY = 'tILfDjLHXNBVjcVQthxa'
const CONSUMER_SECRET = 'KIIXTQskHkIifimxKtedzTKnBSNigSZL'
const timestamp = Date.now()

function makeid(length) {
    var result = ''
    var characters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789'
    var charactersLength = characters.length
    for (var i = 0; i < length; i++) {
        result += characters.charAt(Math.floor(Math.random() * charactersLength))
    }
    return result
}

const storeData = async (key, value) => {
    try {
        await AsyncStorage.setItem(key, value)
    } catch (error) {
        console.log('🚨 ', error)
    }
}

function AccountScreen() {
    const [userInfo, setUserInfo] = useState({})
    const [requestToken, setRequestToken] = useState('')
    const [requestTokenSecret, setRequestTokenSecret] = useState('')
    const [oauthToken, setOauthToken] = useState('')
    const [oauthTokenSecret, setOauthTokenSecret] = useState('')
    const [oauthVerifier, setOauthVerifier] = useState('')
    const [error, setError] = useState(false)

    useEffect(() => {
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
        getToken()
            .then((data) => {
                console.log('2# ', data)
                const token = data.match('oauth_token=(.*)&oauth_token_secret')[1]
                const tokenSecret = data.match('oauth_token_secret=(.*)&oauth_callback_confirmed=true')[1]
                setRequestToken(token)
                setRequestTokenSecret(tokenSecret)
            })
            .catch((err) => console.log(err))
    }, [])

    const handleDiscogsLogin = async () => {
        console.log('handleDiscogsLogin')
        // 3. REDIRECT YOUR USER TO THE DISCOGS AUTHORIZE PAGE
        let results = await AuthSession.startAsync({
            authUrl: `https://discogs.com/oauth/authorize?oauth_token=${requestToken}`
        })
        console.log('3# ', results)

        if (results.type !== 'cancel') {
            setOauthToken(results.params.oauth_token)
            setOauthVerifier(results.params.oauth_verifier)

            // 4. SEND A POST REQUEST TO THE DISCOGS ACCESS TOKEN URL
            let response = await fetch('https://api.discogs.com/oauth/access_token', {
                method: 'POST',
                headers: {
                    'Content-type': 'application/x-www-form-urlencoded',
                    Authorization: `OAuth oauth_consumer_key="${CONSUMER_KEY}", oauth_nonce="${makeid(
                        10
                    )}", oauth_token="${
                        results.params.oauth_token
                    }", oauth_signature="${CONSUMER_SECRET}&${requestTokenSecret}", oauth_signature_method="PLAINTEXT", oauth_timestamp="${timestamp}", oauth_verifier="${
                        results.params.oauth_verifier
                    }"`
                }
            })
                .then(async (response) => {
                    console.log('🔥 ', response.status)
                    let data = await response.text()
                    console.log('4# ', data)

                    if (response.status === 200) {
                        const finalToken = data.match('oauth_token=(.*)&oauth_token_secret')[1]
                        const finalTokenSecret = data.match('oauth_token_secret=(.*)')[1]

                        console.log(finalToken)
                        console.log(finalTokenSecret)

                        storeData('token', finalToken)
                        storeData('secret', finalTokenSecret)
                        storeData('discogsActive', true)

                        getUserInfo()
                    }
                })
                .catch((err) => console.log(err))
        }
    }

    const getUserInfo = async () => {
        console.log('getUserInfo')

        try {
            const token = await AsyncStorage.getItem('token')
            const secret = await AsyncStorage.getItem('secret')
            if (token !== null && secret !== null) {
                console.log('🐛 ', token, secret)

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
                        console.log(json)
                        setUserInfo(json)
                    })
                    .catch((err) => console.log(err))
            }
        } catch (error) {
            console.error(error)
        }
    }

    return (
        <View
            style={{
                flex: 1,
                justifyContent: 'space-between',
                alignItems: 'center',
                padding: 24,
                backgroundColor: '#fcfcfc'
            }}
        >
            <Text>Account</Text>
            <TouchableOpacity onPress={handleDiscogsLogin} disabled={requestToken ? false : true}>
                <Text>Login with Discogs</Text>
            </TouchableOpacity>

            <View>
                <Text>Request Token: {requestToken}</Text>
                <Text>OAuth Token: {oauthToken}</Text>
                <Text>User ID: {userInfo.id}</Text>
                <Text>Username: {userInfo.username}</Text>

                <TouchableOpacity onPress={getUserInfo}>
                    <Text>Get User Info</Text>
                </TouchableOpacity>
            </View>

            <Text>Version 0.13</Text>
        </View>
    )
}

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
