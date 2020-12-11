import React, { useState, useEffect } from 'react'
import * as AuthSession from 'expo-auth-session'
import Toast from 'react-native-toast-message'
import { Text, Image, View, FlatList, TouchableOpacity, AsyncStorage, StyleSheet } from 'react-native'
import makeid from '../helpers/nonce'
import { storeData, storeObject } from '../helpers/storeData'
import Loader from '../components/Loader/Loader'
import CustomIcon from '../components/CustomIcon/CustomIcon'

const CONSUMER_KEY = 'tILfDjLHXNBVjcVQthxa'
const CONSUMER_SECRET = 'KIIXTQskHkIifimxKtedzTKnBSNigSZL'
const timestamp = Date.now()

const AccountScreen = () => {
    const [userInfo, setUserInfo] = useState({})
    const [loadedUserInfo, setLoadedUserInfo] = useState(false)
    const [collectionValue, setCollectionValue] = useState({})
    const [requestToken, setRequestToken] = useState('')
    const [requestTokenSecret, setRequestTokenSecret] = useState('')

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

        const fetchUserData = async () => {
            const token = await AsyncStorage.getItem('token')
            const secret = await AsyncStorage.getItem('secret')
            console.log('😎 fetchUserData', token, secret)
            if (token !== null && secret !== null) {
                console.log('😎 user has token')
                setRequestToken(token)
                setRequestTokenSecret(secret)
                getIdentity(token, secret)
            } else {
                getIdentity(requestToken, requestTokenSecret)
            }
        }
        fetchUserData()
    }, [])

    const handleDiscogsLogin = async () => {
        console.log('handleDiscogsLogin')
        // 3. REDIRECT YOUR USER TO THE DISCOGS AUTHORIZE PAGE
        let results = await AuthSession.startAsync({
            authUrl: `https://discogs.com/oauth/authorize?oauth_token=${requestToken}`
        })
        console.log('3# ', results)

        if (results.type !== 'cancel') {
            // 4. SEND A POST REQUEST TO THE DISCOGS ACCESS TOKEN URL
            await fetch('https://api.discogs.com/oauth/access_token', {
                method: 'POST',
                headers: {
                    'Content-type': 'application/x-www-form-urlencoded',
                    Authorization: `OAuth oauth_consumer_key="${CONSUMER_KEY}", oauth_nonce="${makeid(
                        10
                    )}", oauth_token="${results.params.oauth_token
                        }", oauth_signature="${CONSUMER_SECRET}&${requestTokenSecret}", oauth_signature_method="PLAINTEXT", oauth_timestamp="${timestamp}", oauth_verifier="${results.params.oauth_verifier
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
                        storeData('discogsActive', 'true')

                        getIdentity(finalToken, finalTokenSecret)
                    }
                })
                .catch((err) => console.log(err))
        }
    }

    const getIdentity = async (token, secret) => {
        console.log('getIdentity', token, secret)

        try {
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
                        console.log('🔥 ', json)
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
                        setUserInfo({ ...json, ...userInfo })
                        setLoadedUserInfo(true)
                        getCollectionValue(token, secret)
                    })
                    .catch((err) => console.error(err))
            }
        } catch (error) {
            console.error(error)
        }
    }

    const getCollectionValue = async (token, secret) => {
        try {
            if (token !== null && secret !== null) {
                fetch('https://api.discogs.com/users/paaaaaaaaaaul/collection/value', {
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
                        setCollectionValue(json)
                    })
                    .catch((err) => console.error(err))
            }
        } catch (error) {
            console.error(error)
        }
    }

    const logOut = () => {
        setUserInfo({})
        setCollectionValue({})
        storeData('token', '')
        storeData('secret', '')
        storeData('username', '')
        storeObject('userData', {})
    }

    const accountList = [
        {
            id: '1',
            title: 'Terms of Service',
        },
        {
            id: '2',
            title: 'Log out',
            function: logOut
        },
    ];

    const Item = ({ title, itemFunction }) => (
        <TouchableOpacity style={styles.listItem} onPress={itemFunction}>
            <Text style={styles.listText}>{title}</Text>
            <CustomIcon name="link" color="#000000" style={{ marginLeft: 24 }} />
        </TouchableOpacity>
    );

    const toastConfig = {
        'error': (internalState) => (
            <View style={{ backgroundColor: '#000000', padding: 12, borderRadius: 8, minWidth: '80%', textAlign: 'center ' }}>
                <Text style={{ color: '#ffffff' }}>{internalState.text1}</Text>
            </View>
        ),
    }


    if (!loadedUserInfo) {
        return <View>
            <Toast config={toastConfig} ref={(ref) => Toast.setRef(ref)} />
            <Loader />
        </View>
    }

    return (
        <View
            style={{
                flex: 1,
                justifyContent: 'space-between',
                backgroundColor: '#fcfcfc'
            }}
        >
            {Object.keys(userInfo).length === 0 && (
                <TouchableOpacity onPress={handleDiscogsLogin} disabled={requestToken ? false : true}>
                    <Text>Login with Discogs</Text>
                </TouchableOpacity>
            )}

            <View>
                {Object.keys(userInfo).length !== 0 && (
                    <>
                        <View style={{
                            marginBottom: 24, alignItems: 'center', padding: 24,
                        }}>
                            <Image
                                style={{ width: 150, height: 150, borderRadius: 150, marginBottom: 24 }}
                                source={{ uri: userInfo.avatar_url }}
                            />
                            <Text style={styles.username}>{userInfo.username}</Text>
                        </View>

                        {accountList.map(listItem => <Item key={listItem.id} title={listItem.title} itemFunction={listItem.function} />)}

                        {/* <Text>id: {userInfo.id}</Text>
                            <Text>location: {userInfo.location}</Text>
                            <Text>releases_rated: {userInfo.releases_rated}</Text>
                            <Text>rating_avg: {userInfo.rating_avg}</Text>
                            <Text>num_collection: {userInfo.num_collection}</Text>
                            <Text>num_wantlist: {userInfo.num_wantlist}</Text>
                            {collectionValue.median && <Text>collection_value: {collectionValue.median}</Text>}
                        */}
                    </>
                )}
            </View>

            <Text style={styles.version}>Version 0.16</Text>
        </View>
    )
}

const styles = StyleSheet.create({
    username: {
        fontFamily: 'kulimpark-regular',
        fontSize: 18
    },
    listContainer: {
        width: '100%'
    },
    listItem: {
        backgroundColor: '#fff',
        padding: 24,
        justifyContent: 'space-between',
        flexDirection: 'row',
        borderBottomColor: '#f5f5f5',
        borderBottomWidth: 1,
    },
    listText: {
        color: '#000',
        fontFamily: 'kulimpark-regular'
    },
    version: {
        textAlign: 'center',
        padding: 24,
        fontFamily: 'kulimpark-regular'
    }
})

export default AccountScreen
