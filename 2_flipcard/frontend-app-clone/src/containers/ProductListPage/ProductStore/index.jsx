import React from 'react'
import { useEffect } from 'react';
import { useParams } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux'
import { getProductsBySlug } from '../../../redux/actions/product.action';
import { Link } from "react-router-dom";
import Rating from "../../../components/UI/Rating";
import Price from "../../../components/UI/Price";
import Card from '../../../components/UI/Card';
import { MaterialButton } from "../../../components/MaterialUI";
import { generatePublicUrl } from '../../../urlConfig';
const ProductStore = () => {

    const product = useSelector((state) => state.product);
    const priceRange = product.priceRange;
    const dispatch = useDispatch()
    const { slug } = useParams(); // Get slug from the URL

    useEffect(() => {
        if (slug) { // Ensure slug exists before dispatching
            dispatch(getProductsBySlug(slug));
        }
    }, [dispatch, slug]);
    return (
        <>
            {Object.keys(product.productsByPrice).map((key) => {
                return (
                    <Card
                        key={key}
                        headerLeft={`${slug} mobile under ${priceRange[key]}`}
                        headerRight={<MaterialButton title={"VIEW ALL"} style={{ width: "96px", }} bgColor="#2874f0" fontSize="12px" />}
                        style={{ width: "calc(100% - 40px)", margin: "20px", }}>
                        <div style={{ display: "flex" }}>
                            {product.productsByPrice[key].map((product) => (
                                <Link to={`/${product.slug}/${product._id}/p`} style={{ display: "block", textDecoration: "none", color: "#000", }} className="productContainer"   >
                                    <div className="productImgContainer">
                                        <img src={generatePublicUrl(product.productPictures[0].img)} />
                                    </div>
                                    <div className="productInfo">
                                        <div style={{ margin: "10px 0" }}>{product.name}</div>
                                        <div>
                                            <Rating value="4.3" />
                                            &nbsp;&nbsp;
                                            <span style={{ color: "#777", fontWeight: "500", fontSize: "12px", }} >
                                                (3353)
                                            </span>
                                        </div>
                                        <Price value={product.price} />
                                    </div>
                                </Link>
                            ))}
                        </div>
                    </Card>
                );
            })}
        </>
    )
}

export default ProductStore