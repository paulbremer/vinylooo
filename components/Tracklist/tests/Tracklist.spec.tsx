import React from 'react'
import { render, cleanup, fireEvent } from 'react-native-testing-library'
import Tracklist from '../Tracklist'

afterEach(cleanup)

describe('<Tracklist />', () => {
    it('should match snapshot', () => {
        const rendered = render(<Tracklist tracklist={[]} />).toJSON()

        expect(rendered).toMatchSnapshot()
    })
})
