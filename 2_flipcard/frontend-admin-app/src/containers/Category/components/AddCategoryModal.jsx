import React from 'react';
import Input from '../../../components/UI/Input';
import Modal from '../../../components/UI/Modal';
import { Row, Col } from 'react-bootstrap';


/**
 * Renders a modal for adding a new category with input fields for category name, parent category, and image upload.
 * 
 * @param {Object} props - The component props
 * @param {boolean} props.show - Controls the visibility of the modal
 * @param {function} props.handleClose - Callback to close the modal
 * @param {string} props.modalTitle - Title of the modal
 * @param {string} props.categoryName - Current category name input value
 * @param {function} props.setCategoryName - Setter for category name
 * @param {string} props.parentCategoryId - Selected parent category ID
 * @param {function} props.setParentCategoryId - Setter for parent category ID
 * @param {Array} props.categoryList - List of available categories for parent selection
 * @param {function} props.handleCategoryImage - Handler for category image upload
 * @param {function} props.onSubmit - Callback for form submission
 * @returns {React.Element} Modal component for adding a new category
 */
const AddCategoryModal = (props) => {

    const { show, handleClose, modalTitle, categoryName, setCategoryName, parentCategoryId, setParentCategoryId, categoryList, handleCategoryImage, onSubmit } = props;

    return (
        <Modal show={show} handleClose={handleClose} onSubmit={onSubmit} modalTitle={modalTitle}  >
            <Row>
                <Col>
                    <Input value={categoryName} placeholder={`Category Name`} onChange={(e) => setCategoryName(e.target.value)} className="form-control-sm" />
                </Col>
                <Col>
                    <select className="form-control form-control-sm" value={parentCategoryId} onChange={(e) => setParentCategoryId(e.target.value)}>
                        <option>select category</option>
                        {categoryList.map(option => <option key={option.value} value={option.value}>{option.name}</option>)}
                    </select>
                </Col>
            </Row>
            <Row>
                <Col>
                    <input type="file" name="categoryImage" onChange={handleCategoryImage} />
                </Col>
            </Row>
        </Modal>
    );
}

export default AddCategoryModal;