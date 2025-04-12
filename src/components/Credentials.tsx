import { RefObject, FormEventHandler } from "react";
import { Form, FormGroup, FormLabel, FormControl, Button } from "react-bootstrap";

interface User {
    FirstName?: string;
    LastName?: string;
    DisplayName?: string;
    Bio?: string;
    GradYear?: string;
    GitHub?: string;
    LinkedIn?: string;
    JobTitle?: string;
    Company?: string;
    email?: string;
}

interface CredentialsProps {
    user: User;
    emailRef: RefObject<HTMLInputElement>;
    passwordRef: RefObject<HTMLInputElement>;
    passwordConfirmRef: RefObject<HTMLInputElement>;
    onSubmit: FormEventHandler<HTMLFormElement>;
    loading: boolean;
    message?: string;
}

export default function Credentials({
    user,
    emailRef,
    passwordRef,
    passwordConfirmRef,
    onSubmit,
    loading,
    message
}: CredentialsProps) {
    return (
        <Form onSubmit={onSubmit}>
            <FormGroup>
                <FormLabel>Email</FormLabel>
                <FormControl type="email" ref={emailRef} required defaultValue={user?.email}/>
            </FormGroup>
            <FormGroup>
                <FormLabel>New Password</FormLabel>
                <FormControl type="password" ref={passwordRef} placeholder="Leave blank to keep the same" />
            </FormGroup>
            <FormGroup>
                <FormLabel>Confirm Password</FormLabel>
                <FormControl type="password" ref={passwordConfirmRef} placeholder="Leave blank to keep the same" />
            </FormGroup>

            <Button disabled={loading} type="submit" className="mt-3">
                Update Credentials
            </Button>

            {message && <p className="mt-2 text-success">{message}</p>}
        </Form>
    );
}
