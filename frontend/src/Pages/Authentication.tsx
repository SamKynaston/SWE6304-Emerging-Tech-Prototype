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
          <div className="text-center w-full">
            <h1 className="text-2xl mb-2">Create your new account</h1>
            <SignupForm />
          </div>
        </>
      ) : (
        <>
          <div className="text-center w-full">
            <h1 className="text-2xl mb-2">Sign into your account</h1>
            <AuthenticationForm />
          </div>
        </>
      )}

      <a onClick={() => onSignupPage((current) => !current)}>
        {isOnSignupPage ? "Sign in" : "Create an account"}
      </a>
    </Page>
  );
}

export default AuthenticationPage;
