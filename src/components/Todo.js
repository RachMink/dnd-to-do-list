import { MdDeleteOutline } from "react-icons/md";
import {
  MdOutlineModeEditOutline,
  MdCheckCircleOutline,
  MdDoneOutline,
} from "react-icons/md";
import { FormControlLabel, TextField, Box, Checkbox } from "@mui/material";
import { useState, useEffect } from "react";
import { Draggable } from "react-beautiful-dnd";
import CheckBoxOutlineBlankIcon from "@mui/icons-material/CheckBoxOutlineBlank";
import "../App.css";

function Todo({
  todo,
  id,
  index,
  removeTodo,
  submitEdits,
  todoEditing,
  setTodoEditing,
}) {
  const [editingText, setEditingText] = useState(todo);

  return (
    <>
      <div className="todo-item">
        {id === todoEditing ? (
          <Box
            sx={{
              width: 500,
              maxWidth: "80%",
            }}
          >
            <input
              type="text"
              name="edit"
              value={editingText}
              onChange={(e) => setEditingText(e.target.value)}
              onKeyPress={(e) => {
                if (e.key === "Enter") {
                  submitEdits(id, editingText);
                }
              }}
            />
          </Box>
        ) : (
          <>{todo}</>
        )}
      </div>
      <div className="todo-actions">
        {id === todoEditing ? (
          <MdDoneOutline
            className="submitEditIcon"
            onClick={() => submitEdits(id, editingText)}
          />
        ) : (
          <MdOutlineModeEditOutline
            className="editIcon"
            onClick={() => setTodoEditing(id)}
          />
        )}
        <MdDeleteOutline
          className="deleteIcon"
          onClick={() => removeTodo(index, id)}
        />
      </div>
    </>
  );
}

export default Todo;
