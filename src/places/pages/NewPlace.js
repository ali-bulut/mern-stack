import React from "react";

import Input from '../../shared/components/FormElements/Input';
import Button from '../../shared/components/FormElements/Button';
import {VALIDATOR_REQUIRE, VALIDATOR_MINLENGTH} from '../../shared/util/validators';
import {useForm} from '../../shared/hooks/form-hook';

import './PlaceForm.css';



const NewPlace = () => {
  
  const [formState, inputHandler] = useForm({
    title:{
      value:'',
      isValid:false
    },
    description:{
      value:'',
      isValid:false
    },
    address:{
      value:'',
      isValid:false
    }
  }, false);
  

  

  const placeSubmitHandler = event => {
    event.preventDefault();
    console.log(formState.inputs); //send this to the backend!
  }

  return (
    <form className="place-form" onSubmit={placeSubmitHandler}>
      <Input element="input" type="text" id="title" label="Title" onInput={inputHandler} validators={[VALIDATOR_REQUIRE()]} errorText="Please enter a valid title!" />
      <Input element="textarea" id="description" label="Description" onInput={inputHandler} validators={[VALIDATOR_MINLENGTH(5)]} errorText="Please enter a valid description! (at least 5 characters)" />
      <Input element="input" id="address" label="Address" onInput={inputHandler} validators={[VALIDATOR_REQUIRE()]} errorText="Please enter a valid address!" />
      
      <Button type="submit" disabled={!formState.isValid}>Add Place</Button>
    </form>
  );
};

export default NewPlace;
