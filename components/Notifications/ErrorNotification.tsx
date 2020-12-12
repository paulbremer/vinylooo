import React from 'react'
import { View, Text } from 'react-native'

const ErrorNotification = ({ children }) => {
    return (
        <View style={{ backgroundColor: '#000000', padding: 12, borderRadius: 8, minWidth: '80%', textAlign: 'center ' }}>
            <Text style={{ color: '#ffffff' }}>{children}</Text>
        </View>
    )
}

export default ErrorNotification
