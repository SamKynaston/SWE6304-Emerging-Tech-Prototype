import Page from "../../Components/Page";
import { useAuth } from "../../Context/Authentication";
import { UserTable } from "../../Components/UserTable";

type AdminAccountPageProps = {
  //isLoggedIn: boolean; 
}

function AdminAccountPage({ }: AdminAccountPageProps) {
  return (
    <Page requiresAccount={true} requiredPermission={"WRITE_USERS"}>
      <UserTable />
    </Page>
  );
}

export default AdminAccountPage;
