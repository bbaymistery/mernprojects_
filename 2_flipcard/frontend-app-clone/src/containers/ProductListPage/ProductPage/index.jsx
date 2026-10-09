import React, { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useLocation } from 'react-router-dom';
import { getProductPage } from '../../../redux/actions/product.action';
import "react-responsive-carousel/lib/styles/carousel.min.css"; // requires a loader
import { Carousel } from 'react-responsive-carousel';
import Card from '../../../components/UI/Card';
import { generatePublicUrl } from '../../../urlConfig';

const ProductPage = () => {
    const dispatch = useDispatch();
    const product = useSelector(state => state.product);
    const { page } = product;
    const location = useLocation();
    const queryParams = new URLSearchParams(location.search);
    console.log({ page });

    useEffect(() => {
        const params = Object.fromEntries(queryParams.entries());
        dispatch(getProductPage({ params }));
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [dispatch,]);
    return (
        <div style={{ margin: '0 10px' }}>
            <h3>{page?.title}</h3>
                <Carousel renderThumbs={() => { }}>
                    {page?.banners?.map((banner, index) => (
                        <a key={index} style={{ display: 'block' }} href={banner.navigateTo}>
                            <img src={generatePublicUrl(banner.img)} alt="" />
                        </a>
                    ))}
                </Carousel>
            <div style={{ display: 'flex', justifyContent: 'center', flexWrap: 'wrap', margin: '10px 0' }}>
                {page?.products?.map((product, index) => (
                    <Card key={index} style={{ width: '400px', height: '200px', margin: '5px' }}>
                        <img style={{ width: '100%', height: '100%' }} src={generatePublicUrl(product.img)} alt="" />
                    </Card>
                ))}
            </div>
        </div>
    );
};

export default ProductPage;