import React, { useRef, useState } from 'react';
import { Form, Button, Card, CardBody, FormLabel, FormGroup, FormControl, Alert } from 'react-bootstrap';
// @ts-ignore
import { AuthProvider, useAuth } from "../contexts/AuthContext";
import { Link, useNavigate } from 'react-router-dom';

export default function UpdateProfile() {
    const emailRef = useRef<HTMLInputElement>(null);
    const passwordRef = useRef<HTMLInputElement>(null);
    const passwordConfirmRef = useRef<HTMLInputElement>(null);
    const bioRef = useRef<HTMLInputElement>(null); 
    const gradYearRef = useRef<HTMLInputElement>(null); 
    const firstRef = useRef<HTMLInputElement>(null); 
    const lastRef = useRef<HTMLInputElement>(null); 
    const displayRef = useRef<HTMLInputElement>(null); 
    const { currentUser, upEmail, upPassword, upBio, upGradYear, upFirstName, upLastName, upDisplayName } = useAuth();
    const [error, setError] = useState('');
    const [loading, setLoading] = useState(false)
    const navigate = useNavigate()

    function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
        e.preventDefault();
    
        if (passwordRef.current?.value !== passwordConfirmRef.current?.value) {
            return setError('Passwords do not match.');
        }
    
        const promises = [];
        setLoading(true);
        setError('');
    
        if (emailRef.current?.value !== currentUser.email) {
            promises.push(
                upEmail(emailRef.current?.value).then(() => {
                    alert("Check your new email for a verification link.");
                })
            );
        }
    
        if (passwordRef.current?.value) {
            promises.push(upPassword(passwordRef.current?.value));
        }

        if (bioRef.current?.value) {
            promises.push(upBio(bioRef.current?.value)); 
        }

        if (gradYearRef.current?.value) {
            promises.push(upGradYear(gradYearRef.current?.value)); 
        }

        if (firstRef.current?.value) {
            promises.push(upFirstName(firstRef.current?.value)); 
        }

        if (lastRef.current?.value) {
            promises.push(upLastName(lastRef.current?.value)); 
        }

        if (displayRef.current?.value) {
            promises.push(upDisplayName(displayRef.current?.value)); 
        }
    
        Promise.all(promises)
            .then(() => {
                navigate('/');
            })
            .catch(() => {
                setError('Failed to update account.');
            })
            .finally(() => {
                setLoading(false);
            });
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

                        <FormGroup id="bio">
                            <FormLabel>Bio</FormLabel>
                            <FormControl type="text" ref={bioRef} placeholder="Enter your new bio." />
                        </FormGroup>

                        <FormGroup id="gradYear">
                            <FormLabel>Graduation Year</FormLabel>
                            <FormControl type="text" ref={gradYearRef} placeholder="Enter your graduation year." />
                        </FormGroup>

                        <FormGroup id="firstName">
                            <FormLabel>First Name</FormLabel>
                            <FormControl type="text" ref={firstRef} placeholder="Enter your first name." />
                        </FormGroup>

                        <FormGroup id="lastName">
                            <FormLabel>Last Name</FormLabel>
                            <FormControl type="text" ref={lastRef} placeholder="Enter your last name." />
                        </FormGroup>

                        <FormGroup id="displayName">
                            <FormLabel>Display Name</FormLabel>
                            <FormControl type="text" ref={displayRef} placeholder="Enter your preferred display name." />
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
