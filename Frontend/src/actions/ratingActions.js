import axios from "axios";
import {GET_INFLUENCER_RATINGS, GET_SPONSOR_RATINGS, ROOT_URL} from "./types";

export const getInfluencerRatings = (email) => async (dispatch) => {
    try {
        const res = await axios.get(
            `${ROOT_URL}/influencers/ratings?email=${email}`
        );
        dispatch({
            type: GET_INFLUENCER_RATINGS,
            payload: res.data,
        });
    } catch (e) {
        return {
            type: GET_INFLUENCER_RATINGS,
            payload: e,
        };
    }
};

export const getSponsorRatings = (email) => async (dispatch) => {
    try {
        const res = await axios.get(
            `${ROOT_URL}/sponsors/ratings?email=${email}`
        );
        dispatch({
            type: GET_SPONSOR_RATINGS,
            payload: res.data,
        });
    } catch (e) {
        return {
            type: GET_SPONSOR_RATINGS,
            payload: e,
        };
    }
};