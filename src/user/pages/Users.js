import React from 'react';

import UsersList from '../components/UsersList';

const Users = () => {
    const USERS = [
        {
            id:'u1',
            name:'Ali Bulut',
            image:'https://avatars2.githubusercontent.com/u/53226554?s=460&u=5608076f8a8d017db5345a223a9a6234d5c50975&v=4',
            places:3
        }
    ];
    return (
        <div>
            <UsersList items={USERS}/>
        </div>
    );
};

export default Users;