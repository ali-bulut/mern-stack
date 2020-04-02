import React from 'react';
import {useParams} from 'react-router-dom';

import PlaceList from '../components/PlaceList';

const DUMMY_PLACES=[
    {
        id:'p1',
        title:'Maiden Tower',
        description:'One of the most famous place in the world!',
        imageUrl:'https://upload.wikimedia.org/wikipedia/commons/9/92/Maiden_tower.JPG',
        address:'Salacak, Üsküdar Salacak Mevkii, 34668 Üsküdar/İstanbul',
        location:{
            lat: 41.0211216,
            lng: 29.0041105
        },
        creator:'u1'
    },
    {
        id:'p2',
        title:'Maiden Tower',
        description:'One of the most famous place in the world!',
        imageUrl:'https://upload.wikimedia.org/wikipedia/commons/9/92/Maiden_tower.JPG',
        address:'Salacak, Üsküdar Salacak Mevkii, 34668 Üsküdar/İstanbul',
        location:{
            lat: 41.0211216,
            lng: 29.0041105
        },
        creator:'u2'
    }
]

const UserPlaces = () => {
    //by using useParams hook, we are able to reach userId route which comes from the url.
    const userId = useParams().userId;
    const loadedPlaces=DUMMY_PLACES.filter(place=>place.creator === userId);
    return (
        <PlaceList items={loadedPlaces}/>
    );
};

export default UserPlaces;