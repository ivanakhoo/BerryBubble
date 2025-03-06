import React, { useRef, useState } from 'react';
import { Form, Button, Card, CardBody, FormLabel, FormGroup, FormControl, Alert } from 'react-bootstrap';
// @ts-ignore
import { AuthProvider, useAuth } from "../contexts/AuthContext";
import { Link, useNavigate } from 'react-router-dom';

export default function Signup() {
    const emailRef = useRef<HTMLInputElement>(null);
    const passwordRef = useRef<HTMLInputElement>(null);
    const passwordConfirmRef = useRef<HTMLInputElement>(null);
    const { signup } = useAuth();
    const [error, setError] = useState('');
    const [loading, setLoading] = useState(false)
    const navigate = useNavigate()

    async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
        e.preventDefault();

        if (passwordRef.current?.value !== passwordConfirmRef.current?.value) {
            return setError('Passwords do not match.');
        }
        
        try {
            setError('')
            setLoading(true)
            await signup(emailRef.current?.value, passwordRef.current?.value)
            alert("Your account has been successfully signed up. Please check your email for a verification link.")
            navigate('/')
        } catch {
            setError('Failed to create an account.')
        }

        setLoading(false)
    }

    return (
        <><div>
            <h1 className="display-2 text-center text-primary mb-4">Berry Bubble</h1>
        </div>
            <Card>
                <CardBody>
                    <h2 className="text-center mb-4">Sign Up</h2>
                    {error && <Alert variant="danger">{error}</Alert>}
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

                        <Button disabled={loading} className="w-100 mt-2" type="submit">Sign Up</Button>
                    </Form>
                </CardBody>
            </Card>

            <div className="w-100 text-center mt-2">
                Already have an account? <Link to="/login">Log in</Link>
            </div>
        </>
    );
}
