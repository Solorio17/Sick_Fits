import React, { Component } from 'react';
import gql from 'graphql-tag';
import StripeCheckout from 'react-stripe-checkout';
import { Mutation } from 'react-apollo';
import Router from 'next/router';
import NProgress from 'nprogress';
import propTypes from 'prop-types';
import calcTotalPrice from '../lib/calcTotalPrice';
import Error from './ErrorMessage';
import User, { CURRENT_USER_QUERY } from './User';

const CREATE_ORDER_MUTATION = gql`
    mutation createOrder($token: String!){
        createOrder(token: $token){
            id
            charge
            total
            items{
                id
                title
            }
        }
    }
`;

function totalItems(cart){
    return cart.reduce((tally, cartItem) => tally + cartItem.quantity, 0)
}

class CreditCard extends Component{
    onToken = async (res, createOrder) =>{
        NProgress.start();
        // console.log(res.id)
        //manually call mutation once we have stripe token
        const order = await createOrder({
            variables: {
                token: res.id
            },
        }).catch(err => {
            alert(err.message)
        });
        Router.push({
            pathname: "/order",
            query: { id: order.data.createOrder.id }
        })
    }
    render(){
        return(
            <User>
                {({data: { me }, loading }) => {

                if(loading) return null;
                
                return (
                    <Mutation mutation={CREATE_ORDER_MUTATION} refetchQueries={[{ query: CURRENT_USER_QUERY }]}> 
                        {(createOrder) => (
                        
                        <StripeCheckout
                            amount={calcTotalPrice(me.cart)}
                            name="Sick Fits"
                            description={`Total items: ${totalItems(me.cart)}`}
                            image={me.cart.length && me.cart[0].item && me.cart[0].item.image}
                            stripeKey="pk_test_LPv396GsOHWwT37lbslxNgW3"
                            currency="USD"
                            email={me.email}
                            token={res => this.onToken(res, createOrder)}
                        >
                            {this.props.children}
                        </StripeCheckout>
                        )}
                    </Mutation>
                )}}
            </User>
        )
    }
}

export default CreditCard;
export { CREATE_ORDER_MUTATION };