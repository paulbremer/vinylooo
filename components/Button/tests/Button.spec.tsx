import React from 'react'
import { render, cleanup, fireEvent } from 'react-native-testing-library'
import Button from '../Button'

afterEach(cleanup)

describe('<Button />', () => {
    it('should match snapshot', () => {
        const rendered = render(<Button title="Custom Buttom" />).toJSON()

        expect(rendered).toMatchSnapshot()
    })
})
