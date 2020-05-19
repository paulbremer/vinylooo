import { useState, useEffect } from 'react'
import { AsyncStorage } from 'react-native'

const CONSUMER_KEY = 'tILfDjLHXNBVjcVQthxa'
const CONSUMER_SECRET = 'KIIXTQskHkIifimxKtedzTKnBSNigSZL'
const timestamp = Date.now()

const useAuthFetch = (url, options) => {
    const [response, setResponse] = useState(null)
    const [error, setError] = useState(null)

    useEffect(() => {
        const fetchData = async () => {
            try {
                const token = await AsyncStorage.getItem('token')
                const secret = await AsyncStorage.getItem('secret')

                const res = await fetch(url, {
                    method: 'GET',
                    headers: {
                        'Content-type': 'application/x-www-form-urlencoded',
                        Authorization: `OAuth oauth_consumer_key="${CONSUMER_KEY}",oauth_token="${token}", oauth_signature_method="PLAINTEXT",oauth_timestamp="${timestamp}", oauth_nonce="$qwertyuiop", oauth_version="1.0", oauth_signature="${CONSUMER_SECRET}%26${secret}`
                    },
                    ...options
                })
                const json = await res.json()
                setResponse(json)
            } catch (error) {
                console.log('🚨 ', error)
                setError(error)
            }
        }

        fetchData()
    }, [])
    return { response, error }
}

export default useAuthFetch
