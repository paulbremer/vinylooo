import React from 'react'
import { render, cleanup, fireEvent } from 'react-native-testing-library'
import CameraOverlay from '../CameraOverlay'

afterEach(cleanup)

describe('<CameraOverlay />', () => {
    it('should match snapshot', () => {
        const rendered = render(<CameraOverlay loading={true} />).toJSON()

        expect(rendered).toMatchSnapshot()
    })
})

describe('<CameraOverlay />', () => {
    it('should match snapshot while loading is false', () => {
        const rendered = render(<CameraOverlay loading={false} />).toJSON()

        expect(rendered).toMatchSnapshot()
    })
})
