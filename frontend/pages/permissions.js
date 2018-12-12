import Permissions from '../components/Permissions';
import NeedToSignIn from '../components/NeedToSignIn';

const PermissionsPage = props =>{
    return(
        <NeedToSignIn>
            <Permissions/>
        </NeedToSignIn>
    )
}

export default PermissionsPage;