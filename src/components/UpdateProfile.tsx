import React, { useRef, useState } from 'react';
import { Form, Button, Card, CardBody, FormLabel, FormGroup, FormControl, Alert } from 'react-bootstrap';
// @ts-ignore
import { AuthProvider, useAuth } from "../contexts/AuthContext";
import { Link, useNavigate } from 'react-router-dom';

// updateEmail is deprecated and is not working.
export default function UpdateProfile() {
    const emailRef = useRef<HTMLInputElement>(null);
    const passwordRef = useRef<HTMLInputElement>(null);
    const passwordConfirmRef = useRef<HTMLInputElement>(null);
    const { currentUser, upEmail, upPassword } = useAuth();
    const [error, setError] = useState('');
    const [loading, setLoading] = useState(false)
    const navigate = useNavigate()

    function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
        e.preventDefault();

        if (passwordRef.current?.value !== passwordConfirmRef.current?.value) {
            return setError('Passwords do not match.');
        }

        const promises = []
        setLoading(true)
        setError('')
        if (emailRef.current?.value !== currentUser.email) {
            promises.push(upEmail(emailRef.current?.value))
        }

        if (passwordRef.current?.value) {
            promises.push(upPassword(passwordRef.current?.value))
        }

        Promise.all(promises).then(() => {
            navigate('/')
        }).catch(() => {
            setError('Failed to update account.')
        }).finally(() => {
            setLoading(false)
        })
        
    }

    return (
        <><div>
            <h1 className="display-2 text-center text-primary mb-4">Berry Bubble</h1>
        </div>
            <Card>
                <CardBody>
                    <h2 className="text-center mb-4">Update Profile</h2>
                    {error && <Alert variant="danger">{error}</Alert>}
                    <Form onSubmit={handleSubmit}>
                        <FormGroup id="email">
                            <FormLabel>Email</FormLabel>
                            <FormControl type="email" ref={emailRef} required defaultValue={currentUser.email} />
                        </FormGroup>

                        <FormGroup id="password">
                            <FormLabel>Password</FormLabel>
                            <FormControl type="password" ref={passwordRef} placeholder="Leave blank to keep the same."/>
                        </FormGroup>

                        <FormGroup id="password-confirm">
                            <FormLabel>Password Confirmation</FormLabel>
                            <FormControl type="password" ref={passwordConfirmRef} placeholder="Leave blank to keep the same."/>
                        </FormGroup>

                        <Button disabled={loading} className="w-100 mt-2" type="submit">Update</Button>
                    </Form>
                </CardBody>
            </Card>

            <div className="w-100 text-center mt-2">
                <Link to="/">Cancel</Link>
            </div>
        </>
    );
}
