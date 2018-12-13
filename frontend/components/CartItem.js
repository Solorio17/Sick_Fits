import React from 'react';
import formatMoney from '../lib/formatMoney';
import styled from 'styled-components';
import propTypes from 'prop-types';
import RemoveFromCart from './RemoveFromCart';

const CartItemStyle = styled.li`
    padding: 1rem 0;
    border-bottom: 1px solid ${props => props.theme.lightgrey};
    display: grid;
    align-items: center;
    grid-template-columns: auto 1fr auto;
    img{
        margin-right: 10px;
    }
    h3, p {
        margin: 0;
    }
`;

const CartItem = ({ cartItem }) =>{
    //first check that the item exists
    if(!cartItem.item) 
        return (
            <CartItemStyle>
                <p>This item has been removed</p>
                <RemoveFromCart id={cartItem.id}/>
            </CartItemStyle>
        )
    return(
        <CartItemStyle>
            <img width="100" src={cartItem.item.image} alt={cartItem.item.title}/>
            <div className="cart-item-details">
                <h3>{cartItem.item.title}</h3>
                <p>
                    {formatMoney(
                        cartItem.item.price * cartItem.quantity
                    )}
                    {' - '}
                    <em>
                        {cartItem.quantity} &times; {formatMoney(cartItem.item.price)}
                    </em> 
                </p>
            </div>
            <RemoveFromCart id={cartItem.id}/>
        </CartItemStyle>
    )
}

CartItem.propTypes = {
    cartItem: propTypes.object.isRequired
}

export default CartItem;