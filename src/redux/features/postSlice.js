import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import { toast } from "react-toastify";
import axios from "axios";
const { REACT_APP_API_URL } = process.env;

const initialState = {
  loading: false,
  allPosts: [],
  error: null,
  userPost: [],
  creatingPost: false,
};

export const getAllPosts = createAsyncThunk(
  "posts/getAllPosts",
  async (_, { rejectWithValue }) => {
    try {
      const { data } = await axios.get(`${REACT_APP_API_URL}/posts`);
      return data;
    } catch (error) {
      toast.error("Failed to fetch post");
      return rejectWithValue(error.message);
    }
  }
);

export const addPost = createAsyncThunk("posts/addPost", async (post) => {
  try {
    const fileData = new FormData();
    fileData.append("file", post.images);
    fileData.append("upload_preset", "w1pwqcqw");
    const {
      data: { secure_url },
    } = await axios({
      transformRequest: [
        (data, headers) => {
          delete headers.common.Authorization;
          return data;
        },
      ],
      method: "POST",
      url: "https://api.cloudinary.com/v1_1/moments-social/image/upload",
      data: fileData,
    });
    const { data } = await axios({
      url: `${REACT_APP_API_URL}/posts`,
      method: "POST",
      data: {
        content: post.content,
        images: [secure_url],
      },
    });
    return data;
  } catch (error) {
    toast.error("Failed to post moment.");
  }
});

export const editPost = createAsyncThunk(
  "posts/edit",
  async (postData, { rejectWithValue }) => {
    try {
      const response = await axios({
        method: "POST",
        url: `${process.env.REACT_APP_API_URL}/posts/${postData._id}`,
        data: {
          content: postData.content,
        },
      });
      return response.data;
    } catch (error) {
      return rejectWithValue(error.response.message);
    }
  }
);

const postSlice = createSlice({
  name: "posts",
  initialState,
  extraReducers: {
    [getAllPosts.pending]: (state) => {
      state.loading = true;
      state.error = null;
    },
    [getAllPosts.fulfilled]: (state, action) => {
      state.loading = false;
      state.allPosts = action.payload;
    },
    [getAllPosts.rejected]: (state, action) => {
      state.loading = false;
      state.error = action.payload;
    },
    [addPost.pending]: (state) => {
      state.creatingPost = true;
    },
    [addPost.fulfilled]: (state, action) => {
      state.allPosts = [action.payload, ...state.allPosts];
      state.userPost = [action.payload, ...state.userPost];
      state.creatingPost = false;
    },
    [addPost.rejected]: (state) => {
      state.creatingPost = false;
    },
    [editPost.pending]: (state, action) => {
      state.creatingPost = true;
    },
    [editPost.fulfilled]: (state, action) => {
      state.creatingPost = false;
      state.allPosts = [
        action.payload,
        ...state.allPosts.filter((post) => post._id !== action.payload._id),
      ];
      state.userPost = [
        action.payload,
        ...state.userPost.filter((post) => post._id !== action.payload._id),
      ];
    },
  },
});

export default postSlice.reducer;
