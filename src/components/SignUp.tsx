import React, { useRef, useState } from 'react';
import { Form, Button, Card, CardBody, FormLabel, FormGroup, FormControl } from 'react-bootstrap';
// @ts-ignore
import { AuthProvider, useAuth } from "../contexts/AuthContext";

export default function Signup() {
    const emailRef = useRef<HTMLInputElement>(null);
    const passwordRef = useRef<HTMLInputElement>(null);
    const passwordConfirmRef = useRef<HTMLInputElement>(null);
    const { signup } = useAuth();
    const [error, setError] = useState('');
    const [loading, setLoading] = useState(false)

    async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
        e.preventDefault();

        if (passwordRef.current?.value !== passwordConfirmRef.current?.value) {
            return setError('Passwords do not match.');
        }
        
        try {
            setError('')
            await signup(emailRef.current?.value, passwordRef.current?.value)
        } catch {
            setError('Failed to create an account.')
        }
        if (emailRef.current && passwordRef.current) {
            signup(emailRef.current.value, passwordRef.current.value);
        }
    }

    return (
        <>
            <Card>
                <CardBody>
                    <h2 className="text-center mb-4">Sign Up</h2>
                    <Form onSubmit={handleSubmit}>
                        <FormGroup id="email">
                            <FormLabel>Email</FormLabel>
                            <FormControl type="email" ref={emailRef} required />
                        </FormGroup>

                        <FormGroup id="password">
                            <FormLabel>Password</FormLabel>
                            <FormControl type="password" ref={passwordRef} required />
                        </FormGroup>

                        <FormGroup id="password-confirm">
                            <FormLabel>Password Confirmation</FormLabel>
                            <FormControl type="password" ref={passwordConfirmRef} required />
                        </FormGroup>

                        <Button className="w-100 mt-2" type="submit">Sign Up</Button>
                    </Form>
                </CardBody>
            </Card>

            <div className="w-100 text-center mt-2">
                Already have an account? Log in
            </div>
        </>
    );
}
