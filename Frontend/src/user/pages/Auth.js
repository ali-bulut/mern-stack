import React, { useState, useContext } from "react";
import "./Auth.css";
import Card from "../../shared/components/UIElements/Card";
import Input from "../../shared/components/FormElements/Input";
import Button from "../../shared/components/FormElements/Button";
import ErrorModal from "../../shared/components/UIElements/ErrorModal";
import LoadingSpinner from "../../shared/components/UIElements/LoadingSpinner";
import ImageUpload from '../../shared/components/FormElements/ImageUpload';
import {
  VALIDATOR_EMAIL,
  VALIDATOR_MINLENGTH,
  VALIDATOR_REQUIRE
} from "../../shared/util/validators";
import { useForm } from "../../shared/hooks/form-hook";
import { useHttpClient } from "../../shared/hooks/http-hook";
import { AuthContext } from "../../shared/context/auth-context";

const Auth = () => {
  const auth = useContext(AuthContext);

  const [isLoginMode, setIsLoginMode] = useState(true);
  const { isLoading, error, sendRequest, clearError } = useHttpClient();

  const [formState, inputHandler, setFormData] = useForm(
    {
      email: {
        value: "",
        isValid: false
      },
      password: {
        value: "",
        isValid: false
      }
    },
    false
  );

  const switchModeHandler = () => {
    if (!isLoginMode) {
      setFormData(
        {
          ...formState.inputs,
          name: undefined,
          image: undefined
        },
        formState.inputs.email.isValid && formState.inputs.password.isValid
      );
    } else {
      setFormData(
        {
          ...formState.inputs,
          name: {
            value: "",
            isValid: false
          },
          image:{
            value:null,
            isValid:false
          }
        },
        false
      );
    }

    setIsLoginMode(prevMode => !prevMode);
  };

  const authSubmitHandler = async event => {
    event.preventDefault();

    if (isLoginMode) {
      try {
        const responseData = await sendRequest(
          "http://localhost:5000/api/users/login",
          "POST",
          JSON.stringify({
            email: formState.inputs.email.value,
            password: formState.inputs.password.value
          }),
          { "Content-Type": "application/json" }
        );
        auth.login(responseData.user.id);
      } catch (err) {}
    } else {
      try {
        const formData = new FormData();
        formData.append('email',formState.inputs.email.value);
        formData.append('name',formState.inputs.name.value);
        formData.append('password',formState.inputs.password.value);
        //image is a key that is coming from users-routes -> fileUpload.single('image'); 
        formData.append('image', formState.inputs.image.value)
        const responseData = await sendRequest(
          "http://localhost:5000/api/users/signup",
          "POST",
          //instead of using json we use here formData in order to pass binary data which is image file 
          formData
          // JSON.stringify({
          //   name: formState.inputs.name.value,
          //   email: formState.inputs.email.value,
          //   password: formState.inputs.password.value
          // }),
          // { "Content-Type": "application/json" }
        );
        auth.login(responseData.user.id);
      } catch (err) {
        
      }
    }
  };

  return (
    <React.Fragment>
      <ErrorModal error={error} onClear={clearError} />
      <Card className="authentication">
        {isLoading && <LoadingSpinner asOverlay />}
        <h2>Login Required</h2>
        <hr />
        <form onSubmit={authSubmitHandler}>
          {!isLoginMode && (
            <Input
              element="input"
              id="name"
              type="text"
              label="Your Name"
              validators={[VALIDATOR_REQUIRE()]}
              errorText="Please enter a valid name!"
              onInput={inputHandler}
            />
          )}
          {/* we use inputHandler because it's nearly same with our expectation */}
          {!isLoginMode && <ImageUpload id="image" center onInput={inputHandler} errorText="Please provide an image!" />}
          <Input
            element="input"
            id="email"
            type="email"
            label="E-Mail"
            validators={[VALIDATOR_EMAIL()]}
            errorText="Please enter a valid email address!"
            onInput={inputHandler}
          />

          <Input
            element="input"
            id="password"
            type="password"
            label="Password"
            validators={[VALIDATOR_MINLENGTH(6)]}
            errorText="Please enter a valid password! (at least 6 characters)"
            onInput={inputHandler}
          />
          <Button type="submit" disabled={!formState.isValid}>
            {isLoginMode ? "Login" : "Sign Up"}
          </Button>
        </form>
        <Button inverse onClick={switchModeHandler}>
          {!isLoginMode ? "Switch to Login" : "Switch to Sign Up"}
        </Button>
      </Card>
    </React.Fragment>
  );
};

export default Auth;
