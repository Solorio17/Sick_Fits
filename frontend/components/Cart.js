import React from 'react';
import gql from 'graphql-tag';
import { Query, Mutation } from 'react-apollo';
import calcTotalPrice from '../lib/calcTotalPrice';
import formatMoney from '../lib/formatMoney';
import { adopt } from 'react-adopt';
import CartStyles from './styles/CartStyles';
import SickButton from './styles/SickButton';
import Supreme from './styles/Supreme';
import CloseButton from './styles/CloseButton';
import CartItem from './CartItem';
import User from './User';
import CreditCard from './CreditCard';

const LOCAL_STATE_QUERY = gql`
    query{
        cartOpen @client
    }
`;

const TOGGLE_CART_MUTATION = gql`
    mutation{
        toggleCart @client
    }
`;

const Composed = adopt({
    user: ({ render }) => <User>{render}</User>,
    toggleCart: ({ render }) => <Mutation mutation={TOGGLE_CART_MUTATION}>{render}</Mutation>,
    localState: ({ render }) => <Query query={LOCAL_STATE_QUERY}>{render}</Query>
})

const Cart = () => {
    return(
        <Composed>
            {({user, toggleCart, localState}) => {
                const me = user.data.me;
                if(!me) return null
                return(
                    <CartStyles open={localState.data.cartOpen}>
                        <header>
                            <CloseButton onClick={toggleCart} title="close">X</CloseButton>
                            <Supreme>{me.name}'s Cart</Supreme>
                            <p>You have {me.cart.length} different item{me.cart.length === 1 ? '' : 's'} in your cart</p>
                        </header>
                        
                        <ul>{me.cart.map(cartItem => <CartItem key={cartItem.id} cartItem={cartItem}/>)}</ul>

                        <footer>
                            <p>Total: {formatMoney(calcTotalPrice(me.cart))}</p>
                            <CreditCard>
                                <SickButton>Checkout</SickButton>
                            </CreditCard>
                        </footer>
                    </CartStyles>
                )
            }}
        </Composed>
    )
}

export default Cart;
export { LOCAL_STATE_QUERY, TOGGLE_CART_MUTATION };