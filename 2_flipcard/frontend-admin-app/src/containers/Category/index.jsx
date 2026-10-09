import React, { useEffect, useState } from 'react'
import { Container, Row, Col, Modal, Button } from 'react-bootstrap';
import Layout from '../../components/Layout'
import { IoIosCheckboxOutline, IoIosCheckbox, IoIosArrowForward, IoIosArrowDown, IoIosAdd, IoIosTrash, IoIosCloudUpload } from 'react-icons/io'
import './style.css';
import CheckboxTree from 'react-checkbox-tree';
import 'react-checkbox-tree/lib/react-checkbox-tree.css';
import { useDispatch, useSelector } from 'react-redux';
import { addCategory, getAllCategory, updateCategories ,deleteCategories} from '../../redux/actions/category.action';
import AddCategoryModal from './components/AddCategoryModal.jsx';
import UpdateCategoriesModal from './components/UpdateCategoriesModal.jsx';

const Category = () => {

    const dispatch = useDispatch();
    const category = useSelector(state => state.category);

    //?CheckboxTree states
    const [checked, setChecked] = useState([]);
    const [expanded, setExpanded] = useState([]);




    //general functions
    const createCategoryList = (categories, options = []) => {

        for (let category of categories) {
            options.push({
                value: category._id,
                name: category.name,
                parentId: category.parentId,
                type: category.type
            });
            if (category.children.length > 0) {
                createCategoryList(category.children, options)
            }
        }

        return options;
    }
    const renderCategories = (categories) => {
        let myCategories = [];
        for (let category of categories) {
            myCategories.push(
                {
                    label: category.name,
                    value: category._id,
                    children: category.children.length > 0 && renderCategories(category.children)
                }
            );
        }
        return myCategories;
    }
    const categoryList = createCategoryList(category.categories);
    //____________________________________________________________________________


    //!Starting Add Category Modal module states and function____
    const [showAddModalStatus, setShowAddModalStatus] = useState(false);
    const [categoryImage, setCategoryImage] = useState('');
    const [parentCategoryId, setParentCategoryId] = useState('');
    const [categoryName, setCategoryName] = useState('');
    //!onSubmit Function inside AddCategoryModal
    const handleCloseAddModal = () => {

        const form = new FormData();

        if (categoryName === "") {
            alert('Category name is required');
            setShowAddModalStatus(false);
            return;
        }

        form.append('name', categoryName);
        if (parentCategoryId !== 'select category') {
            form.append('parentId', parentCategoryId);
        }
        form.append('categoryImage', categoryImage);
        dispatch(addCategory(form));
        setCategoryName('');
        setParentCategoryId('');
        setShowAddModalStatus(false);
    }
    //!Show add modal 
    const handleShowAddModal = () => setShowAddModalStatus(true);
    const handleAddModalCategoryImage = (e) => setCategoryImage(e.target.files[0]);
    //!  Add Category Finish________________________________


    //todo Update Category Modal module states and functions
    const [checkedArray, setCheckedArray] = useState([]);
    const [expandedArray, setExpandedArray] = useState([]);
    const [updateCategoryModalStatus, setUpdateCategoryModalStatus] = useState(false);
    //here we change status of visibility add category modal to true
    const showUpdateModalCategory = () => {
        updateCheckedAndExpandedCategories();
        setUpdateCategoryModalStatus(true);
    }
    const updateCheckedAndExpandedCategories = () => {
        const categories = createCategoryList(category.categories);
        const checkedArray = [];
        const expandedArray = [];
        checked.length > 0 && checked.forEach((categoryId) => {
            const category = categories.find((category) => categoryId == category.value);
            category && checkedArray.push(category);
        })
        expanded.length > 0 && expanded.forEach((categoryId) => {
            const category = categories.find((category) => categoryId == category.value);
            category && expandedArray.push(category);
        })
        setCheckedArray(checkedArray);
        setExpandedArray(expandedArray);
    }
    const handleUpdateModalCategoryInput = (key, value, index, type) => {
        console.log(value);
        if (type == "checked") {
            const updatedCheckedArray = checkedArray.map((item, _index) => index == _index ? { ...item, [key]: value } : item);
            setCheckedArray(updatedCheckedArray);
        } else if (type == "expanded") {
            const updatedExpandedArray = expandedArray.map((item, _index) => index == _index ? { ...item, [key]: value } : item);
            setExpandedArray(updatedExpandedArray);
        }
    }
    const updateCategoriesForm = () => {
        const form = new FormData();
        expandedArray.forEach((item) => {
            form.append('_id', item.value);
            form.append('name', item.name);
            form.append('parentId', item.parentId ? item.parentId : "");
            form.append('type', item.type);
        });
        checkedArray.forEach((item) => {
            form.append('_id', item.value);
            form.append('name', item.name);
            form.append('parentId', item.parentId ? item.parentId : "");
            form.append('type', item.type);
        });
        dispatch(updateCategories(form));
        setUpdateCategoryModalStatus(false)
        //to see what is form data
        // const formObject = {};
        // form.forEach((value, key) => {
        //     if (formObject[key]) {
        //         // Convert duplicate keys into an array
        //         formObject[key] = [].concat(formObject[key], value);
        //     } else {
        //         formObject[key] = value;
        //     }
        // });
        // console.log(formObject);

    }
    //todo Update Category Modal Finish_________________________



    const [deleteCategoryModal, setDeleteCategoryModal] = useState(false);
    const handleDeleteCategories = () => {
        const checkedIdsArray = checkedArray.map((item) => ({ _id: item.value }));
        const expandedIdsArray = expandedArray.map((item) => ({ _id: item.value }));
        const idsArray = expandedIdsArray.concat(checkedIdsArray);
    
        if (checkedIdsArray.length > 0) {
            dispatch(deleteCategories(checkedIdsArray)) // Now it correctly calls the Redux action
                .then(result => {
                    if (result) {
                        dispatch(getAllCategory());
                        setDeleteCategoryModal(false);
                    }
                });
        }
    
        setDeleteCategoryModal(false);
    };
    
    const deleteCategory = () => {
        updateCheckedAndExpandedCategories();
        setDeleteCategoryModal(true);
    }

    const renderDeleteCategoryModal = () => {
        return (
            <Modal show={deleteCategoryModal} onHide={() => setDeleteCategoryModal(false)} centered     >
                <Modal.Header closeButton>
                    <Modal.Title>Confirm</Modal.Title>
                </Modal.Header>

                <Modal.Body>
                    <div>
                        <h5 style={{ fontWeight: "bold" }}>Expanded</h5>
                        {expandedArray.map((item, index) => (
                            <span key={index}>{item.name}</span>
                        ))}
                        <br />
                        <hr />
                        <h5 style={{ fontWeight: "bold" }}>Checked</h5>
                        {checkedArray.map((item, index) => (
                            <span style={{ display: "block", paddingBottom: '10px' }} key={index}>{item.name}</span>
                        ))}
                    </div>
                </Modal.Body>

                <Modal.Footer>
                    <Button variant="primary" onClick={() => setDeleteCategoryModal(false)}>No</Button>
                    <Button variant="danger" onClick={handleDeleteCategories}>Yes</Button>
                </Modal.Footer>
            </Modal>
        );
    }

    useEffect(() => {
        dispatch(getAllCategory())
    }, [dispatch])

    return (
        <Layout sidebar>
            <Layout sidebar>
                <Container>
                    <Row>
                        <Col md={12}>
                            <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                                <h3>Category</h3>
                                <div className="actionBtnContainer">
                                    <span>Actions: </span>
                                    <button onClick={handleShowAddModal}><IoIosAdd /> <span>Add</span></button>
                                    <button onClick={deleteCategory}><IoIosTrash /> <span>Delete</span></button>
                                    <button onClick={showUpdateModalCategory}><IoIosCloudUpload /> <span>Edit</span></button>
                                </div>

                            </div>

                        </Col>
                    </Row>
                    <Row>
                        <Col md={12}>
                            <CheckboxTree
                                nodes={renderCategories(category.categories)}
                                checked={checked}
                                expanded={expanded}
                                onCheck={checked => setChecked(checked)}
                                onExpand={expanded => setExpanded(expanded)}
                                icons={{
                                    check: <IoIosCheckbox />,
                                    uncheck: <IoIosCheckboxOutline />,
                                    halfCheck: <IoIosCheckboxOutline />,
                                    expandClose: <IoIosArrowForward />,
                                    expandOpen: <IoIosArrowDown />
                                }}
                            />
                        </Col>
                    </Row>
                </Container>
                <AddCategoryModal
                    show={showAddModalStatus}
                    handleClose={() => setShowAddModalStatus(false)}
                    onSubmit={handleCloseAddModal}
                    modalTitle={'Add New Category'}
                    categoryName={categoryName}
                    setCategoryName={setCategoryName}
                    parentCategoryId={parentCategoryId}
                    setParentCategoryId={setParentCategoryId}
                    categoryList={categoryList}
                    handleCategoryImage={handleAddModalCategoryImage}
                />
                <UpdateCategoriesModal
                    show={updateCategoryModalStatus}
                    handleClose={() => setUpdateCategoryModalStatus(false)}
                    onSubmit={updateCategoriesForm}
                    modalTitle={'Update Categories'}
                    size="lg"
                    expandedArray={expandedArray}
                    checkedArray={checkedArray}
                    handleCategoryInput={handleUpdateModalCategoryInput}
                    categoryList={categoryList}
                />
                {renderDeleteCategoryModal()}
            </Layout>
        </Layout>
    )
}

export default Category