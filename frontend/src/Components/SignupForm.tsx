import { useAuth } from "../Context/Authentication";
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { signup } from "../Services/Users.service";

export const SignupForm = () => {
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");

    const [forename, setForename] = useState("");
    const [surname, setSurname] = useState("");
    const [dob, setDob] = useState("");

    const navigate = useNavigate();
    const { refreshUser } = useAuth();

    const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
        event.preventDefault();

        try {
            if (await signup(email, forename, surname, password, dob)) {
                await refreshUser();
                navigate("/account")
            }
        } catch (err: any) {
            alert(err.message);
        }
    }
    
    return (
        <form onSubmit={handleSubmit} className="flex flex-col gap-3">
            <input value={forename} onChange={(e) => setForename(e.target.value)} placeholder="Your first name" required={true}></input>
            <input value={surname} onChange={(e) => setSurname(e.target.value)} placeholder="Your surname" required={true}></input>
            <input value={email} onChange={(e) => setEmail(e.target.value)} placeholder="Your email" required={true}></input>
            <input value={dob} onChange={(e) => setDob(e.target.value)} type="date" required={true} aria-label="Date of birth"></input>
            <input onChange={(e) => setPassword(e.target.value)} placeholder="Password" type="password"></input>
            <button type="submit">Signup</button>
        </form>
    );
};