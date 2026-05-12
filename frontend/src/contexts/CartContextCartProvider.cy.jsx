import React from 'react'
import { CartProvider } from './CartContext'

describe('<CartProvider />', () => {
  it('renders', () => {
    // see: https://on.cypress.io/mounting-react
    cy.mount(<CartProvider />)
  })
})