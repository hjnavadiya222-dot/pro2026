import { createSlice } from "@reduxjs/toolkit";

const authSlice = createSlice({
  name: "auth",
  initialState: {
    loading: false,
    user: null,
    questions: [], // ✅ Stores fetched questions
  },
  reducers: {
    setLoading: (state, action) => {
      state.loading = action.payload;
    },
    setUser: (state, action) => {
      state.user = action.payload;
    },
    setQuestions: (state, action) => {
      state.questions = action.payload; // ✅ Update state with fetched questions
    },
    logout: (state) => {
      state.user = null; // ✅ Clear user data
      state.questions = []; // ✅ Clear questions on logout
      state.loading = false; // ✅ Reset loading state
    },
  },
});

export const { setLoading, setUser, setQuestions, logout } = authSlice.actions;
export default authSlice.reducer;
