import { useState, useEffect } from "react";
import { User } from "@prototype/types";
import { getAllUsers, updateUser, forcePasswordReset, createAccountAdmin } from "../Services/Users.service";
import { DataTable } from "./DataTable";

export function UserTable() {
    const [users, setUsers] = useState<User[]>([]);
    const [editingId, setEditingId] = useState<number | null>(null);
    const [creating, setCreating] = useState(false);

    const [username, setUsername] = useState("");
    const [email, setEmail] = useState("");

    // Gets all users and sets the users state to the API's output
    useEffect(() => {
        (async () => {
            const body = await getAllUsers();
            setUsers(body.body);
        })();
    }, []);

    // Resets state when switching between entries
    const reset = () => {
        setUsername("");
        setEmail("");
        setEditingId(null);
        setCreating(false);
    };

    // Saves the creation of a brand new account
    const saveCreate = async () => {
        const res = await createAccountAdmin(email, username);

        if (res) {
            const fresh = await getAllUsers();
            setUsers(fresh.body);

            reset();
        }
    };

    const saveUpdate = async (id: number) => {
        await updateUser(email, username, id);
        
        const fresh = await getAllUsers();
        setUsers(fresh.body);

        reset();
    };

    return (
        <DataTable data={users} isEditing={(u) => u.id === editingId} onAdd={() => setCreating(true)}
            columns={[
                {
                    header: "id",
                    render: (u) => u.id,
                },

                {
                    header: "Username",
                    render: (u) => u.name,
                },

                {
                    header: "Email",
                    render: (u) => u.email,
                },

                {
                    header: "Birthday",
                    render: (u) => u.dob,
                },

                {
                    header: "canBeSignedInto",
                    render: (u) => u.can_be_signed_into,
                },

                {
                    header: "mustResetPassword",
                    render: (u) => u.must_reset_password,
                },

                {
                    header: "role",
                    render: (u) => u.role.name,
                },
            ]}
        />
    );
}

