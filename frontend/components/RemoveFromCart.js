import React, { Component } from 'react';
import styled from 'styled-components';
import propTypes from 'prop-types';
import gql from 'graphql-tag';
import { CURRENT_USER_QUERY } from './User';
import { Mutation } from 'react-apollo';

const REMOVE_FROM_CART_MUTATION = gql`
    mutation removeFromCart($id: ID!){
        removeFromCart(id: $id){
            id
        }
    }
`;

const DeleteItemButton = styled.button`
    font-size: 18px;
    background: none;
    border: 0;
    &:hover{
        color: ${props => props.theme.red};
        cursor: pointer
    }
`;

class RemoveFromCart extends Component{
    static propTypes = { id: propTypes.string.isRequired };

    update = ( cache, payload ) => {
        //read cache
        const data = cache.readQuery({
            query: CURRENT_USER_QUERY
        })
        //remove the item from cart
        const cartItemId = payload.data.removeFromCart.id;
        data.me.cart = data.me.cart.filter(cartItem => cartItem.id !== cartItemId);
        //write it back to the cache
        cache.writeQuery({ query: CURRENT_USER_QUERY, data: data})
    }

    render(){
        return(
            <Mutation 
                mutation={REMOVE_FROM_CART_MUTATION} 
                variables={{id: this.props.id}} 
                update={this.update}
                optimisticResponse={{
                    __typename: 'Mutation',
                    removeFromCart: {
                        __typename: 'CartItem',
                        id: this.props.id
                    }
                }}
            >
                {(removeFromCart, { loading, error }) => (
                    <DeleteItemButton 
                        title="deleteItem" 
                        onClick={() => {removeFromCart().catch(error => alert(error.message))}} 
                        disabled={loading}
                    > &times; </DeleteItemButton>
                )}
            </Mutation>
        )
    }
}

export default RemoveFromCart;