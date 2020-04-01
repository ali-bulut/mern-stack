import React from 'react';
import {useParams} from 'react-router-dom';
import Input from '../../shared/components/FormElements/Input';
import Button from '../../shared/components/FormElements/Button';
import { VALIDATOR_REQUIRE, VALIDATOR_MINLENGTH } from '../../shared/util/validators';

import './PlaceForm.css'

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

const UpdatePlace = (props) => {
    const placeId=useParams().placeId; 

    const identifiedPlace=DUMMY_PLACES.find(p=>p.id === placeId);

    if(!identifiedPlace){ 
        return <div className="center"><h2>Could not find place!</h2></div>
    }

    return (
        <form className="place-form">
            <Input id="title" element="input" type="text" label="Title" validators={[VALIDATOR_REQUIRE()]} errorText="Please enter a valid title!" onInput={() => {}} value={identifiedPlace.title} valid={true} />
            <Input id="description" element="textarea" label="Description" validators={[VALIDATOR_MINLENGTH(5)]} errorText="Please enter a valid description! (at least 5 characters)" onInput={() => {}} value={identifiedPlace.description} valid={true} />
            <Button type="submit" disabled={true}>Update Place</Button>

        </form>
    );
};

export default UpdatePlace;