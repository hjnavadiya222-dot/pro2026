import { useEffect } from "react";
import axios from "axios";
import { useDispatch, useSelector } from "react-redux";
import { setQuestions } from "@/redux/authSlice";

export function useGetFacultyQuestions() {
  const dispatch = useDispatch();
  const { user } = useSelector((state) => state.auth);
  const facultyId = user?._id; // Assuming the logged-in user is a faculty

  // console.log(facultyId);
  useEffect(() => {
    // const facultyId = user._id;
    
    

    const fetchQuestions = async ()  => {
      try {
        const { data } = await axios.get(
          `http://localhost:8000/api/v1/question/faculty/${facultyId}`,
          { withCredentials: true }
        );

        // console.log("Fetched faculty questions:", data.questions);

        dispatch(setQuestions(data.success ? data.questions : []));

      } catch (error) {
        console.error(
          "Error fetching faculty questions:",
          error.response?.data?.message || error.message
        );
        dispatch(setQuestions([])); // ✅ Ensure Redux store updates on failure
      }
    };

    fetchQuestions();
  }, [dispatch, facultyId]); // ✅ Dependencies: re-run when `facultyId` changes
}
