import React, { useState, useEffect } from 'react'
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native'
import { useSelector, useDispatch } from 'react-redux'
import { DrawerActions } from '@react-navigation/native'
import CustomIcon from '../components/CustomIcon'
import Colors from '../constants/Colors'
import { setSorting } from '../store/actions/albums'
import { setSorting as setWantlistSorting } from '../store/actions/wantlist'

const Sorting = ({ from, navigation }) => {
    const sorting = useSelector((state) => state.albums.sorting)
    const [sortOption, setSortOption] = useState(sorting)
    const dispatch = useDispatch()

    console.log('render sorting for ', from)

    const updateSortOption = (option) => {
        setSortOption(option)
        navigation.dispatch(DrawerActions.closeDrawer())
    }

    useEffect(() => {
        if (from === 'collection') {
            dispatch(setSorting(sortOption))
        } else {
            dispatch(setWantlistSorting(sortOption))
        }
    }, [sortOption])

    return (
        <View style={styles.screen}>
            <Text style={styles.title}>Sorted by</Text>

            <TouchableOpacity style={styles.sortOption} onPress={() => updateSortOption('artist')}>
                <Text style={styles.text}>Artist (A-Z)</Text>
                {sortOption === 'artist' && <CustomIcon name="check" size={20} />}
            </TouchableOpacity>
            <TouchableOpacity style={styles.sortOption} onPress={() => updateSortOption('title')}>
                <Text style={styles.text}>Title (A-Z)</Text>
                {sortOption === 'title' && <CustomIcon name="check" size={20} />}
            </TouchableOpacity>
            <TouchableOpacity style={styles.sortOption} onPress={() => updateSortOption('date')}>
                <Text style={styles.text}>Date Added</Text>
                {sortOption === 'date' && <CustomIcon name="check" size={20} />}
            </TouchableOpacity>
        </View>
    )
}

const styles = StyleSheet.create({
    screen: {
        flex: 1,
        margin: 20
    },
    title: {
        fontFamily: 'kulimpark-bold',
        fontSize: 16,
        marginBottom: 16
    },
    sortOption: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        paddingVertical: 8,
        minHeight: 48,
        borderBottomColor: Colors.grey,
        borderBottomWidth: 1
    },
    text: {
        fontFamily: 'kulimpark-regular'
    },
    filterContainer: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        width: '80%',
        marginVertical: 10
    }
})

export default Sorting
