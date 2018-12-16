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

function totalItems(cart){
    return cart.reduce((tally, cartItem) => tally + cartItem.quantity, 0)
}

class CreditCard extends Component{
    onToken = res =>{
        console.log(res.id)
    }
    render(){
        return(
            <User>
                {({data: { me }}) => (
                    <StripeCheckout
                        amount={calcTotalPrice(me.cart)}
                        name="Sick Fits"
                        description={`Total items: ${totalItems(me.cart)}`}
                        image={me.cart[0].item && me.cart[0].item.image}
                        stripeKey="pk_test_LPv396GsOHWwT37lbslxNgW3"
                        currency="USD"
                        email={me.email}
                        token={res => this.onToken(res)}
                    >
                        {this.props.children}
                    </StripeCheckout>
                )}
            </User>
        )
    }
}

export default CreditCard;