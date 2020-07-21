import React from 'react'
import { render, cleanup, fireEvent } from 'react-native-testing-library'
import DiscoverAlbum from '../DiscoverAlbum'

afterEach(cleanup)

describe('<DiscoverAlbum />', () => {
    it('should match snapshot', () => {
        const rendered = render(<DiscoverAlbum albumId={180000} />).toJSON()

        expect(rendered).toMatchSnapshot()
    })
})
