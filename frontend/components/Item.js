import React, { Component } from 'react';
import PropTypes from 'prop-types';
import Title from './styles/Title';
import ItemStyles from './styles/ItemStyles';
import PriceTag from './styles/PriceTag';
import Link from 'next/link';
import formatMoney from '../lib/formatMoney';
import DeleteItem from '../components/deleteItem';
import AddToCart from '../components/AddToCart';

class Item extends Component{
    static propTypes = {
        item: PropTypes.object.isRequired,
    };

    render(){
        const { item } = this.props

        return(
            <ItemStyles>
                <Title>
                    <Link href={{
                        pathname: '/item',
                        query: {id: item.id}
                    }}>
                        <a>{item.title}</a>
                    </Link>
                </Title>
                <PriceTag>{formatMoney(item.price)}</PriceTag>
                <img src={item.image} alt={item.title}/>
                <p>{item.description}</p>
                <div className="buttonList">
                    <Link href={{
                        pathname: 'update',
                        query: {id: item.id}
                    }}>
                        <a>Edit</a>
                    </Link>
                    <AddToCart id={item.id}/>
                    <DeleteItem id={item.id}>Delete Item</DeleteItem>
                </div>
            </ItemStyles>
        )
    }
}

export default Item;
