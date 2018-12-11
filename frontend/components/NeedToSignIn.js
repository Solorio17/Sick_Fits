import { Query } from 'react-apollo';
import { CURRENT_USER_QUERY } from './User';
import Signin from './Signin';

const NeedToSignIn = props =>{
    return(
        <Query query={CURRENT_USER_QUERY}>
            {({data, loading}) => {
                if(loading) return <p>Loading...</p>
                if(!data.me){
                    return(
                        <div>
                            <h3>Please sign in first!</h3>
                            <Signin/>
                        </div>
                    )
                }
                return props.children
            }}
        </Query>
    )
}

export default NeedToSignIn;