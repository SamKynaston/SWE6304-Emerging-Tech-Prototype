import { Link } from "react-router-dom";
import Page from "../../Components/Page";

// Home Page

interface AdminHomeProps {
  //setAllBooks: React.Dispatch<React.SetStateAction<Book[]>>;
}

function AdminHome({ }: AdminHomeProps) {
  return (
    <Page>
        <h1>Admin Dashboard</h1>
        <span className="flex flex-col gap-2">
          <h2>Suggested Actions</h2>
          <Link to="/admin/accounts"><i className="fa-regular fa-circle-right" /> Account Management</Link>
          <Link to="/admin/model"><i className="fa-regular fa-circle-right" /> AI Model Management</Link>
          <Link to="/admin/courses"><i className="fa-regular fa-circle-right" /> Course Management</Link>
          <Link to="/admin/modules"><i className="fa-regular fa-circle-right" /> Module Management</Link>
        </span>
    </Page>
  );
};

export default AdminHome;