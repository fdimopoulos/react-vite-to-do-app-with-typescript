import { ChangeEvent, FormEvent, useEffect, useState } from "react";
import { v4 as uuidv4 } from "uuid";
import { FaTrash, FaCheck } from "react-icons/fa";
import "./App.css";

type Todo = {
    id: string;
    text: string;
    completed: boolean;
};

function App() {
    const [todo, setTodo] = useState(""); // todo = each individual task
    const [todos, setTodos] = useState<Todo[]>(() => {
        // get the todos from localstorage
        const savedTodos = localStorage.getItem("todos");
        // if there are todos stored
        if (savedTodos) {
            // return the parsed JSON object back to a javascript object
            return JSON.parse(savedTodos);
            // otherwise
        } else {
            // return an empty array
            return [];
        }
    });

    useEffect(() => {
        localStorage.setItem("todos", JSON.stringify(todos));
    }, [todos]);

    const handleChange = (e: ChangeEvent<HTMLInputElement>) => {
        setTodo(e.target.value);
    };

    const handleSubmit = (e: FormEvent<HTMLFormElement>) => {
        e.preventDefault();

        const newTodo = {
            id: uuidv4(), // create unique id
            text: todo,
            completed: false,
        };

        {
            todo && setTodos([...todos].concat(newTodo));
        } // if the input is not empty then add the new task to the existing list
        setTodo(""); // reset input after submitting the form
    };

    const deleteTodo = (id: string) => {
        const updatedTodos = [...todos].filter((todo) => todo.id !== id); // return only the values where the todo.id is not equal to id
        // this will be true for every todo except the one we are deleting
        setTodos(updatedTodos);
    };

    const completeTodo = (id: string) => {
        const updatedTodos = [...todos].map((todo) => {
            if (todo.id === id) {
                todo.completed = !todo.completed;
            }
            return todo;
        });
        setTodos(updatedTodos);
    };

    const clearAll = () => {
        setTodos([]);
    };

    return (
        <div className="app">
            <h1>To-Do List App</h1>
            <form onSubmit={handleSubmit}>
                <input
                    type="text"
                    onChange={handleChange}
                    value={todo} // the value of input is the value of todo
                />
                <button type="submit">Add Task</button>

                {todos.map((todo) => (
                    <div key={todo.id} className="todos-container">
                        <div
                            className={
                                todo.completed ? "todo completed" : "todo"
                            }
                        >
                            {todo.text}
                            <div className="todo-btn">
                                <FaCheck
                                    className="btn-complete"
                                    onClick={() => completeTodo(todo.id)}
                                />
                                <FaTrash
                                    className="btn-delete"
                                    onClick={() => deleteTodo(todo.id)}
                                />
                            </div>
                        </div>
                    </div>
                ))}
                {todos.length > 1 && (
                    <button onClick={clearAll}>Clear All</button>
                )}
            </form>
        </div>
    );
}

export default App;
