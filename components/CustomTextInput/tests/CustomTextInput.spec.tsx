import React from 'react'
import { render, cleanup, fireEvent } from 'react-native-testing-library'
import CustomTextInput from '../CustomTextInput'

afterEach(cleanup)

describe('<CustomTextInput />', () => {
    it('should match snapshot', () => {
        const rendered = render(<CustomTextInput />).toJSON()

        expect(rendered).toMatchSnapshot()
    })
})
