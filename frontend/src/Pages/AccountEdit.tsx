import { useNavigate } from "react-router-dom";
import Page from "../Components/Page";
import { useAuth } from "../Context/Authentication";
import { UpdateForm } from "../Components/UpdateForm";
import { logout, requestPasswordReset } from "../Services/Users.service";

type AccountEditPageProps = {
  //isLoggedIn: boolean; 
}

function AccountEditPage({ }: AccountEditPageProps) {
  const { user, refreshUser } = useAuth();
  const navigate = useNavigate();

  // Signs the user out
  const handleSignout = async () => {
    if (await logout()) {
      refreshUser();
      navigate("/")
    }
  }

  // Sends a password reset request to the server
  const handlePasswordReset = async () => {
    const data = await requestPasswordReset()

    if (data.success) {
      refreshUser();
      navigate(`/password-reset?token=${data.token}`)
    }
  }

  return (
    <Page requiresAccount={true}>
        <h1>Edit your account</h1>
        <UpdateForm id={undefined}/>
    </Page>
  );
}

export default AccountEditPage;
