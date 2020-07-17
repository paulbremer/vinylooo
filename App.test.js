import React from 'react'
import { render, cleanup, fireEvent } from 'react-native-testing-library'
import App from './App'

afterEach(cleanup)

describe('<App />', () => {
    it('should match snapshot', () => {
        const rendered = render(<App />).toJSON()

        expect(rendered).toMatchSnapshot()
    })
})
