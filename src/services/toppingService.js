import axiosClient from './axiosClient';

export const toppingService = {
    getActiveToppings: () => {
        return axiosClient.get('/toppings');
    }
};