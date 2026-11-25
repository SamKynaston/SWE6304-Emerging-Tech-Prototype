import Page from "../Components/Page";
import { AuthenticationForm } from "../Components/AuthenticationForm";
import { SignupForm } from "../Components/SignupForm";
import { useState } from "react";

type AuthenticationPageProps = {
  //isLoggedIn: boolean; 
}

function AuthenticationPage({ }: AuthenticationPageProps) {  
  const [isOnSignupPage, onSignupPage] = useState<boolean>(false);
  
  return (
    <Page>
      {isOnSignupPage ? (
        <>
          <h1>Create your new account</h1>
          <SignupForm />
        </>
      ) : (
        <>
          <h1>Sign into your account</h1>
          <AuthenticationForm />
        </>
      )}

      <a onClick={() => onSignupPage((current) => !current)}>
        {isOnSignupPage ? "Sign in" : "Create an account"}
      </a>
    </Page>
  );
}

export default AuthenticationPage;
