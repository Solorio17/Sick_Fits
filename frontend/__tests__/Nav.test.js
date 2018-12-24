import { CURRENT_USER_QUERY } from '../components/User';
import NeedToSignIn from '../components/NeedToSignIn';
import { shallow, mount } from 'enzyme';
import wait from 'waait';
import toJSON from 'enzyme-to-json';
import { MockedProvider } from 'react-apollo/test-utils';
import { fakeUser, fakeCartItem } from '../lib/testUtils';
import Nav from '../components/Nav';

const notSignedInMocks = [
    {
        request: { query: CURRENT_USER_QUERY },
        result: { data: {me : null}}
    }
]

const SignedInMocks = [
    {
        request: { query: CURRENT_USER_QUERY },
        result: { data: {me : fakeUser()}}
    }
]

const SignedInMocksWithCartItems = [
    {
        request: { query: CURRENT_USER_QUERY },
        result: { data: {me : {
            ...fakeUser(),
            cart: [fakeCartItem(), fakeCartItem()]
        }}}
    }
]

describe('Nav component', ()=>{
    it('renders the minimal nav links when logged out', async()=>{
        const wrapper = mount(
            <MockedProvider mocks={notSignedInMocks}>
                <Nav/>
            </MockedProvider>
        );
        // console.log(wrapper.debug())
        await wait();
        wrapper.update();
        // console.log(wrapper.debug())
        const nav = wrapper.find('ul[data-test="nav"]');
        // console.log(nav.debug())
        expect(nav.children().length).toBe(2)
        expect(nav.text()).toContain('Sign In')
        // expect(toJSON(nav)).toMatchSnapshot();
    });

    it('renders the rest of the nav links when logged in', async()=>{
        const wrapper = mount(
            <MockedProvider mocks={SignedInMocks}>
                <Nav/>
            </MockedProvider>
        );
        // console.log(wrapper.debug())
        await wait();
        wrapper.update();
        // console.log(wrapper.debug())
        const nav = wrapper.find('ul[data-test="nav"]');
        // console.log(nav.debug())
        expect(toJSON(nav)).toMatchSnapshot();
    });

    it('renders the rest of the nav links when logged in with cart items', async()=>{
        const wrapper = mount(
            <MockedProvider mocks={SignedInMocksWithCartItems}>
                <Nav/>
            </MockedProvider>
        );
        // console.log(wrapper.debug())
        await wait();
        wrapper.update();
        // console.log(wrapper.debug())
        const nav = wrapper.find('[data-test="nav"]');
        // console.log(nav.debug())
        const count = nav.find('div.count');
        expect(toJSON(count)).toMatchSnapshot();

    });
})