import { useState } from "react";

export const MessageForm = ({
    onSendMessage,
    disabled = false,
}: {
    onSendMessage: (text: string) => void;
    disabled?: boolean;
}) => {
    const [text, setText] = useState("");

    const handleSubmit = (event: React.FormEvent<HTMLFormElement>) => {
        event.preventDefault();
        const message = text.trim();
        if (!message || disabled) return;

        onSendMessage(message);
        setText("");
    };
    
    return (
        <form onSubmit={handleSubmit}>
            <input
                value={text}
                onChange={(event) => setText(event.target.value)}
                placeholder="Type a message"
                required
                disabled={disabled}
            />
            <button type="submit" disabled={disabled}>Send</button>
        </form>
    );
};