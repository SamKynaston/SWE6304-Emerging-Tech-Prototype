import Page from "../Components/Page";
import { useAuth } from "../Context/Authentication";

type AccountManagementPageProps = {
  //isLoggedIn: boolean; 
}

function AccountManagementPage({ }: AccountManagementPageProps) {
  const { user, refreshUser } = useAuth();

  return (
    <Page requiresAccount={true}>
      <h1>Hello, {`${user?.forename} ${user?.surname}` || "User"}!</h1>
    </Page>
  );
}

export default AccountManagementPage;
