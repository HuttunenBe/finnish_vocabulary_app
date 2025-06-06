import { useState, useEffect } from "react";
import axios from "axios";
import Flashcard from "./Flashcard";
import "../../css/styles.css";

function App() {
    // useState variables
    const [nameColors, setNameColors] = useState([]);
    const [error, setError] = useState(null);
    const [name, setName] = useState("");
    const [color, setColor] = useState("");
    const [words, setWords] = useState([]);
    const [view, setView] = useState("");
    const [editingId, setEditingId] = useState(null);
    const [editName, setEditName] = useState("");
    const [editColor, setEditColor] = useState("");

    // Change views
    useEffect(() => {
        if (view === "nameColor") {
            fetchNameColors();
        } else if (view === "flashcard") {
            fetchWords();
        }
    }, [view]);

    // Fetch name_colors
    const fetchNameColors = async () => {
        try {
            const response = await axios.get("/api/name-colors");
            setNameColors(response.data);
        } catch (error) {
            setError("Failed to fetch entries");
        }
    };

    // Fetch flashcard words
    const fetchWords = async () => {
        try {
            const response = await axios.get("/api/words");
            setWords(response.data.words);
        } catch (error) {
            setError("Failed to fetch words");
        }
    };

    // Submit new name_color
    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            await axios.post("/api/name-colors", { name, color });
            setName("");
            setColor("");
            fetchNameColors();
        } catch (error) {
            setError("Failed to add entry");
        }
    };

    //Delete name_color
    const handleDelete = async (id) => {
        try {
            await axios.delete(`/api/name-colors/${id}`);
            fetchNameColors();
        } catch {
            setError("Failed to delete entry");
        }
    };

    // Start editing
    const startEditing = (item) => {
        setEditingId(item.id);
        setEditName(item.name);
        setEditColor(item.color);
    };

    // Cancel editing
    const cancelEditing = () => {
        setEditingId();
        setEditName("");
        setEditColor("");
    };

    // Save edit
    const saveEdit = async () => {
        try {
            await axios.put(`/api/name-colors/${editingId}`, {
                name: editName,
                color: editColor,
            });
            setEditingId();
            fetchNameColors();
        } catch {
            setError("Failed to update entry");
        }
    };

    return (
        <div>
            <h1>Choose your view</h1>
            <div className="viewToggle">
                <button onClick={() => setView("nameColor")}> 
                    Name Color View
                </button>
                <button onClick={() => setView("flashcard")}>
                    Flashcard View
                </button>
            </div>

            {view === "nameColor" && (
                <>
                    <form onSubmit={handleSubmit}>
                        <input
                            type="text"
                            placeholder="Name"
                            value={name}
                            onChange={(e) => setName(e.target.value)}
                        />
                        <input
                            type="text"
                            placeholder="Color"
                            value={color}
                            onChange={(e) => setColor(e.target.value)}
                        />
                        <button type="submit">Add</button>
                    </form>

                    <ul>
                        {nameColors.map((item) => (
                            <li key={item.id}>
                                {item.name} - {item.color}
                                {editingId === item.id ? (
                                    <>
                                        <input
                                            type="text"
                                            value={editName}
                                            onChange={(e) =>
                                                setEditName(e.target.value)
                                            }
                                            placeholder="Edit name"
                                        />
                                        <input
                                            type="text"
                                            value={editColor}
                                            onChange={(e) =>
                                                setEditColor(e.target.value)
                                            }
                                            placeholder="Edit color"
                                        />
                                        <button onClick={saveEdit}>Save</button>
                                        <button onClick={cancelEditing}>
                                            Cancel
                                        </button>
                                    </>
                                ) : (
                                    <>
                                        <button
                                            onClick={() => startEditing(item)}
                                        >
                                            Edit
                                        </button>
                                        <button
                                            onClick={() =>
                                                handleDelete(item.id)
                                            }
                                        >
                                            Delete
                                        </button>
                                    </>
                                )}
                            </li>
                        ))}
                    </ul>
                </>
            )}

            {error}

            {view === "flashcard" && (
                <div className="flashcardContainer">
                    {words ? (
                        words.map((word) => (
                            <Flashcard key={word.id} word={word} />
                        ))
                    ) : (
                        <p>No flashcards to display</p>
                    )}
                </div>
            )}
        </div>
    );
}

export default App;
