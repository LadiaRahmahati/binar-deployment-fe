import { useRef, useState } from "react";
import { Form, Container, Button, Alert } from "react-bootstrap";
import axios from "axios";
import { Link, useNavigate } from "react-router-dom";
import { GoogleOAuthProvider, GoogleLogin } from "@react-oauth/google";

export default function Login() {
    const navigate = useNavigate();

    const emailField = useRef("");
    const passwordField = useRef("");

    const [errorResponse, setErrorResponse] = useState({
        isError: false,
        message: "",
    });

    const onLogin = async (e) => {
        e.preventDefault();

        try {
            const userToLoginPayload = {
                email: emailField.current.value,
                password: passwordField.current.value,
            };

            const loginRequest = await axios.post(
                "https://binar-instagram-api-clone.herokuapp.com/auth/login",
                userToLoginPayload
            );

            const loginResponse = loginRequest.data;

            if (loginResponse.status) {
                localStorage.setItem("token", loginResponse.data.token);

                navigate("/");
            }
        } catch (err) {
            console.log(err);
            const response = err.response.data;

            setErrorResponse({
                isError: true,
                message: response.message,
            });
        }
    };
    const onLoginGoogleSuccess = async (credentialResponse) => {
        console.log(credentialResponse);
        try {
            const userToLoginPayload = {
                google_credential: credentialResponse.credential,
            };

            const loginGoogleRequest = await axios.post(
                "https://binar-instagram-api-clone.herokuapp.com/auth/login-google",
                userToLoginPayload
            );

            const loginGoogleResponse = loginGoogleRequest.data;

            if (loginGoogleResponse.status) {
                localStorage.setItem("token", loginGoogleResponse.data.token);

                navigate("/");
            }
        } catch (err) {
            console.log(err);
        }
    };

    return (
        <Container className="my-5 w-25">
            <h1 className="mb-3 text-center">Form Login</h1>
            <Form onSubmit={onLogin}>
                <Form.Group className="mb-3">
                    <Form.Label>Email</Form.Label>
                    <Form.Control type="text" ref={emailField} placeholder="Email" />
                </Form.Group>
                <Form.Group className="mb-3">
                    <Form.Label>Password</Form.Label>
                    <Form.Control
                        type="password"
                        ref={passwordField}
                        placeholder="Password"
                    />
                </Form.Group>
                {errorResponse.isError && (
                    <Alert variant="danger">{errorResponse.message}</Alert>
                )}
                <div className="text-center d-flex mb-3 ">
                    <Button className="w-100 text-center" type="submit">
                        Masuk
                    </Button>
                </div>
                <GoogleOAuthProvider clientId="1002609026534-24j7f3r7rkbfdnvkg7na4be0fijl53aj.apps.googleusercontent.com">
                    <GoogleLogin
                        onSuccess={onLoginGoogleSuccess}
                        onError={() => {
                            console.log("Login Failed");
                        }}
                    />
                </GoogleOAuthProvider>
            </Form>
            <p className="mt-3">
                Anda belum memiliki akun ?{" "}
                <Link to="/register" className="text-decoration-none">
                    Daftar
                </Link>
            </p>
        </Container>

    );
}