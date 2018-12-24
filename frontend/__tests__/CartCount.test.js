import CartCount from '../components/CartCount';
import { shallow, mount } from 'enzyme';
import toJSON from 'enzyme-to-json';

describe('CartCount Component', () => {
  it('renders without errors', ()=>{
      const wrapper = shallow(<CartCount count={10}/>)
  });

  it('matches the snapshot', ()=>{
      const wrapper = shallow(<CartCount count={19}/>);
      expect(toJSON(wrapper)).toMatchSnapshot();
  });

  it('updates via props', ()=>{
    const wrapper = shallow(<CartCount count={19}/>);
    expect(toJSON(wrapper)).toMatchSnapshot();
    wrapper.setProps({ count: 45 });
    expect(toJSON(wrapper)).toMatchSnapshot()    
  })
})
