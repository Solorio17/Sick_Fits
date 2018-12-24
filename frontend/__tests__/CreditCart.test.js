import { mount } from 'enzyme';
import wait from 'waait';
import toJSON from 'enzyme-to-json';
import { MockedProvider } from 'react-apollo/test-utils';
import CreditCart, {CREATE_ORDER_MUTATION} from '../components/CreditCard';
import { fakeCartItem, fakeUser } from '../lib/testUtils';
import {CURRENT_USER_QUERY} from '../components/User';
import NProgress from 'nprogress';
import Router from 'next/router';

Router.router = { push(){} };

const mocks = [
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
    }
];

describe('CreditCart component', () => {
    it('renders and matches snapshot', async()=>{
        const wrapper = mount(
            <MockedProvider mocks={mocks}>
                <CreditCart />
            </MockedProvider>
        );
        await wait();
        wrapper.update();
        const checkoutButton = wrapper.find('ReactStripeCheckout');
        expect(toJSON(checkoutButton)).toMatchSnapshot();
    });

    it('creates an order ontoken', async()=>{
        const createOrderMock = jest.fn().mockResolvedValue({
            data: { createOrder: { id: 'xzy789'}}
        });
        const wrapper = mount(
            <MockedProvider mocks={mocks}>
                <CreditCart />
            </MockedProvider>
        );
        const component = wrapper.find('CreditCard').instance();
        // console.log(component);
        //manually call the onToken method
        component.onToken({ id: 'abc123' }, createOrderMock);
        expect(createOrderMock).toHaveBeenCalled();
        expect(createOrderMock).toHaveBeenCalledWith({"variables": {"token": "abc123"}});
    });

    it('runs the progress bar', async()=>{
        const wrapper = mount(
            <MockedProvider mocks={mocks}>
                <CreditCart />
            </MockedProvider>
        );
        await wait();
        wrapper.update();
        NProgress.start = jest.fn();

        const createOrderMock = jest.fn().mockResolvedValue({
            data: { createOrder: { id: 'xzy789'}}
        });

        const component = wrapper.find('CreditCard').instance();
        //manually call the onToken method
        component.onToken({ id: 'abc123' }, createOrderMock);
        expect(NProgress.start).toHaveBeenCalled();
    });

    it('routes to the order page when purchase is completed', async()=>{
        const wrapper = mount(
            <MockedProvider mocks={mocks}>
                <CreditCart />
            </MockedProvider>
        );
        await wait();
        wrapper.update();

        const createOrderMock = jest.fn().mockResolvedValue({
            data: { createOrder: { id: 'xyz789'}}
        });

        const component = wrapper.find('CreditCard').instance();
        Router.router.push = jest.fn();
        //manually call the onToken method
        component.onToken({ id: 'abc123' }, createOrderMock);
        await wait();
        expect(Router.router.push).toHaveBeenCalled();
        expect(Router.router.push).toHaveBeenCalledWith({
            pathname: '/order',
            query: {
                id: 'xyz789'
            }
        }); 
    });
});

