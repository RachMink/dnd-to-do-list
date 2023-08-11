import React, { useState, useEffect } from "react";
import { DragDropContext, Droppable, Draggable } from "react-beautiful-dnd";
import _ from "lodash";
import { v4 } from "uuid";
import { MdDeleteOutline } from "react-icons/md";
import TodoForm from "./components/ToDoForm";
import Todo from "./components/Todo";
import "./App.css";

function App() {
  const [text, setText] = useState("");
  const [state, setState] = useState({
    important: {
      title: "Important",
      items: [],
    },
    todo: {
      title: "Todo",
      items: [
        { id: v4(), text: "Learn about React", isCompleted: false },
        { id: v4(), text: "Meet friend for lunch", isCompleted: false },
        { id: v4(), text: "Build really cool todo app", isCompleted: false },
      ],
    },
    done: {
      title: "Completed",
      items: [],
    },
  });
  const [todoEditing, setTodoEditing] = React.useState(null);
  const [greeting, setGreeting] = React.useState(null);
  var today = new Date();

  const titleGreeting = () => {
    var curHr = today.getHours();
    if (curHr < 12) {
      setGreeting("Good Morning!");
    } else if (curHr < 18) {
      setGreeting("Good Afternoon!");
    } else {
      setGreeting("Good Evening!");
    }
  };

  useEffect(() => {
    titleGreeting();
  }, []);

  const handleDragEnd = ({ destination, source }) => {
    if (!destination) {
      return;
    }

   if (
      destination.index === source.index &&
      destination.droppableId === source.droppableId
    ) {
      return;
    }

    // Creating a copy of item before removing it from state
    const itemCopy = { ...state[source.droppableId].items[source.index] };

    setState((prev) => {
      prev = { ...prev };
      // Remove from previous items array
      prev[source.droppableId].items.splice(source.index, 1);

      // Adding to new items array location
      prev[destination.droppableId].items.splice(
        destination.index,
        0,
        itemCopy
      );

      return prev;
    });
  };

  //add item directly to todo list column
  const addItem = (text) => {
    setState((prev) => {
      return {
        ...prev,
        todo: {
          title: "Todo",
          items: [
            {
              id: v4(),
              text: text,
            },
            ...prev.todo.items,
          ],
        },
      };
    });

    setText("");
  };

  //remove item from any list
  const removeTodo = (index, id) => {
    const newTodos = [...state.todo.items];
    const newImportant = [...state.important.items];
    const newDone = [...state.done.items];

    if (newTodos.some((el) => el.id === id)) {
      newTodos.splice(index, 1);
    } else if (newImportant.some((el) => el.id === id)) {
      newImportant.splice(index, 1);
    } else if (newDone.some((el) => el.id === id)) {
      newDone.splice(index, 1);
    }

    setState((prev) => {
      return {
        ...prev,
        important: {
          title: "Top Three",
          items: newImportant,
        },
        todo: {
          title: "Todo",
          items: newTodos,
        },
        done: {
          title: "Completed",
          items: newDone,
        },
      };
    });
  };

  const deleteAll = () => {
    setState((prev) => {
      return {
        ...prev,
        important: {
          title: "Important",
          items: [],
        },
        todo: {
          title: "Todo",
          items: [],
        },
        done: {
          title: "Completed",
          items: [],
        },
      };
    });
  };

  function submitEdits(id, editingText) {
    if (state.todo.items.some((el) => el.id === id)) {
      const newTodos = [...state.todo.items].map((todo) => {
        if (todo.id === id) {
          todo.text = editingText;
        }
        return todo;
      });

      setState((prev) => {
        return {
          ...prev,
          todo: {
            title: "Todo",
            items: newTodos,
          },
        };
      });
    }
    if (state.important.items.some((el) => el.id === id)) {
      const newImportant = [...state.important.items].map((todo) => {
        if (todo.id === id) {
          todo.text = editingText;
        }
        return todo;
      });
      setState((prev) => {
        return {
          ...prev,
          important: {
            title: "Important",
            items: newImportant,
          },
        };
      });
    }
    if (state.done.items.some((el) => el.id === id)) {
      const newDone = [...state.done.items].map((todo) => {
        if (todo.id === id) {
          todo.text = editingText;
        }
        return todo;
      });
      setState((prev) => {
        return {
          ...prev,
          done: {
            title: "Completed",
            items: newDone,
          },
        };
      });
    }

    setTodoEditing(null);
  }

  return (
    <div className="App">
      <div className="header">
        <h1>
          <div className="title">
            {greeting} <br />
          </div>
        </h1>
        <h2 className="title2">{today.toLocaleDateString()}</h2>

        <TodoForm addTodo={addItem} />
      </div>
      <div className="lists">
        <DragDropContext onDragEnd={handleDragEnd}>
          {_.map(state, (data, key) => {
            return (
              <div key={key} className={"column"}>
                <h3>{data.title}</h3>
                <Droppable droppableId={key}>
                  {(provided, snapshot) => {
                    return (
                      <div
                        ref={provided.innerRef}
                        {...provided.droppableProps}
                        className={`droppable-col ${key}`}
                      >
                        {data.items.map((el, index) => {
                          return (
                            <Draggable
                              key={el.id}
                              index={index}
                              draggableId={el.id}
                            >
                              {(provided, snapshot) => {
                                return (
                                  <div
                                    className={`item ${
                                      snapshot.isDragging && "dragging"
                                    }`}
                                    ref={provided.innerRef}
                                    {...provided.draggableProps}
                                    {...provided.dragHandleProps}
                                  >
                                    <Todo
                                      index={index}
                                      id={el.id}
                                      todo={el.text}
                                      removeTodo={removeTodo}
                                      submitEdits={submitEdits}
                                      todoEditing={todoEditing}
                                      setTodoEditing={setTodoEditing}
                                    />
                                  </div>
                                );
                              }}
                            </Draggable>
                          );
                        })}
                        {provided.placeholder}
                      </div>
                    );
                  }}
                </Droppable>
              </div>
            );
          })}
        </DragDropContext>
      </div>
      <div className="deleteContainer">
        <button
          type="button"
          className="deleteButton"
          onClick={deleteAll}
          disabled={
            state.todo.items.length === 0 &&
            state.important.items.length === 0 &&
            state.done.items.length === 0
              ? true
              : false
          }
        >
          <MdDeleteOutline />
          <span>clear all lists</span>
        </button>
      </div>
    </div>
  );
}

export default App;
