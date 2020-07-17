import React from 'react'
import { TouchableOpacity, Text, StyleSheet } from 'react-native'
import Colors from '../../constants/Colors'

const CustomButton = ({ title, onPress }) => {
    return (
        <TouchableOpacity onPress={onPress} style={styles.buttonWrapper}>
            <Text style={styles.buttonText}>{title}</Text>
        </TouchableOpacity>
    )
}

const styles = StyleSheet.create({
    buttonWrapper: {
        backgroundColor: Colors.primaryColor,
        borderRadius: 4,
        paddingVertical: 16
    },
    buttonText: {
        color: '#fff',
        textAlign: 'center',
        fontFamily: 'kulimpark-bold',
        fontSize: 16
    }
})

export default CustomButton
