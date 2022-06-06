import { Link, Navigate } from "react-router-dom";
import { Button, Alert, Container, Row, Col, Card, DropdownButton, Dropdown } from "react-bootstrap";
import { useEffect, useState } from "react";
import axios from "axios";
import { addUser } from "../slices/userSlice";
import { useDispatch } from "react-redux";


function Home() {
  const dispatch = useDispatch();
  const [isLoggedIn, setIsLoggedIn] = useState(true);
  const [user, setUser] = useState({});

  const [data, setData] = useState([]);

  const styleBtn = {
    borderRadius: "0px",
  };





  useEffect(() => {

    const fetchData = async () => {
      try {
        // Check status user login
        // 1. Get token from localStorage
        const token = localStorage.getItem("token");

        // 2. Check token validity from API
        const currentUserRequest = await axios.get(
          "https://binar-instagram-api-clone.herokuapp.com/auth/me",
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }
        );

        const currentUserResponse = currentUserRequest.data;

        if (currentUserResponse.status) {
          dispatch(
            addUser({
              user: currentUserResponse.data.user,
              token: token,
            })
          )
          setUser(currentUserResponse.data.user);
        }
      } catch (err) {
        setIsLoggedIn(false);
      }
    };

    fetchData();
    posts();
  }, []);

  const logout = () => {
    localStorage.removeItem("token");

    setIsLoggedIn(false);
    setUser({});
  };

  const posts = async () => {
    try {
      const dataPosts = await axios.get(
        `https://binar-instagram-api-clone.herokuapp.com/api/posts`
      )

      const payloadData = await dataPosts.data.data.getDataAll;

      setData(payloadData)
    } catch (err) {
      console.log(err);
    }
  }


  return isLoggedIn ? (
    <div className="p-3">
        <DropdownButton id="dropdown-basic-button" className="ml-auto mb-3 text-black fw-bold " variant="outline-danger" style={styleBtn} title={user.name}>
          <Dropdown.Item href="#/action-1" variant="danger"
            onClick={(e) => logout(e)}>Logout</Dropdown.Item>
        </DropdownButton>

      {/* <Alert>Selamat datang {user.name}</Alert>
      <div>

      </div> */}
      <Link to="/about">
        <Button variant="success">About page</Button>
      </Link>
      <Link className="ms-5" to="/create">
        <Button variant="primary">Create Post</Button>
      </Link>
      <Row>

        {data.map((data) => (
          <Col md={4} key={data.id}>
            <Card style={{ marginTop: "2rem" }} key={data.id}>
              <Card.Img
                variant="top"
                src={`https://binar-instagram-api-clone.herokuapp.com/public/files/${data.picture}`}
                style={{ width: "80%", alignSelf: "center" }}
              />

              <div className="card-body">
                <h5 className="card-title bold">
                  {data.title}
                </h5>
                <p
                  className="card-text"
                  style={{ height: "100%", textAlign: "justify" }}
                >
                  {data.description}
                </p>
                <Link className="ms-5" to={`/update/${data.id}`}>
                  <Button variant="warning">Edit</Button>
                </Link>
                <Link className="ms-5" to={`/delete/${data.id}`}>
                  <Button variant="danger">Delete</Button>
                </Link>
              </div>
            </Card>
          </Col>
        ))}
      </Row>

      {/* <Table striped bordered hover className="mt-3">
        <thead>
          <tr>
            <th>#</th>
            <th>Title</th>
            <th>Description</th>
            <th>Action</th>
          </tr>
        </thead>
        <tbody>
          {data.map((data) => (
            <tr key={data.id}>
              <td>{data.id}</td>
              <td>{data.title}</td>
              <td>{data.description}</td>
              <td><Link className="ms-5" to={`/update/${data.id}`}>
                <Button variant="warning">Go to edit post page</Button>
              </Link>
              </td>
              <td><Link className="ms-5" to={`/delete/${data.id}`}>
                <Button variant="danger">Go to delete post page</Button>
              </Link>
              </td>
            </tr>
          ))}
        </tbody>
      </Table> */}
    </div>
  ) : (
    <Navigate to="/login" replace />
  );
}

export default Home;