import { useAuth } from "../Context/Authentication";
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { updateUser } from "../Services/Users.service";

interface UpdateFormType {
    id: number | undefined;
}

export const UpdateForm = ({ id }: UpdateFormType ) => {
    const { user, refreshUser } = useAuth();

    const [forename, setForename] = useState(user?.forename || "");
    const [surname, setSurname] = useState(user?.surname || "");
    const [email, setEmail] = useState(user?.email || "");

    const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
        event.preventDefault();

        if (user) {
            try {
                if (!id) {
                    id = user.id
                }
                
                if (await updateUser(email, forename, surname, id)) {
                    await refreshUser()
                }; 
            } catch (err) {
                console.log(err)
                alert("Login failed.");
            }
        }
    }
    
    return (
        <form onSubmit={handleSubmit} className="flex flex-col gap-5">
            <div className="flex gap-3">
                <span className="w-full">
                    <p>First Name</p>
                    <input value={forename} onChange={(e) => setForename(e.target.value)} placeholder="Account forename" required={true}></input>
                </span>
                
                <span className="w-full">
                    <p>Surname</p>
                    <input value={surname} onChange={(e) => setSurname(e.target.value)} placeholder="Account surname" required={true}></input>
                </span>
            </div>
            
            <span>
                <p>Email</p>
                <input value={email} onChange={(e) => setEmail(e.target.value)} placeholder="Account email" required={true}></input>
            </span>

            <button type="submit">Confirm</button>
        </form>
    );
};