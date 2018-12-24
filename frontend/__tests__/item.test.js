import Item from '../components/Item';
import { shallow, mount } from 'enzyme';
import toJSON from 'enzyme-to-json';

const fakeItem = {
    id: '34567o8fuvkyudgw5t3',
    title: 'A very neat item',
    price: 7000,
    description: 'This item is very cool and handy',
    image: 'item.jpg',
    largeImage: 'itemLarge.jpg'
}

describe('Item component', () => {
    //SAME THING AS BELOW BUT WITH A SNAPSHOT
    it('renders and matches the snapshot', ()=>{
        const wrapper = shallow(<Item item={fakeItem}/>)
        expect(toJSON(wrapper)).toMatchSnapshot()
    })


    // it('renders and displays properly', ()=>{
    //     const wrapper = shallow(<Item item={fakeItem}/>);
    //     const PriceTag = wrapper.find('PriceTag');
    //     expect(PriceTag.dive().text()).toBe('$50');

    //     expect(wrapper.find('Title a').text()).toBe(fakeItem.title);

    //     const img = wrapper.find('img');
    //     expect(img.props().src).toBe(fakeItem.image);
    //     expect(img.props().alt).toBe(fakeItem.title);

    //     const buttonList = wrapper.find('.buttonList');
    //     expect(buttonList.children()).toHaveLength(3);
    //     expect(buttonList.find('Link')).toHaveLength(1);
    //     expect(buttonList.find('AddToCart').exists()).toBe(true);
    //     expect(buttonList.find('RemoveFromCart')).toBeTruthy();
    // })
})