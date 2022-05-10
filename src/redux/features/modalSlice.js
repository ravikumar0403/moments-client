const { createSlice } = require("@reduxjs/toolkit");

const initialState = {
  isVisible: false,
  selectedPost: null,
};

const modalSlice = createSlice({
  name: "modal",
  initialState,
  reducers: {
    showModal: (state, action) => {
      state.isVisible = true;
      if (action.payload) state.selectedPost = action.payload;
    },
    closeModal: (state) => {
      state.isVisible = false;
      state.selectedPost = null;
    },
  },
});

export const { showModal, closeModal } = modalSlice.actions;
export default modalSlice.reducer;
