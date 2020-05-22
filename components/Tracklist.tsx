import React from 'react'
import { View, Text, StyleSheet } from 'react-native'
import Colors from '../constants/Colors'

const Tracklist = ({ tracklist }) => {
    tracklist.map((track, index) => {
        track.index = index + 1
    })

    const tracklistA = tracklist.filter((track) => track.position.startsWith('A'))
    const tracklistB = tracklist.filter((track) => track.position.startsWith('B'))
    const tracklistC = tracklist.filter((track) => track.position.startsWith('C'))
    const tracklistD = tracklist.filter((track) => track.position.startsWith('D'))

    return (
        <View style={styles.wrapper}>
            {tracklistA.length > 0 && (
                <>
                    <Text style={styles.title}>Tracklist A side</Text>
                    <View style={styles.subtitle}>
                        <Text style={styles.subtitleText}>#</Text>
                        <Text style={styles.subtitleText}>Title</Text>
                    </View>
                    {tracklistA.map((track) => (
                        <View style={styles.trackWrapper} key={track.position}>
                            <View style={styles.trackContainer}>
                                <Text style={styles.trackIndex}>{track.position}</Text>
                                <Text style={styles.trackTitle}>{track.title}</Text>
                            </View>
                            <View>
                                <Text style={styles.trackTitle}>{track.duration}</Text>
                            </View>
                        </View>
                    ))}
                </>
            )}
            {tracklistB.length > 0 && (
                <>
                    <Text style={styles.title}>Tracklist B side</Text>
                    <View style={styles.subtitle}>
                        <Text style={styles.subtitleText}>#</Text>
                        <Text style={styles.subtitleText}>Title</Text>
                    </View>
                    {tracklistB.map((track) => (
                        <View style={styles.trackWrapper} key={track.position}>
                            <View style={styles.trackContainer}>
                                <Text style={styles.trackIndex}>{track.position}</Text>
                                <Text style={styles.trackTitle}>{track.title}</Text>
                            </View>
                            <View>
                                <Text style={styles.trackTitle}>{track.duration}</Text>
                            </View>
                        </View>
                    ))}
                </>
            )}
            {tracklistC.length > 0 && (
                <>
                    <Text style={styles.title}>Tracklist C side</Text>
                    <View style={styles.subtitle}>
                        <Text style={styles.subtitleText}>#</Text>
                        <Text style={styles.subtitleText}>Title</Text>
                    </View>
                    {tracklistC.map((track) => (
                        <View style={styles.trackWrapper} key={track.position}>
                            <View style={styles.trackContainer}>
                                <Text style={styles.trackIndex}>{track.position}</Text>
                                <Text style={styles.trackTitle}>{track.title}</Text>
                            </View>
                            <View>
                                <Text style={styles.trackTitle}>{track.duration}</Text>
                            </View>
                        </View>
                    ))}
                </>
            )}
            {tracklistD.length > 0 && (
                <>
                    <Text style={styles.title}>Tracklist D side</Text>
                    <View style={styles.subtitle}>
                        <Text style={styles.subtitleText}>#</Text>
                        <Text style={styles.subtitleText}>Title</Text>
                    </View>
                    {tracklistD.map((track) => (
                        <View style={styles.trackWrapper} key={track.position}>
                            <View style={styles.trackContainer}>
                                <Text style={styles.trackIndex}>{track.position}</Text>
                                <Text style={styles.trackTitle}>{track.title}</Text>
                            </View>
                            <View>
                                <Text style={styles.trackTitle}>{track.duration}</Text>
                            </View>
                        </View>
                    ))}
                </>
            )}
        </View>
    )
}

const styles = StyleSheet.create({
    wrapper: {
        width: '100%',
        padding: 24,
        paddingTop: 8
    },
    title: {
        fontFamily: 'kulimpark-bold',
        color: Colors.darkPurple,
        fontSize: 16,
        marginTop: 24,
        marginBottom: 8
    },
    subtitle: {
        justifyContent: 'flex-start',
        flexDirection: 'row',
        marginBottom: 16
    },
    subtitleText: {
        fontFamily: 'kulimpark-regular',
        color: Colors.grey,
        minWidth: 20,
        marginRight: 10
    },
    trackWrapper: {
        justifyContent: 'space-between',
        alignItems: 'center',
        flexDirection: 'row',
        marginBottom: 8
    },
    trackContainer: {
        flexDirection: 'row'
    },
    trackIndex: {
        fontFamily: 'kulimpark-regular',
        color: Colors.grey,
        width: 20,
        marginRight: 10
    },
    trackTitle: {
        fontFamily: 'kulimpark-bold',
        color: Colors.purple
    }
})

export default Tracklist
