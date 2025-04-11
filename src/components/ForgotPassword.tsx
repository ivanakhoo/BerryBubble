import React, { useRef, useState } from 'react';
import { Form, Button, Card, CardBody, FormLabel, FormGroup, FormControl, Alert } from 'react-bootstrap';
// @ts-ignore
import { AuthProvider, useAuth } from "../contexts/AuthContext";
import { Link } from 'react-router-dom';

export default function ForgotPassword() {
    const emailRef = useRef<HTMLInputElement>(null);
    const { resetPassword } = useAuth();
    const [error, setError] = useState('');
    const [loading, setLoading] = useState(false);
    const [message, setMessage] = useState("")

    async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
        e.preventDefault();
        
        try {
            setMessage('')
            setError('')
            setLoading(true)
            await resetPassword(emailRef.current?.value)
            setMessage('Check your inbox for further instructions.')
        } catch {
            setError('Failed to reset password.')
        }

        setLoading(false)
    }

    return (
        <><div>
            <h1 className="display-2 text-center mb-4">Berry Bubble</h1>
        </div>
            <Card>
                <CardBody>
                    <h2 className="text-center mb-4">Password Reset</h2>
                    {error && <Alert variant="danger">{error}</Alert>}
                    {message && <Alert variant="success">{message}</Alert>}
                    <Form onSubmit={handleSubmit}>
                        <FormGroup id="email">
                            <FormLabel>Email</FormLabel>
                            <FormControl type="email" ref={emailRef} required />
                        </FormGroup>

                        <Button disabled={loading} className="w-100 mt-2" type="submit">Reset Password</Button>
                    </Form>
                    <div className="w-100 text-center mt-3">
                        <Link to="/login">Login</Link>
                    </div>
                </CardBody>
            </Card>

            <div className="w-100 text-center mt-2">
                Need an account? <Link to="/signup">Sign up</Link>
            </div>
        </>
    );
}