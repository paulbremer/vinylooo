import React, { useState, useEffect } from 'react'
import { ScrollView, View, Text } from 'react-native'
import { useSelector, useDispatch } from 'react-redux'
import DiscoverAlbum from '../components/DiscoverAlbum'
import * as albumsActions from '../store/actions/albums'

const Discover = () => {
    const [relatedArtists, setRelatedArtists] = useState([])
    const [randomArtist, setRandomArtist] = useState([])
    const albums = useSelector((state) => state.albums.albums)
    const dispatch = useDispatch()
    let randomAlbum

    useEffect(() => {
        dispatch(albumsActions.setAlbums())
        setRelatedArtists([])

        if (albums.length > 0) {
            randomAlbum = albums[Math.floor(Math.random() * albums.length)]

            // console.log(randomAlbum.title, randomAlbum.artistName);
            setRandomArtist(randomAlbum.artistName)
            // LAST FM API => b9bf0fc713d9e05b590f64fb53ec1e9c
            // Find similar artists with Last.fm
            // https://ws.audioscrobbler.com/2.0/?method=artist.getsimilar&artist=Kendrick%20Lamar&api_key=b9bf0fc713d9e05b590f64fb53ec1e9c&format=json

            // NAPSTER API
            // http://api.napster.com/v2.2/search?apikey=YTkxZTRhNzAtODdlNy00ZjMzLTg0MWItOTc0NmZmNjU4Yzk4&per_type_limit=5&type=album&query=damn%20kendrick%20lamar

            const fetchRelatedArtists = async (artistNapsterId) => {
                let response = await fetch(
                    `http://api.napster.com/v2.2/artists/${artistNapsterId}/similar?apikey=YTkxZTRhNzAtODdlNy00ZjMzLTg0MWItOTc0NmZmNjU4Yzk4&limit=10`
                )
                let data = await response.json()
                if (data.artists && data.artists.length > 0) {
                    setRelatedArtists(data.artists.slice(0, 5))
                }
            }

            const fetchArtistId = async () => {
                let response = await fetch(
                    `http://api.napster.com/v2.2/search?apikey=YTkxZTRhNzAtODdlNy00ZjMzLTg0MWItOTc0NmZmNjU4Yzk4&limit=5&type=album&query=${randomAlbum.title}%20${randomAlbum.artistName}`
                )
                let data = await response.json()
                const artistNapsterId =
                    data &&
                    data.search &&
                    data.search.data &&
                    data.search.data.albums.length > 0 &&
                    data.search.data.albums[0].discographies &&
                    data.search.data.albums[0].discographies.main &&
                    data.search.data.albums[0].discographies.main.length > 0 &&
                    data.search.data.albums[0].discographies.main[0]
                if (artistNapsterId) {
                    fetchRelatedArtists(artistNapsterId)
                }
                return artistNapsterId
            }

            fetchArtistId()
        }
    }, [dispatch])

    return (
        <View
            style={{
                flex: 1,
                justifyContent: 'center',
                backgroundColor: '#fff',
                marginVertical: 16,
                marginHorizontal: 24
            }}
        >
            {randomArtist && relatedArtists.length > 0 && <Text style={{}}>Because you liked {randomArtist}</Text>}

            <ScrollView horizontal={true}>
                {relatedArtists &&
                    relatedArtists.map((artist) => {
                        return <DiscoverAlbum key={artist.id} albumId={artist.albumGroups.main[0]} />
                    })}
            </ScrollView>
        </View>
    )
}

export default Discover
