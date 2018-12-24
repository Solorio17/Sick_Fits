import Pagination, { PAGINATION_QUERY } from '../components/Pagination';
import { shallow, mount } from 'enzyme';
import wait from 'waait';
import toJSON from 'enzyme-to-json';
import Router from 'next/router';
import { MockedProvider } from 'react-apollo/test-utils';

Router.router = {
    push(){},
    prefetch(){}
}

function paginationMocks(length) {
    return [
        {
            request: { query: PAGINATION_QUERY },
            result: {
                data: {
                    itemsConnection:{
                        __typename: 'aggregate',
                        aggregate: {
                            __typename: 'count',
                            count: length
                        }
                    }
                }
            }
        }
    ]
}

describe('Pagination component', () => {
    it('displays a loading message', async () => {
        const wrapper = mount(
            <MockedProvider mocks={paginationMocks(1)}>
                <Pagination page={1} />
            </MockedProvider>
        )
        // console.log(wrapper.debug());
        const pagination = wrapper.find('[data-test="pagination"]');
        expect(wrapper.text()).toContain('Loading...')
    });

    it('renders pagination for 17 items', async () => {
        const wrapper = mount(
            <MockedProvider mocks={paginationMocks(18)}>
                <Pagination page={1} />
            </MockedProvider>
        )
        // console.log(wrapper.debug());
        await wait();
        wrapper.update();
        // console.log(wrapper.debug());

        expect(wrapper.find('.totalPages').text()).toBe("5");
        const pagination = wrapper.find('[data-test="pagination"]');
        expect(toJSON(pagination)).toMatchSnapshot();
        // // console.log(nav.debug())
    });

    it('disables the prev button on first page', async ()=>{
        const wrapper = mount(
            <MockedProvider mocks={paginationMocks(18)}>
                <Pagination page={1} />
            </MockedProvider>
        )
        await wait();
        wrapper.update();
        expect(wrapper.find('a.prev').prop('aria-disabled')).toBe(true)
        expect(wrapper.find('a.next').prop('aria-disabled')).toBe(false)
    }); 

    it('disables the next button on last page', async ()=>{
        const wrapper = mount(
            <MockedProvider mocks={paginationMocks(18)}>
                <Pagination page={5} />
            </MockedProvider>
        )
        await wait();
        wrapper.update();
        expect(wrapper.find('a.prev').prop('aria-disabled')).toBe(false)
        expect(wrapper.find('a.next').prop('aria-disabled')).toBe(true)
    }); 

    it('enables all button on a middle page', async ()=>{
        const wrapper = mount(
            <MockedProvider mocks={paginationMocks(18)}>
                <Pagination page={3} />
            </MockedProvider>
        )
        await wait();
        wrapper.update();
        expect(wrapper.find('a.prev').prop('aria-disabled')).toBe(false)
        expect(wrapper.find('a.next').prop('aria-disabled')).toBe(false)
    }); 
});