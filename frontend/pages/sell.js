import CreateItem from '../components/createItem';
import NeedToSignIn from '../components/NeedToSignIn';

const Sell = props =>{
    return(
        <NeedToSignIn>
            <CreateItem/>
        </NeedToSignIn>
    )
}

export default Sell;