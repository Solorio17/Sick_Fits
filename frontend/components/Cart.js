import React from 'react';
import CartStyles from './styles/CartStyles';
import SickButton from './styles/SickButton';
import Supreme from './styles/Supreme';
import CloseButton from './styles/CloseButton';

const Cart = () => {
    return(
        <CartStyles open>
            <header>
                <CloseButton title="close">X</CloseButton>
                <Supreme>Your Cart</Supreme>
                <p>You have 1 item in your cart</p>
            </header>

            <footer>
                <p>$1,200</p>
                <SickButton>Checkout</SickButton>
            </footer>

        </CartStyles>
    )
}

export default Cart;