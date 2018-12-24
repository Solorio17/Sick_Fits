import { mount } from 'enzyme';
import wait from 'waait';
import toJSON from 'enzyme-to-json';
import { MockedProvider } from 'react-apollo/test-utils';
import AddToCart, {ADD_TO_CART_MUTATION} from '../components/AddToCart';
import { fakeCartItem, fakeUser } from '../lib/testUtils';
import { ApolloConsumer} from 'react-apollo';
import {CURRENT_USER_QUERY} from '../components/User';

const mocks = [
    {
        request: { query: CURRENT_USER_QUERY },
        result: {
            data: {
                me: {
                    ...fakeUser(),
                    cart: []
                }
            }
        }
    },
    {
        request: { query: CURRENT_USER_QUERY },
        result: {
            data: {
                me: {
                    ...fakeUser(),
                    cart: [fakeCartItem()]
                }
            }
        }
    },
    {
        request: { query: ADD_TO_CART_MUTATION, variables: {id: 'abc123'} },
        result: {
            data: {
                addToCart: {
                    ...fakeCartItem(),
                    quantity: 1
                }
            }
        }
    }
]

describe('AddToCart component', () => {
  it('renders and matches the snapshot', async()=>{
    const wrapper = mount(
        <MockedProvider mocks={mocks}>
            <AddToCart id={'645vdu6bf7iy'}/>
        </MockedProvider>
    );
    await wait();
    wrapper.update();
    expect(toJSON(wrapper.find('button'))).toMatchSnapshot();
    
  });

  it('adds an item to the cart when clicked', async()=>{
    let apolloClient;
    const wrapper = mount(
        <MockedProvider mocks={mocks}>
            <ApolloConsumer>
                {(client)=>{
                    apolloClient = client;
                    return <AddToCart id={'abc123'}/>
                }}
            </ApolloConsumer>
        </MockedProvider>
    );
    await wait();
    wrapper.update();
    const { data: { me } } = await apolloClient.query({ query: CURRENT_USER_QUERY });
    // console.log(me)
    expect(me.cart).toHaveLength(0);
  
    //add item to cart
    wrapper.find('button.adding').simulate('click');
    await wait();
    wrapper.update()
    //check if item is in the cart
    const { data: { me: me2 } } = await apolloClient.query({ query: CURRENT_USER_QUERY });
    await wait();
    wrapper.update()

    expect(me2.cart).toHaveLength(1);
    // expect(me2.cart[0].id).toBe('2q3rwgr');
    // expect(me2.cart[0].quantity).toBe(3);
  });

  it('changes from add to adding when clicked', async()=>{
    const wrapper = mount(
        <MockedProvider mocks={mocks}>
            <AddToCart id="abc123" />
        </MockedProvider>
    );
    await wait();
    wrapper.update();
    expect(wrapper.text()).toContain('Add to cart');
    wrapper.find('button').simulate('click');
    expect(wrapper.text()).toContain('Adding to cart');
  });
});
