import { useState, useEffect } from 'react';
import Navbar from './components/Navbar';
import { FaEdit } from "react-icons/fa";
import { AiFillDelete } from "react-icons/ai";
import { v4 as uuidv4 } from 'uuid';

function App() {
  const [todo, setTodo] = useState("");
  const [todos, setTodos] = useState([]);
  const [showFinished, setshowFinished] = useState(true);
  const [activeTab, setActiveTab] = useState("Home"); // State for active tab

  useEffect(() => {
    let todoString = localStorage.getItem("todos");
    if (todoString) {
      let todos = JSON.parse(localStorage.getItem("todos"));
      setTodos(todos);
    }
  }, []);

  const saveToLS = () => {
    localStorage.setItem("todos", JSON.stringify(todos));
  };

  const toggleFinished = () => {
    setshowFinished(!showFinished);
  };

  const handleEdit = (e, id) => {
    let t = todos.filter(i => i.id === id);
    setTodo(t[0].todo);
    let newTodos = todos.filter(item => {
      return item.id !== id;
    });
    setTodos(newTodos);
    saveToLS();
  };

  const handleDelete = (e, id) => {
    let newTodos = todos.filter(item => {
      return item.id !== id;
    });
    setTodos(newTodos);
    saveToLS();
  };

  const handleAdd = () => {
    setTodos([...todos, { id: uuidv4(), todo, isCompleted: false }]);
    setTodo("");
    saveToLS();
  };

  const handleChange = (e) => {
    setTodo(e.target.value);
  };

  const handleCheckbox = (e) => {
    let id = e.target.name;
    let index = todos.findIndex(item => {
      return item.id === id;
    });
    let newTodos = [...todos];
    newTodos[index].isCompleted = !newTodos[index].isCompleted;
    setTodos(newTodos);
    saveToLS();
  };

  return (
    <>
      <Navbar activeTab={activeTab} setActiveTab={setActiveTab} />
      <div className="mx-3 md:container md:mx-auto my-5 rounded-xl p-5 bg-gradient-to-b from-[#F4EBD0] to-[#EAD2AC] min-h-[80vh] md:w-[35%] shadow-lg transform transition-all hover:scale-[1.02]">
        {activeTab === "Home" && (
          <>
            <h1 className="font-bold text-center text-3xl text-[#8B4513] animate-fadeIn">
              iTask - Manage your todos at one place
            </h1>
            <div className="addTodo my-5 flex flex-col gap-4">
              <h2 className="text-2xl font-bold text-[#8B4513]">Add a Todo</h2>
              <div className="flex items-center">
                <input
                  onChange={handleChange}
                  value={todo}
                  type="text"
                  className="w-full rounded-full px-5 py-2 border-2 border-[#8B4513] focus:outline-none focus:ring-2 focus:ring-[#A0522D] shadow-sm"
                />
                <button
                  onClick={handleAdd}
                  disabled={todo.length <= 3}
                  className="bg-[#8B4513] mx-2 rounded-full hover:bg-[#A0522D] disabled:bg-[#CD853F] disabled:opacity-70 p-4 py-2 text-sm font-bold text-white transition-transform hover:scale-105"
                >
                  Save
                </button>
              </div>
            </div>
            <div className="flex items-center my-4">
              <input
                id="show"
                onChange={toggleFinished}
                type="checkbox"
                checked={showFinished}
                className="rounded border-[#8B4513] text-[#8B4513] focus:ring-2 focus:ring-[#A0522D]"
              />
              <label className="ml-2 text-[#8B4513]" htmlFor="show">
                Show Finished
              </label>
            </div>
            <div className="h-[1px] bg-[#8B4513] opacity-25 w-[90%] mx-auto my-4"></div>
            <h2 className="text-2xl font-bold text-[#8B4513]">Your Todos</h2>
            <div className="todos">
              {todos.length === 0 && (
                <div className="m-5 text-center text-gray-500">No Todos to display</div>
              )}
              {todos.map((item) => {
                return (
                  (showFinished || !item.isCompleted) && (
                    <div
                      key={item.id}
                      className="todo flex my-3 justify-between items-center bg-[#FFF8E1] rounded-lg p-3 shadow hover:shadow-md transition-shadow"
                    >
                      <div className="flex gap-5 items-center">
                        <input
                          name={item.id}
                          onChange={handleCheckbox}
                          type="checkbox"
                          checked={item.isCompleted}
                          className="rounded border-[#8B4513] text-[#8B4513] focus:ring-2 focus:ring-[#A0522D]"
                        />
                        <div
                          className={`${
                            item.isCompleted ? "line-through text-gray-500" : "text-[#8B4513]"
                          }`}
                        >
                          {item.todo}
                        </div>
                      </div>
                      <div className="buttons flex">
                        <button
                          onClick={(e) => handleEdit(e, item.id)}
                          className="bg-[#8B4513] hover:bg-[#A0522D] p-2 py-1 text-sm font-bold text-white rounded-md mx-1 transition-transform hover:scale-105"
                        >
                          <FaEdit />
                        </button>
                        <button
                          onClick={(e) => {
                            handleDelete(e, item.id);
                          }}
                          className="bg-[#8B4513] hover:bg-[#A0522D] p-2 py-1 text-sm font-bold text-white rounded-md mx-1 transition-transform hover:scale-105"
                        >
                          <AiFillDelete />
                        </button>
                      </div>
                    </div>
                  )
                );
              })}
            </div>
          </>
        )}
  
        {activeTab === "Your Tasks" && (
          <div>
            <h1 className="font-bold text-center text-3xl text-[#8B4513] animate-fadeIn">
              Your Tasks
            </h1>
            <div className="my-5">
              <h2 className="text-2xl font-bold text-[#8B4513]">Completed Tasks</h2>
              {todos.filter((item) => item.isCompleted).length === 0 && (
                <div className="m-5 text-center text-gray-500">No completed tasks</div>
              )}
              {todos
                .filter((item) => item.isCompleted)
                .map((item) => (
                  <div
                    key={item.id}
                    className="todo flex my-3 justify-between items-center bg-[#FFF8E1] rounded-lg p-3 shadow hover:shadow-md transition-shadow"
                  >
                    <div className="flex gap-5 items-center">
                      <div className="line-through text-gray-500">{item.todo}</div>
                    </div>
                  </div>
                ))}
            </div>
          </div>
        )}
      </div>
    </>
  );
  
}

export default App;