import Page from "../Components/Page";
import { useAuth } from "../Context/Authentication";
import { Link, useNavigate } from "react-router-dom";
import { useState, useEffect } from "react";
import { UserTable } from "../Components/UserTable";

// Home Page for authenticated users. Will show their favourited books using the BookBtn component, alongside how much stock there is.

interface HomeProps {
  //setAllBooks: React.Dispatch<React.SetStateAction<Book[]>>;
}

function Home({ }: HomeProps) {
  const { user } = useAuth();

  const navigate = useNavigate();

  useEffect(() => {
    if (!user) return;
  }, [user]);

  return (
    <Page>
      <>
        <h1>🚧 UNDER CONSTRUCTION 🚧</h1>
        <h2>Codename "Silver Stallion"</h2>
      </>
      {!user ? (
        <>
          <UserTable />
          <Link to="/login">Sign in to see your favourites!</Link>
        </>
      ) : ( <> </> )}
    </Page>
  );
};

export default Home;
