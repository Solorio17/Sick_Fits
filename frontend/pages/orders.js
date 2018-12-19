import OrderList from '../components/OrderList';
import NeedToSignIn from '../components/NeedToSignIn';

const Orders = props =>{
    return(
        <NeedToSignIn>
            <OrderList/>
        </NeedToSignIn>
    )
}

export default Orders;