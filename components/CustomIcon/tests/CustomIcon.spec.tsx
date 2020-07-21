import React from 'react'
import { render, cleanup, fireEvent } from 'react-native-testing-library'
import CustomIcon from '../CustomIcon'

afterEach(cleanup)

describe('<CustomIcon />', () => {
    it('should match snapshot', () => {
        const rendered = render(
            <CustomIcon
                name="link"
                color="#ffffff"
                onPress={() => {
                    console.log('onPress')
                }}
            />
        ).toJSON()

        expect(rendered).toMatchSnapshot()
    })
})
