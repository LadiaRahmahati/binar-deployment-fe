import { useEffect, useRef, useState } from "react";
import { Form, Container, Button, Alert } from "react-bootstrap";
import axios from "axios";
import { useNavigate, useParams } from "react-router-dom";

export default function UpdatePosts() {
    const navigate = useNavigate();
    const { id } = useParams();

    const [data, setData] = useState([]);

    const titleField = useRef("");
    const descriptionField = useRef("");
    const [pictureField, setPictureField] = useState();

    const [errorResponse, setErrorResponse] = useState({
        isError: false,
        message: "",
    });

    const onupdate = async (e) => {
        e.preventDefault();

        try {
            const token = localStorage.getItem("token");
            // const userToUpdatePayload = {
            //     title: titleField.current.value,
            //     description: descriptionField.current.value,
            // };
            const userToUpdatePayload = new FormData();

            userToUpdatePayload.append("title", titleField.current.value);
            userToUpdatePayload.append("description", descriptionField.current.value);
            userToUpdatePayload.append("picture", pictureField);

            const updateRequest = await axios.put(
                `https://binar-instagram-api-clone.herokuapp.com/posts/${id}`, userToUpdatePayload, {
                headers: {
                    "Content-Type": "multipart/form-data",
                    Authorization: `Bearer ${token}`,
                },
            }
            );

            const updateResponse = updateRequest.data;

            if (updateResponse.status) navigate("/");
        } catch (err) {
            const response = err.response.data;

            setErrorResponse({
                isError: true,
                message: response.message,
            });
        }
    };

    const getPosts = async () => {
        try {

            const responsePosts = await axios.get(`http://localhost:2000/api/posts/${id}`)

            const dataPosts = await responsePosts.data.data.getdata;

            setData(dataPosts)
            console.log(dataPosts);
        } catch (err) {
            console.log(err);
        }
    }

    useEffect(() => {
        getPosts();
    }, [])

    console.log(data);

    return (
        <Container className="my-5">
            <h1 className="mb-3 text-center">Update Postingan</h1>
            <Form onSubmit={onupdate}>
                <Form.Group className="mb-3">
                    <Form.Label>Title</Form.Label>
                    <Form.Control
                        type="text"
                        ref={titleField}
                        defaultValue={data.title}
                    />
                </Form.Group>
                <Form.Group className="mb-3">
                    <Form.Label>Description</Form.Label>
                    <Form.Control
                        type="text"
                        ref={descriptionField}
                        defaultValue={data.description}
                    />
                </Form.Group>
                <Form.Group className="mb-3">
                    <Form.Label>Picture</Form.Label>
                    <Form.Control
                        type="file"
                        onChange={(e) => setPictureField(e.target.files[0])}
                    />
                </Form.Group>
                {errorResponse.isError && (
                    <Alert variant="danger">{errorResponse.message}</Alert>
                )}
                <Button className="w-100" type="submit">
                    Kirim
                </Button>
            </Form>
        </Container>
    )
}