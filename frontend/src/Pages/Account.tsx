import Page from "../Components/Page";
import { useAuth } from "../Context/Authentication";
import { Link } from "react-router-dom";

type AccountManagementPageProps = {
  //isLoggedIn: boolean; 
}

function AccountManagementPage({ }: AccountManagementPageProps) {
  const { user, isAdmin, refreshUser } = useAuth();

  return (
    <Page requiresAccount={true}>
      <h1>Hello, {`${user?.forename} ${user?.surname}` || "User"}!</h1>
      <span className="flex gap-3 flex-col md:flex-row">
        <span className="flex flex-col gap-2 md:grow">
          <h2>Suggested Actions</h2>
          <Link to="/account/edit"><i className="fa-regular fa-circle-right" /> Update your details</Link>
          <Link to="/account/timetable"><i className="fa-regular fa-circle-right" /> View your timetable</Link>
          <Link to="/account/courses"><i className="fa-regular fa-circle-right" /> View your enrolments</Link>
          <Link to="/account/chat"><i className="fa-regular fa-circle-right" /> Get support</Link>
        </span>

        {isAdmin ? (
          <span className="flex flex-col gap-2 md:grow">
          <h2>System Administrator Actions</h2>
            <Link to="/admin/accounts"><i className="fa-regular fa-circle-right" /> Account Management</Link>
            <Link to="/admin/model"><i className="fa-regular fa-circle-right" /> AI Model Management</Link>
            <Link to="/admin/courses"><i className="fa-regular fa-circle-right" /> Course Management</Link>
            <Link to="/admin/modules"><i className="fa-regular fa-circle-right" /> Module Management</Link>
          </span>
        ) : null}
      </span>
    </Page>
  );
}

export default AccountManagementPage;
