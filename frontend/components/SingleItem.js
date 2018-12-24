import React, { Component } from 'react';
import gql from 'graphql-tag';
import { Query } from 'react-apollo';
import Error from '../components/ErrorMessage';
import styled from 'styled-components';
import Head from 'next/head';

const SingleItemStyle = styled.div`
    max-width: 1200px;
    margin: 2rem auto;
    box-shadow: ${props => props.theme.bs};
    display: grid;
    grid-auto-columns: 1fr;
    grid-auto-flow: column;
    min-height: 800px;
    img{
        width: 100%;
        height: 100%;
        object-fit: contain;
    }
    .details{
        text-align: center;
    }
    .details h2{
        font-style: italic;
    }
    .details p span{
        font-weight: bold;
    }
`;

const SINGLE_ITEM_QUERY = gql`
    query SINGLE_ITEM_QUERY($id: ID!){
        item(where: { id: $id }){
            id
            title
            description
            price
            largeImage
        }
    }
`;

class SingleItem extends Component{
    render(){
        return(
            <Query query={SINGLE_ITEM_QUERY} variables={{
                id: this.props.id
            }}>
            {({error, loading, data}) => {
                if(error) return <Error error={error}/>
                if(loading) return <p>Loading...</p>
                if(!data.item) return <p>No item found for {this.props.id}</p>
                const item = data.item;
                return(
                    <SingleItemStyle>
                        <Head>
                            <title>Sick Fits | {item.title}</title>
                        </Head>
                        <img src={item.largeImage} alt={item.title}/>
                        <div className="details">
                            <h2>{item.title}</h2>
                            <p><span>More about this item: </span>{item.description}</p>
                            <h3>{"$" + item.price /100}</h3>
                        </div>
                    </SingleItemStyle>
                )
            }}
            </Query>
        )
    }
}

export default SingleItem;
export { SINGLE_ITEM_QUERY };