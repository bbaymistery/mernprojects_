import React, { useState } from "react";
import Layout from "../../components/Layout";
import { Container, Form, Row, Col, Button } from "react-bootstrap";
import Input from "../../components/UI/Input";
import { useEffect } from "react";
import { Navigate } from "react-router-dom";
import { signup } from "../../redux/actions/user.action";
import { useDispatch, useSelector } from "react-redux";


const Signup = () => {

  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const auth = useSelector((state) => state.auth);
  const user = useSelector((state) => state.user);
  const dispatch = useDispatch();

  useEffect(() => {
    if (!user.loading) {
      setFirstName("");
      setLastName("");
      setEmail("");
      setPassword("");
    }
  }, [user.loading]);

  const userSignup = (e) => {
    e.preventDefault();
    const user = { firstName, lastName, email, password, };
    dispatch(signup(user));
  };

  // if (auth.authenticate) {
  //   return <Navigate to="/" />
  // }

  if (user.loading) {
    return <p>Loading...!</p>;
  }

  return (
    <Layout>
      <Container>
        <Row style={{ marginTop: "150px" }} >
          <Col md={{ span: 6, offset: 3 }} >
            {user.message} 
            <a style={{marginLeft:"10px"}} href="/signin">Click to Signin</a>
            <br />
            <br />
            <Form onSubmit={userSignup}>
              <Row>
                <Col md={6}>
                  <Input label="First Name" placeholder="First Name" value={firstName} type="text" onChange={(e) => setFirstName(e.target.value)} />
                </Col>
                <Col md={6}>
                  <Input label="Last Name" placeholder="Last Name" value={lastName} type="text" onChange={(e) => setLastName(e.target.value)} />
                </Col>
              </Row>
              <br />
              <Input label="Email" placeholder="Email" value={email} type="email" onChange={(e) => setEmail(e.target.value)} />
              <br />
              <Input label="Password" placeholder="Password" value={password} type="password" onChange={(e) => setPassword(e.target.value)} />
              <br />
              <Button variant="primary" type="submit">
                Submit
              </Button>
            </Form>
          </Col>
        </Row>
      </Container>
    </Layout >
  );
};

export default Signup;
