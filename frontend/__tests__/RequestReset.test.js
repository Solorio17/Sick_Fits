import { mount } from 'enzyme';
import wait from 'waait';
import toJSON from 'enzyme-to-json';
import { MockedProvider } from 'react-apollo/test-utils';
import RequestReset, {REQUEST_RESET_MUTATION} from '../components/RequestReset';

const mocks = [
    {
        request: {
            query: REQUEST_RESET_MUTATION,
            variables: { email: 'testemail@gmail.com'}
        },
        result: {
            data: { requestReset: { message: 'Successful!', __typename: 'Message'}}
        }
    }
]

describe('RequestReset component', () => {
  it('renders and matches the snapshot', async()=>{
      const wrapper = mount(
          <MockedProvider>
              <RequestReset/>
          </MockedProvider>
      );
      const form = wrapper.find('form[data-test="form"]');
      //console.log(form.debug());
      expect(toJSON(form)).toMatchSnapshot();
  });

  it('calls the mutation', async()=>{
    const wrapper = mount(
        <MockedProvider mocks={mocks}>
            <RequestReset/>
        </MockedProvider>
    );
    //simulate typing an email
    wrapper.find('input').simulate('change', {target: { name: 'email', value: 'testemail@gmail.com'}});
    //submit the form
    wrapper.find('form').simulate('submit');
    await wait();
    wrapper.update();
    // console.log(wrapper.debug());
    expect(wrapper.find('[data-test="paragraph"]').text()).toContain('Successful! Check your email for reset link.')
  });
})
