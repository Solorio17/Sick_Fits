import { CURRENT_USER_QUERY } from '../components/User';
import NeedToSignIn from '../components/NeedToSignIn';
import { shallow, mount } from 'enzyme';
import wait from 'waait';
import toJSON from 'enzyme-to-json';
import { MockedProvider } from 'react-apollo/test-utils';
import { fakeUser } from '../lib/testUtils';
import Signin from '../components/Signin';

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

describe('NeedToSignIn component', ()=>{
    it('renders the sign in form to logged out users', async()=>{
        const wrapper = mount(
            <MockedProvider mocks={notSignedInMocks}>
                <NeedToSignIn/>
            </MockedProvider>
        );
        // console.log(wrapper.debug());
        await wait();
        wrapper.update();
        expect(wrapper.text()).toContain('Please sign in first!');
        expect(wrapper.find('Signin').exists()).toBe(true)
        // console.log(wrapper.debug());
    });

    it('renders the child component when a user is logged in', async()=>{
        const Hey = () => <p>Hey</p>
        const wrapper = mount(
            <MockedProvider mocks={SignedInMocks}>
                <NeedToSignIn>
                    <Hey/>
                </NeedToSignIn>
            </MockedProvider>
        );
        // console.log(wrapper.debug());
        await wait();
        wrapper.update();
        // console.log(wrapper.debug());
        expect(wrapper.text()).toContain('Hey')
        
    });
})