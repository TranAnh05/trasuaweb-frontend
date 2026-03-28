import axiosClient from './axiosClient';

export const categoryService = {
    getActiveCategories: () => {
        return axiosClient.get('/categories');
    }
};