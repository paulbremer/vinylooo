import React from 'react'
import { render, cleanup, fireEvent } from 'react-native-testing-library'
import AlbumListItem from '../AlbumListItem'

afterEach(cleanup)

describe('<AlbumListItem />', () => {
    it('should match snapshot', () => {
        const rendered = render(
            <AlbumListItem
                artist="Mac Miller"
                title="The Divine Feminine"
                image="https://media.s-bol.com/BgzwB02ADm5k/550x498.jpg"
            />
        ).toJSON()

        expect(rendered).toMatchSnapshot()
    })
})
