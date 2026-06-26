import { useEffect } from "react";
import axios from "axios";
import { useDispatch, useSelector } from "react-redux";
import { setQuestions } from "@/redux/authSlice";

export function useGetAllQuestions() {
  const dispatch = useDispatch();
  const { user } = useSelector((state) => state.auth);
  const userId = user?._id;

  useEffect(() => {
    if (!userId) return; // ✅ Prevent API call if userId is missing

    const fetchQuestions = async () => {
      try {
        const { data } = await axios.get(
          `http://localhost:8000/api/v1/question/student/${userId}`,
          { withCredentials: true } // ✅ Include credentials for authentication
        );

        // console.log("Fetched questions:", data.questions);

        dispatch(setQuestions(data.success ? data.questions : []));

      } catch (error) {
        console.error(
          "Error fetching questions:",
          error.response?.data?.message || error.message
        );
        dispatch(setQuestions([])); // ✅ Ensure Redux store updates on failure
      }
    };

    fetchQuestions();
  }, [dispatch, userId]); // ✅ Dependencies: re-run when `userId` changes
}
