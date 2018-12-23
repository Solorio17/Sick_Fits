import React, { Component } from 'react';
import gql from 'graphql-tag';
import { Query, Mutation } from 'react-apollo';
import { CURRENT_USER_QUERY } from './User';

const ADD_TO_CART_MUTATION = gql`
    mutation addToCart($id: ID!){
        addToCart(id: $id){
            id
            quantity
        }
    }
`;

class AddToCart extends Component{
    render(){
        const { id } = this.props
        return(
            <Mutation 
                mutation={ADD_TO_CART_MUTATION} 
                variables={{
                    id: id
                }}
                refetchQueries={[{ query: CURRENT_USER_QUERY }]}
            >
                {(addToCart, { error, loading}) => <button className="adding" onClick={addToCart} disabled={loading}>Add{loading && 'ing'} to cart</button>}
            </Mutation>
        )
    }
}

export default AddToCart;
export { ADD_TO_CART_MUTATION };