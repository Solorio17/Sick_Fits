import NeedToSignIn from '../components/NeedToSignIn';
import Order from '../components/Order';

const OrderPage = props =>{
    return(
        <NeedToSignIn>
            <Order id={props.query.id} />
        </NeedToSignIn>
    )
}

export default OrderPage;    