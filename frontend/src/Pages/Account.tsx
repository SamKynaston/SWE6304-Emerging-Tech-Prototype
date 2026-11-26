import Page from "../Components/Page";
import { useAuth } from "../Context/Authentication";
import { Link } from "react-router-dom";

type AccountManagementPageProps = {
  //isLoggedIn: boolean; 
}

function AccountManagementPage({ }: AccountManagementPageProps) {
  const { user, refreshUser } = useAuth();

  return (
    <Page requiresAccount={true}>
      <h1>Hello, {`${user?.forename} ${user?.surname}` || "User"}!</h1>
      <span className="flex flex-col gap-2">
        <h2>Suggested Actions</h2>
        <Link to="/account/edit"><i className="fa-regular fa-circle-right" /> Edit your account</Link>
        <Link to="/account/timetable"><i className="fa-regular fa-circle-right" /> View your timetable</Link>
        <Link to="/account/courses"><i className="fa-regular fa-circle-right" /> View your enrolments</Link>
        <Link to="/account/chat"><i className="fa-regular fa-circle-right" /> Get support</Link>
      </span>
    </Page>
  );
}

export default AccountManagementPage;
