import React, { useEffect, useState } from 'react'
import { useDispatch, useSelector } from 'react-redux';
import Layout from '../../components/Layout';
import { createPage } from '../../redux/actions/page.action';
import { Button, Col, Container, Modal, Row } from 'react-bootstrap';
import Input from '../../components/UI/Input';
const linearCategories = (categories, options = []) => {

    for (let category of categories) {
        options.push({
            value: category._id,
            name: category.name,
            parentId: category.parentId,
            type: category.type
        });
        if (category.children.length > 0) {
            linearCategories(category.children, options)
        }
    }

    return options;
}


const NewPage = () => {

    const [createModal, setCreateModal] = useState(false);
    const category = useSelector(state => state.category);
    const [categories, setCategories] = useState([]);


    const [title, setTitle] = useState('');
    const [categoryId, setCategoryId] = useState('');
    const [desc, setDesc] = useState('');
    const [type, setType] = useState('');
    const [banners, setBanners] = useState([]);
    const [products, setProducts] = useState([]);


    const dispatch = useDispatch();
    const page = useSelector(state => state.page);

    useEffect(() => {
        setCategories(linearCategories(category.categories));
    }, [category]);

    useEffect(() => {
        console.log(page);
        if (!page.loading) {
            setCreateModal(false);
            setTitle('');
            setCategoryId('');
            setDesc('');
            setProducts([]);
            setBanners([]);
        }
    }, [page]);
    //ben category olusduruyorum ve sonra o categoriye uygun page olusduruyorum (productstore,page,)
    const onCategoryChange = (e) => {
        if (e.target.value.length) {
            const category = categories.find(category => category.value == e.target.value);
            setCategoryId(e.target.value);
            setType(category.type);
        }
    }


    const handleBannerImages = (e) => {
        console.log(e);
        setBanners([...banners, e.target.files[0]]);
    }

    const handleProductImages = (e) => {
        console.log(e);
        setProducts([...products, e.target.files[0]]);
    }

    const submitPageForm = () => {
        //e.target.preventDefault();

        if (title === "" || desc === "" || categoryId === "") {
            alert('Do not leave fields empty');
            return;
        }

        const form = new FormData();
        form.append('title', title);
        form.append('description', desc);
        form.append('category', categoryId);
        form.append('type', type);
        banners.forEach((banner) => {
            form.append('banners', banner);
        });
        products.forEach((product) => {
            form.append('products', product);
        });
        dispatch(createPage(form));
    }



    const renderCreatePageModal = () => {
        return (
            <Modal show={createModal} modalTitle={'Create New Page'} handleClose={() => setCreateModal(false)} onSubmit={submitPageForm}   >
                <Modal.Header >
                    <Modal.Title>Create New Page</Modal.Title>
                </Modal.Header>
                <Container>
                    <br />
                    <Row style={{ marginBottom: '10px' }}>
                        <Col>
                            <Input type="select" value={categoryId} onChange={onCategoryChange} options={categories} placeholder={'Select Category'} />
                        </Col>
                    </Row>
                    <Row style={{ marginBottom: '10px' }}>
                        <Col>
                            <Input value={title} onChange={(e) => setTitle(e.target.value)} placeholder={'Page Title'} className="" />
                        </Col>
                    </Row>
                    <Row style={{ marginBottom: '10px' }}>
                        <Col>
                            <Input value={desc} onChange={(e) => setDesc(e.target.value)} placeholder={'Page Desc'} className="" />
                        </Col>
                    </Row>

                    {
                        banners.length > 0 ?
                            banners.map((banner, index) =>
                                <Row style={{ marginBottom: '10px' }} key={index}>
                                    <Col>{banner.name}</Col>
                                </Row>
                            ) : null
                    }
                    <Row style={{ marginBottom: '10px' }}>
                        <Col>
                            <Input label="Banners" className="form-control" type="file" name="banners" onChange={handleBannerImages} />
                        </Col>
                    </Row>

                    {products.length > 0 ? products.map((product, index) =>
                        <Row key={index}>
                            <Col>{product.name}</Col>
                        </Row>) : null}
                    <Row style={{ marginBottom: '15px' }}>
                        <Col>
                            <Input label="Products" className="form-control" type="file" name="products" onChange={handleProductImages} />
                        </Col>
                    </Row>
                </Container>

                <Modal.Footer>
                    <Button variant="secondary" onClick={() => setCreateModal(false)}>Close</Button>
                    <Button variant="primary" onClick={submitPageForm}>Submit</Button>
                </Modal.Footer>
            </Modal>
        );
    }
    return (
        <Layout sidebar>
            {
                page.loading ?
                    <p>Creating Page...please wait</p>
                    :
                    <>
                        {renderCreatePageModal()}
                        <button onClick={() => setCreateModal(true)}>Create Page</button>
                    </>
            }

        </Layout>
    )
}

export default NewPage