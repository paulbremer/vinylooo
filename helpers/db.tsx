import * as SQLite from 'expo-sqlite'

const db = SQLite.openDatabase('albums.db')

export const init = () => {
    const promise = new Promise((resolve, reject) => {
        db.transaction((tx) => {
            tx.executeSql(
                'CREATE TABLE IF NOT EXISTS albums (id INTEGER PRIMARY KEY NOT NULL, title TEXT NOT NULL, discogsId INTEGER NOT NULL, artistName TEXT NOT NULL, cover_image TEXT NOT NULL, addedAt TEXT NOT NULL);',
                [],
                () => {
                    resolve()
                },
                (_, err) => {
                    reject(err)
                }
            )
            tx.executeSql(
                'CREATE TABLE IF NOT EXISTS wantlist (id INTEGER PRIMARY KEY NOT NULL, title TEXT NOT NULL, discogsId INTEGER NOT NULL, artistName TEXT NOT NULL, cover_image TEXT NOT NULL, addedAt TEXT NOT NULL);',
                [],
                () => {
                    resolve()
                },
                (_, err) => {
                    reject(err)
                }
            )
        })
    })
    return promise
}

export const insertAlbum = (title, id, artist, cover_image, addedAt) => {
    console.log('insertAlbum', title, id, artist, cover_image, addedAt)
    const promise = new Promise((resolve, reject) => {
        db.transaction((tx) => {
            tx.executeSql(
                'INSERT INTO albums (title, discogsId, artistName, cover_image, addedAt) VALUES (?, ?, ?, ?, ?)',
                [title, id, artist, cover_image, addedAt],
                (_, result) => {
                    resolve(result)
                },
                (_, err) => {
                    reject(err)
                }
            )
        })
    })
    return promise
}

export const removeAlbumFromDatabase = (albumId) => {
    const promise = new Promise((resolve, reject) => {
        db.transaction((tx) => {
            tx.executeSql(
                `DELETE FROM albums WHERE id = ?`,
                [albumId],
                (_, result) => {
                    resolve(result)
                },
                (_, err) => {
                    reject(err)
                }
            )
        })
    })
    return promise
}

export const fetchAlbums = () => {
    const promise = new Promise((resolve, reject) => {
        db.transaction((tx) => {
            tx.executeSql(
                'SELECT * FROM albums',
                [],
                (_, result) => {
                    resolve(result)
                },
                (_, err) => {
                    reject(err)
                }
            )
        })
    })
    return promise
}

export const fetchWantlist = () => {
    const promise = new Promise((resolve, reject) => {
        db.transaction((tx) => {
            tx.executeSql(
                'SELECT * FROM wantlist',
                [],
                (_, result) => {
                    resolve(result)
                },
                (_, err) => {
                    reject(err)
                }
            )
        })
    })
    return promise
}
