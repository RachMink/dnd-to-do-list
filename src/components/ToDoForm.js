import React from "react";
import { MdAddTask } from "react-icons/md";

function TodoForm({ addTodo }) {
  const [value, setValue] = React.useState("");

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!value) return;
    addTodo(value);
    setValue("");
  };

  return (
    <form onSubmit={handleSubmit}>
      <div className="inputContainer">
        <input
          type="text"
          name="todo"
          placeholder="add something to your to-do list"
          className="input"
          value={value}
          onChange={(e) => setValue(e.target.value)}
        />
        <button
          type="submit"
          className="addButton"
          disabled={value ? false : true}
        >
          <MdAddTask />
          add
        </button>
      </div>
    </form>
  );
}

export default TodoForm;
