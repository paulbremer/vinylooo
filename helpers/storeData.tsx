import AsyncStorage from '@react-native-community/async-storage'

export const getData = async (key) => {
    try {
        const result = await AsyncStorage.getItem(key)
        return result;
    } catch (error) {
        console.log('🚨 ', error)
    }
}

export const storeData = async (key, value) => {
    try {
        await AsyncStorage.setItem(key, value)
    } catch (error) {
        console.log('🚨 ', error)
    }
}

export const removeData = async (key) => {
    try {
        await AsyncStorage.removeItem(key)
    } catch (error) {
        console.log('🚨 ', error)
    }
}

export const storeObject = async (key, value) => {
    try {
        const jsonValue = JSON.stringify(value)
        await AsyncStorage.setItem(key, jsonValue)
    } catch (error) {
        console.error(error)
    }
}
