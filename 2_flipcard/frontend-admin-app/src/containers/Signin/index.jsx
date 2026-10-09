import React, { useState } from 'react';
import Layout from '../../components/Layout';
import { Container, Form, Row, Col, Button } from 'react-bootstrap';
import { login } from '../../redux/actions/auth.actions';
import Input from '../../components/UI/Input';
import { useDispatch, useSelector } from 'react-redux';
import { Navigate } from 'react-router-dom';
import { toast } from 'react-hot-toast';



const Signin = () => {

    const dispatch = useDispatch();
    const [email, setEmail] = useState('admin@mail.ru');
    const [password, setPassword] = useState('12345678');
    const auth = useSelector(state => state.auth);
    const user = useSelector((state) => state.user);

    const userLogin = (e) => {
        e.preventDefault();
        const user = { email, password }
        dispatch(login(user, toast));
    }

    if (auth.authenticate) {
        return <Navigate to="/" />
    }

    return (
        <Layout>
            <Container>
                <Row style={{ marginTop: '150px' }}>
                    <Col md={{ span: 6, offset: 3 }}>
                        <Form onSubmit={userLogin}>
                            <Input label="Email" placeholder="Email" value={email} type="email" onChange={(e) => setEmail(e.target.value)} />
                            <br />
                            <Input label="Password" placeholder="Password" value={password} type="password" onChange={(e) => setPassword(e.target.value)} />
                            <br />
                            <Button variant="primary" type="submit">
                                {'Submit'}
                            </Button>
                        </Form>
                    </Col>
                </Row>
            </Container>
        </Layout>
    )

}

export default Signin