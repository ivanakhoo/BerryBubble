// components/AccountDetails.tsx
import { FormEventHandler, RefObject } from "react";
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
}

interface AccountDetailsProps {
    user: User;
    bioRef: RefObject<HTMLTextAreaElement>;
    gradYearRef: RefObject<HTMLInputElement>;
    firstRef: RefObject<HTMLInputElement>;
    lastRef: RefObject<HTMLInputElement>;
    displayRef: RefObject<HTMLInputElement>;
    gitHubRef: RefObject<HTMLInputElement>;
    linkedInRef: RefObject<HTMLInputElement>;
    jobTitleRef: RefObject<HTMLInputElement>;
    companyRef: RefObject<HTMLInputElement>;
    onSubmit: FormEventHandler<HTMLFormElement>;
    message?: string;
    loading: boolean;
}

export default function AccountDetails({
    user,
    bioRef,
    gradYearRef,
    firstRef,
    lastRef,
    displayRef,
    gitHubRef,
    linkedInRef,
    jobTitleRef,
    companyRef,
    onSubmit,
    message,
    loading
}: AccountDetailsProps) {
    return (
        <Form onSubmit={onSubmit}>
            <FormGroup>
                <FormLabel>First Name</FormLabel>
                <FormControl type="text" ref={firstRef} defaultValue={user?.FirstName} required />
            </FormGroup>
            <FormGroup>
                <FormLabel>Last Name</FormLabel>
                <FormControl type="text" ref={lastRef} defaultValue={user?.LastName} required />
            </FormGroup>
            <FormGroup>
                <FormLabel>Display Name</FormLabel>
                <FormControl type="text" ref={displayRef} defaultValue={user?.DisplayName} required />
            </FormGroup>
            <FormGroup>
                <FormLabel>Bio</FormLabel>
                <FormControl as="textarea" ref={bioRef} defaultValue={user?.Bio} required />
            </FormGroup>
            <FormGroup>
                <FormLabel>Graduation Year</FormLabel>
                <FormControl type="text" ref={gradYearRef} defaultValue={user?.GradYear} required />
            </FormGroup>
            <FormGroup>
                <FormLabel>GitHub URL</FormLabel>
                <FormControl type="url" ref={gitHubRef} defaultValue={user?.GitHub} />
            </FormGroup>
            <FormGroup>
                <FormLabel>LinkedIn URL</FormLabel>
                <FormControl type="url" ref={linkedInRef} defaultValue={user?.LinkedIn} />
            </FormGroup>
            <FormGroup>
                <FormLabel>Job Title</FormLabel>
                <FormControl type="text" ref={jobTitleRef} defaultValue={user?.JobTitle} />
            </FormGroup>
            <FormGroup>
                <FormLabel>Company</FormLabel>
                <FormControl type="text" ref={companyRef} defaultValue={user?.Company} />
            </FormGroup>

            <Button disabled={loading} type="submit" className="mt-3">
                Update Profile
            </Button>

            {message && <p className="mt-2 text-success">{message}</p>}
        </Form>
    );
}
