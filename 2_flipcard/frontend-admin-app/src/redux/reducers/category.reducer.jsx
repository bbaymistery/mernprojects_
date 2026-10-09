import { categoryConstansts } from "../actions/constant";

const initState = {
    categories: [],
    loading: false,
    error: null
};


const buildNewCategories = (parentId, categories, category) => {
    let myCategories = [];

    if (parentId == undefined) {
        return [
            ...categories,
            {
                _id: category._id,
                name: category.name,
                slug: category.slug,
                type: category.type,
                children: []
            }
        ];
    }

    for (let cat of categories) {

        if (cat._id == parentId) {
            const newCategory = {
                _id: category._id,
                name: category.name,
                slug: category.slug,
                parentId: category.parentId,
                type: category.type,
                children: []
            };
            myCategories.push({
                ...cat,
                children: cat.children.length > 0 ? [...cat.children, newCategory] : [newCategory]
            })
        } else {
            myCategories.push({
                ...cat,
                children: cat.children ? buildNewCategories(parentId, cat.children, category) : []
            });
        }


    }


    return myCategories;
}


const categoryReducer = (state = initState, action) => {
    switch (action.type) {
        case categoryConstansts.GET_ALL_CATEGORIES_SUCCESS:
            return { ...state, categories: action.payload.categories }

        case categoryConstansts.ADD_NEW_CATEGORY_REQUEST:
            return { ...state, loading: true }

        case categoryConstansts.ADD_NEW_CATEGORY_SUCCESS: {
            const category = action.payload.category
            const updatedCategories = buildNewCategories(category.parentId, state.categories, category);
            console.log('updated categoires', updatedCategories);
            return { ...state, categories: updatedCategories, loading: false, }
        }

        case categoryConstansts.ADD_NEW_CATEGORY_FAILURE:
            return { ...initState, loading: false, error: action.payload.error }

        case categoryConstansts.UPDATE_CATEGORIES_REQUEST:
            return { ...state, loading: true }

        case categoryConstansts.UPDATE_CATEGORIES_SUCCESS:
            return { ...state, loading: false }

        case categoryConstansts.UPDATE_CATEGORIES_FAILURE:
            return { ...state, error: action.payload.error, loading: false }

        case categoryConstansts.DELETE_CATEGORIES_REQUEST:
            return { ...state, loading: true }

        case categoryConstansts.DELETE_CATEGORIES_SUCCESS:
            return { ...state, loading: false }

        case categoryConstansts.DELETE_CATEGORIES_FAILURE:
            return { ...state, loading: false, error: action.payload.error }

        default:
            return state;

    }

}
export default categoryReducer;