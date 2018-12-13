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
    render(){
        return(
            <Mutation mutation={REMOVE_FROM_CART_MUTATION} variables={{id: this.props.id}} refetchQueries={[{ query: CURRENT_USER_QUERY }]}>
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