import React from 'react';
import Input from '../../../components/UI/Input';
import Modal from '../../../components/UI/Modal';
import { Row, Col } from 'react-bootstrap';


/**
 * Renders a modal for updating categories with expanded and checked category lists
 * 
 * @param {Object} props - Component properties
 * @param {boolean} props.show - Controls modal visibility
 * @param {function} props.handleClose - Callback to close the modal
 * @param {string} props.modalTitle - Title displayed in the modal
 * @param {string} props.size - Size configuration for the modal
 * @param {Array} props.expandedArray - List of expanded categories to be updated
 * @param {Array} props.checkedArray - List of checked categories to be updated
 * @param {function} props.handleCategoryInput - Handler for updating category input values
 * @param {Array} props.categoryList - List of available categories for parent selection
 * @param {function} props.onSubmit - Callback triggered on modal form submission
 */
const UpdateCategoriesModal = (props) => {

    const { show, handleClose, modalTitle, size, expandedArray, checkedArray, handleCategoryInput, categoryList, onSubmit } = props;

    console.log({ expandedArray, checkedArray })

    return (
        <Modal show={show} handleClose={handleClose} onSubmit={onSubmit} modalTitle={modalTitle} size={size}   >
            <Row>
                <Col>
                    <h6>Expanded</h6>
                </Col>
            </Row>
            {expandedArray.length > 0 && expandedArray.map((item, index) =>
                <>
                    <Row key={index}>
                        <Col>
                            <Input value={item.name} placeholder={`Category Name`} onChange={(e) => handleCategoryInput('name', e.target.value, index, 'expanded')} />
                        </Col>
                        <Col>
                            <select className="form-control" value={item.parentId} onChange={(e) => handleCategoryInput('parentId', e.target.value, index, 'expanded')}>
                                <option>select category</option>
                                {categoryList.map(option => <option key={option.value} value={option.value}>{option.name}</option>)}
                            </select>
                        </Col>
                        <Col>
                            <select className="form-control" value={item.type} onChange={(e) => handleCategoryInput('type', e.target.value, index, 'expanded')}   >
                                <option value="">Select Type</option>
                                <option value="store">Store</option>
                                <option value="product">Product</option>
                                <option value="page">Page</option>
                            </select>
                        </Col>
                    </Row>
                    <br />
                </>
            )}
            <h6>Checked Categories</h6>
            {checkedArray.length > 0 && checkedArray.map((item, index) =>
                <>
                    <Row key={index}>
                        <Col>
                            <Input value={item.name} placeholder={`Category Name`} onChange={(e) => handleCategoryInput('name', e.target.value, index, 'checked')} />
                        </Col>
                        <Col>
                            <select className="form-control" value={item.parentId} onChange={(e) => handleCategoryInput('parentId', e.target.value, index, 'checked')}>
                                <option>select category</option>
                                {categoryList.map(option => <option key={option.value} value={option.value}>{option.name}</option>)}
                            </select>
                        </Col>
                        <Col>
                            <select className="form-control" value={item.type} onChange={(e) => handleCategoryInput('type', e.target.value, index, 'checked')} >
                                <option value="">Select Type</option>
                                <option value="store">Store</option>
                                <option value="product">Product</option>
                                <option value="page">Page</option>
                            </select>
                        </Col>
                    </Row>
                    <br />
                </>
            )}
        </Modal>
    );
}

export default UpdateCategoriesModal;