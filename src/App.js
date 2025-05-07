import React, { useState, useEffect } from "react";
import "./App.css";
import { AiOutlineDelete, AiOutlineEdit, AiOutlineUndo } from "react-icons/ai";
import { BsCheckLg } from "react-icons/bs";

function App() {
  const [isCompleteScreen, setIsCompleteScreen] = useState(false);
  const [allTodos, setTodos] = useState([]);
  const [newTitle, setNewTitle] = useState("");
  const [newDescription, setNewDescription] = useState("");
  const [completedTodos, setCompletedTodos] = useState([]);
  const [currentEdit, setCurrentEdit] = useState("");
  const [currentEditedItem, setCurrentEditedItem] = useState("");
  const [titleError, setTitleError] = useState(false);
  const [descriptionError, setDescriptionError] = useState(false);
  const [isLightMode, setIsLightMode] = useState(false);

  useEffect(() => {
    const savedTodo = JSON.parse(localStorage.getItem("todolist"));
    const savedCompletedTodo = JSON.parse(
      localStorage.getItem("completedTodos"),
    );

    if (savedTodo) setTodos(savedTodo);
    if (savedCompletedTodo) setCompletedTodos(savedCompletedTodo);
  }, []);

  useEffect(() => {
    document.body.classList.toggle("light-mode", isLightMode);
    document.body.classList.toggle("dark-mode", !isLightMode);
  }, [isLightMode]);

  const handleAddTodo = () => {
    const isTitleValid = newTitle.trim() !== "";
    const isDescriptionValid = newDescription.trim() !== "";

    setTitleError(!isTitleValid);
    setDescriptionError(!isDescriptionValid);

    if (!isTitleValid || !isDescriptionValid) return;

    const newTodoItem = { title: newTitle, description: newDescription };
    const updatedTodoArr = [...allTodos, newTodoItem];

    setTodos(updatedTodoArr);
    localStorage.setItem("todolist", JSON.stringify(updatedTodoArr));
    setNewTitle("");
    setNewDescription("");
  };

  const handleDeleteTodo = (index) => {
    const reducedTodo = allTodos.filter((_, i) => i !== index);
    setTodos(reducedTodo);
    localStorage.setItem("todolist", JSON.stringify(reducedTodo));
  };

  const handleComplete = (index) => {
    const now = new Date();
    const completedOn =
      now.toLocaleDateString() + " at " + now.toLocaleTimeString();

    const completedItem = { ...allTodos[index], completedOn };
    const updatedCompletedArr = [...completedTodos, completedItem];

    setCompletedTodos(updatedCompletedArr);
    localStorage.setItem("completedTodos", JSON.stringify(updatedCompletedArr));
    handleDeleteTodo(index);
  };

  const handleDeleteCompletedTodo = (index) => {
    const reducedTodo = completedTodos.filter((_, i) => i !== index);
    setCompletedTodos(reducedTodo);
    localStorage.setItem("completedTodos", JSON.stringify(reducedTodo));
  };

  const handleUndoComplete = (index) => {
    const restoredItem = completedTodos[index];
    const updatedTodos = [...allTodos, restoredItem];
    const updatedCompletedTodos = completedTodos.filter((_, i) => i !== index);

    setTodos(updatedTodos);
    setCompletedTodos(updatedCompletedTodos);
    localStorage.setItem("todolist", JSON.stringify(updatedTodos));
    localStorage.setItem(
      "completedTodos",
      JSON.stringify(updatedCompletedTodos),
    );
  };

  const handleEdit = (index, item) => {
    setCurrentEdit(index);
    setCurrentEditedItem(item);
  };

  const handleUpdateToDo = () => {
    const updatedTodos = [...allTodos];
    updatedTodos[currentEdit] = currentEditedItem;

    setTodos(updatedTodos);
    setCurrentEdit("");
    localStorage.setItem("todolist", JSON.stringify(updatedTodos));
  };

  return (
    <div className={`App ${isLightMode ? "light-mode" : "dark-mode"}`}>
      <div className="app-name">
        <h1>NotNow</h1>
        <p>The most honest productivity app ever made</p>
      </div>

      <div className="todo-wrapper">
        <div className="todo-input">
          <div className="todo-input-item">
            <label>Title</label>
            <input
              type="text"
              value={newTitle}
              onChange={(e) => setNewTitle(e.target.value)}
              placeholder="What is the task title?"
              className={`input ${titleError ? "error-input" : ""}`}
            />
            {titleError && <p className="error-message">Title is required</p>}
          </div>

          <div className="todo-input-item">
            <label>Description</label>
            <input
              type="text"
              value={newDescription}
              onChange={(e) => setNewDescription(e.target.value)}
              placeholder="What is the task description?"
              className={`input ${descriptionError ? "error-input" : ""}`}
            />
            {descriptionError && (
              <p className="error-message">Description is required</p>
            )}
          </div>

          <div className="todo-input-item">
            <button onClick={handleAddTodo} className="primaryBtn">
              Add
            </button>
            <button
              onClick={() => setIsLightMode(!isLightMode)}
              className="themeToggleBtn"
            >
              {isLightMode ? "Dark Mode" : "Light Mode"}
            </button>
          </div>
        </div>

        <div className="btn-area">
          <button
            className={`secondaryBtn ${!isCompleteScreen && "active"}`}
            onClick={() => setIsCompleteScreen(false)}
          >
            All Tasks
          </button>
          <button
            className={`secondaryBtn ${isCompleteScreen && "active"}`}
            onClick={() => setIsCompleteScreen(true)}
          >
            Completed Tasks
          </button>
        </div>

        <div className="todo-list">
          {!isCompleteScreen &&
            allTodos.map((item, index) =>
              currentEdit === index ? (
                <div className="edit-wrapper" key={index}>
                  <input
                    placeholder="Updated Title"
                    value={currentEditedItem.title}
                    onChange={(e) =>
                      setCurrentEditedItem({
                        ...currentEditedItem,
                        title: e.target.value,
                      })
                    }
                  />
                  <textarea
                    rows={4}
                    placeholder="Updated Description"
                    value={currentEditedItem.description}
                    onChange={(e) =>
                      setCurrentEditedItem({
                        ...currentEditedItem,
                        description: e.target.value,
                      })
                    }
                  />
                  <button onClick={handleUpdateToDo} className="primaryBtn">
                    Update
                  </button>
                </div>
              ) : (
                <div className="todo-list-item" key={index}>
                  <div>
                    <h3>{item.title}</h3>
                    <p>{item.description}</p>
                  </div>
                  <div>
                    <BsCheckLg
                      title="Complete?"
                      className="check-icon"
                      onClick={() => handleComplete(index)}
                    />
                    <AiOutlineEdit
                      title="Edit?"
                      className="check-icon"
                      onClick={() => handleEdit(index, item)}
                    />
                    <AiOutlineDelete
                      title="Delete?"
                      className="icon"
                      onClick={() => handleDeleteTodo(index)}
                    />
                  </div>
                </div>
              ),
            )}

          {isCompleteScreen &&
            completedTodos.map((item, index) => (
              <div className="todo-list-item" key={index}>
                <div>
                  <h3>{item.title}</h3>
                  <p>{item.description}</p>
                  <p>
                    <small>Completed on: {item.completedOn}</small>
                  </p>
                </div>
                <div>
                  <AiOutlineDelete
                    title="Delete"
                    className="icon"
                    onClick={() => handleDeleteCompletedTodo(index)}
                  />
                  <AiOutlineUndo
                    title="Undo"
                    className="undoBtn"
                    onClick={() => handleUndoComplete(index)}
                  />
                </div>
              </div>
            ))}
        </div>
      </div>
    </div>
  );
}

export default App;
