import React, { useRef, useState } from 'react';
import { Form, Button, Card, CardBody, FormLabel, FormGroup, FormControl, Alert } from 'react-bootstrap';
// @ts-ignore
import { AuthProvider, useAuth } from "../contexts/AuthContext";
import { Link, useNavigate } from 'react-router-dom';

export default function Login() {
    const emailRef = useRef<HTMLInputElement>(null);
    const passwordRef = useRef<HTMLInputElement>(null);
    const { login } = useAuth();
    const [error, setError] = useState('');
    const [loading, setLoading] = useState(false);
    const navigate = useNavigate();

    async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
        e.preventDefault();
        
        try {
            setError('')
            setLoading(true)
            await login(emailRef.current?.value, passwordRef.current?.value)
            navigate('/')
        } catch {
            setError('Failed to log in.')
        }

        setLoading(false)
    }

    return (
        <><div>
            <h1 className="display-2 text-center text-primary mb-4">Berry Bubble</h1>
        </div>
            <Card>
                <CardBody>
                    <h2 className="text-center mb-4">Log In</h2>
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

                        <Button disabled={loading} className="w-100 mt-2" type="submit">Log In</Button>
                    </Form>
                    <div className="w-100 text-center mt-3">
                        <Link to="/forgot-password">Forgot Password?</Link>
                    </div>
                </CardBody>
            </Card>

            <div className="w-100 text-center mt-2">
                Need an account? <Link to="/signup">Sign up</Link>
            </div>
        </>
    );
}
