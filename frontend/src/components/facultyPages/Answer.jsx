/* eslint-disable no-unused-vars */
import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { useSelector } from "react-redux";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";

function Answer() {
    const { id } = useParams();
    const navigate = useNavigate();
    const questions = useSelector((state) => state.auth.questions) || [];
    const question = questions.find((q) => q._id === id);
    const [answer, setAnswer] = useState("");
    const [loading, setLoading] = useState(false);

    if (!question) {
        return <div className="text-center text-red-500">Question not found</div>;
    }

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);
        try {
            const response = await fetch(`http://localhost:8000/api/v1/question/answer/${id}`, {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                    Authorization: `Bearer ${localStorage.getItem("token")}`,
                },
                credentials: "include", // Added withCredentials equivalent
                body: JSON.stringify({ answerText: answer }),
            });
            const data = await response.json();
            if (response.ok) {
                alert("✅ Answer submitted successfully!");
                navigate("/"); // Redirect after successful submission
            } else {
                alert(`❌ Error: ${data.message}`);
            }
        } catch (error) {
            alert("❌ Server error. Please try again later.");
        }
        setLoading(false);
    };

    return (
        <div className="min-h-screen flex items-center justify-center p-6 bg-zinc-900">
            <Card className="w-full max-w-2xl bg-zinc-800/30 border-zinc-700/50 p-6 rounded-xl">
                <CardHeader>
                    <CardTitle className="text-2xl text-zinc-100">{question?.questionTitle}</CardTitle>
                </CardHeader>
                <CardContent>
                    <p className="text-zinc-300 mb-6">{question?.questionText}</p>
                    <form onSubmit={handleSubmit} className="space-y-4">
                        <Textarea
                            value={answer}
                            onChange={(e) => setAnswer(e.target.value)}
                            placeholder="Write your answer here..."
                            className="w-full p-3 rounded-md bg-zinc-700 text-zinc-100"
                        />
                        <Button 
                            type="submit" 
                            variant="outline" 
                            className="w-full border-emerald-500/50 text-emerald-400 hover:bg-emerald-500/10 hover:text-emerald-300 transition-all duration-300"
                            disabled={loading}
                        >
                            {loading ? "Submitting..." : "Submit Answer"}
                        </Button>
                    </form>
                </CardContent>
            </Card>
        </div>
    );
}

export default Answer;