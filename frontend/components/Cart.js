import React from 'react';
import CartStyles from './styles/CartStyles';
import SickButton from './styles/SickButton';
import Supreme from './styles/Supreme';
import CloseButton from './styles/CloseButton';
import gql from 'graphql-tag';
import { Query, Mutation } from 'react-apollo';

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

const Cart = () => {
    return(
        <Mutation mutation={TOGGLE_CART_MUTATION}>{(toggleCart) => (
            <Query query={LOCAL_STATE_QUERY}>{({data}) => (
                <CartStyles open={data.cartOpen}>
                    <header>
                        <CloseButton onClick={toggleCart} title="close">X</CloseButton>
                        <Supreme>Your Cart</Supreme>
                        <p>You have 1 item in your cart</p>
                    </header>

                    <footer>
                        <p>$1,200</p>
                        <SickButton>Checkout</SickButton>
                    </footer>

                </CartStyles>
            )}
        </Query>
        )}
      </Mutation>
    )
}

export default Cart;
export { LOCAL_STATE_QUERY, TOGGLE_CART_MUTATION };