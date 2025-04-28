import { useState, useEffect } from 'react';
import Navbar from './components/Navbar';
import { FaEdit, FaTrash, FaStar, FaRegStar, FaTag, FaCalendarAlt } from "react-icons/fa";
import { v4 as uuidv4 } from 'uuid';
import JSConfetti from 'js-confetti';
import DatePicker from 'react-datepicker';
import 'react-datepicker/dist/react-datepicker.css';



function App() {
  const [todo, setTodo] = useState("");
  const [todos, setTodos] = useState([]);
  const [showFinished, setShowFinished] = useState(true);
  const [activeTab, setActiveTab] = useState("Home");
  const [darkMode, setDarkMode] = useState(false);
  const [priority, setPriority] = useState(2); // 1=High, 2=Medium, 3=Low
  const [dueDate, setDueDate] = useState(null);
  const [category, setCategory] = useState("");
  const [categories, setCategories] = useState(["Work", "Personal", "Shopping", "Health"]);
  const [newCategory, setNewCategory] = useState("");
  const [showCategoryInput, setShowCategoryInput] = useState(false);
  
  const jsConfetti = new JSConfetti();

  useEffect(() => {
    // Check user's preferred color scheme
    const prefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
    setDarkMode(prefersDark);
    
    // Load todos from localStorage
    const savedTodos = localStorage.getItem("todos");
    if (savedTodos) {
      setTodos(JSON.parse(savedTodos));
    }
    
    // Load categories from localStorage
    const savedCategories = localStorage.getItem("categories");
    if (savedCategories) {
      setCategories(JSON.parse(savedCategories));
    }
  }, []);

  useEffect(() => {
    // Apply dark mode class to body
    if (darkMode) {
      document.documentElement.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
    }
    
    // Save todos to localStorage whenever they change
    localStorage.setItem("todos", JSON.stringify(todos));
  }, [darkMode, todos]);

  const saveCategoriesToLS = () => {
    localStorage.setItem("categories", JSON.stringify(categories));
  };

  const toggleDarkMode = () => {
    setDarkMode(!darkMode);
  };

  const toggleFinished = () => {
    setShowFinished(!showFinished);
  };

  const handleEdit = (e, id) => {
    const todoToEdit = todos.find(t => t.id === id);
    if (todoToEdit) {
      setTodo(todoToEdit.todo);
      setPriority(todoToEdit.priority || 2);
      setDueDate(todoToEdit.dueDate ? new Date(todoToEdit.dueDate) : null);
      setCategory(todoToEdit.category || "");
      setTodos(todos.filter(item => item.id !== id));
    }
  };

  const handleDelete = (e, id) => {
    setTodos(todos.filter(item => item.id !== id));
  };

  const handleAdd = () => {
    if (todo.trim().length < 3) return;
    
    const newTodo = {
      id: uuidv4(),
      todo,
      isCompleted: false,
      priority,
      dueDate: dueDate ? dueDate.toISOString() : null,
      category,
      createdAt: new Date().toISOString()
    };
    
    setTodos([...todos, newTodo]);
    setTodo("");
    setPriority(2);
    setDueDate(null);
    setCategory("");
  };

  const handleCheckbox = (e, id) => {
    const updatedTodos = todos.map(item => {
      if (item.id === id) {
        const newCompletedState = !item.isCompleted;
        if (newCompletedState) {
          // Show confetti when task is completed
          jsConfetti.addConfetti({
            emojis: ['✅', '🎉', '✨', '💯'],
            emojiSize: 30,
            confettiNumber: 30,
          });
        }
        return { ...item, isCompleted: newCompletedState };
      }
      return item;
    });
    setTodos(updatedTodos);
  };

  const addNewCategory = () => {
    if (newCategory.trim() && !categories.includes(newCategory.trim())) {
      const updatedCategories = [...categories, newCategory.trim()];
      setCategories(updatedCategories);
      setCategory(newCategory.trim());
      setNewCategory("");
      setShowCategoryInput(false);
      saveCategoriesToLS();
    }
  };

  const getPriorityColor = (priorityLevel) => {
    switch (priorityLevel) {
      case 1: return 'text-red-500';
      case 2: return 'text-yellow-500';
      case 3: return 'text-green-500';
      default: return 'text-gray-500';
    }
  };

  const calculateProgress = () => {
    const totalTasks = todos.length;
    if (totalTasks === 0) return 0;
    const completedTasks = todos.filter(t => t.isCompleted).length;
    return Math.round((completedTasks / totalTasks) * 100);
  };

  const getPriorityStars = (priorityLevel) => {
    return (
      <div className="flex">
        {[1, 2, 3].map((level) => (
          level <= priorityLevel 
            ? <FaStar key={level} className={`${getPriorityColor(priorityLevel)} mr-1`} /> 
            : <FaRegStar key={level} className="text-gray-300 mr-1" />
        ))}
      </div>
    );
  };

  const formatDate = (dateString) => {
    if (!dateString) return null;
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', { month: 'short', day: 'numeric' });
  };

  const isTaskOverdue = (dueDateString) => {
    if (!dueDateString) return false;
    const dueDate = new Date(dueDateString);
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    return dueDate < today;
  };

  return (
    <div className={`min-h-screen transition-colors duration-300 ${darkMode ? 'dark:bg-gray-900 dark:text-gray-100' : 'bg-gradient-to-br from-blue-50 to-purple-50 text-gray-800'}`}>
      <Navbar 
        activeTab={activeTab} 
        setActiveTab={setActiveTab} 
        darkMode={darkMode} 
        toggleDarkMode={toggleDarkMode} 
      />
      
      <div className="pt-24 pb-10 px-4 sm:px-6 lg:px-8 max-w-4xl mx-auto">
        <div className={`rounded-xl p-6 shadow-xl backdrop-blur-sm transition-all ${darkMode ? 'bg-gray-800 bg-opacity-80' : 'bg-white bg-opacity-80'} hover:shadow-2xl`}>
          {activeTab === "Home" && (
            <>
              <h1 className="text-3xl font-bold text-center mb-6 bg-gradient-to-r from-indigo-600 to-purple-600 bg-clip-text text-transparent">
                {todos.length === 0 ? 'Start Your Productivity Journey 🚀' : 'Keep Crushing Your Goals 💪'}
              </h1>
              
              {/* Progress Bar */}
              {todos.length > 0 && (
                <div className="mb-8">
                  <div className="flex justify-between items-center mb-2">
                    <span className="font-medium">Your Progress</span>
                    <span className="font-bold">{calculateProgress()}%</span>
                  </div>
                  <div className="w-full bg-gray-200 rounded-full h-4 dark:bg-gray-700">
                    <div 
                      className="bg-gradient-to-r from-blue-500 to-purple-600 h-4 rounded-full transition-all duration-500" 
                      style={{ width: `${calculateProgress()}%` }}
                    ></div>
                  </div>
                </div>
              )}
              
              {/* Add Todo Form */}
              <div className="mb-8">
                <h2 className="text-xl font-semibold mb-4">Add New Task</h2>
                <div className="space-y-4">
                  <div>
                    <input
                      value={todo}
                      onChange={(e) => setTodo(e.target.value)}
                      type="text"
                      placeholder="What needs to be done?"
                      className={`w-full px-4 py-3 rounded-lg border focus:outline-none focus:ring-2 transition-all ${
                        darkMode 
                          ? 'bg-gray-700 border-gray-600 focus:ring-purple-500 text-white' 
                          : 'bg-white border-gray-300 focus:ring-indigo-500'
                      }`}
                    />
                  </div>
                  
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    {/* Priority Selector */}
                    <div className={`p-3 rounded-lg ${darkMode ? 'bg-gray-700' : 'bg-gray-100'}`}>
                      <label className="block text-sm font-medium mb-2">Priority</label>
                      <div className="flex space-x-2">
                        {[1, 2, 3].map((level) => (
                          <button
                            key={level}
                            onClick={() => setPriority(level)}
                            className={`flex-1 py-2 rounded-md text-sm font-medium transition-all ${
                              priority === level
                                ? `${darkMode ? 'bg-purple-600 text-white' : 'bg-indigo-600 text-white'}`
                                : `${darkMode ? 'bg-gray-600 text-gray-300' : 'bg-gray-200 text-gray-700'} hover:opacity-90`
                            }`}
                          >
                            {level === 1 ? 'High' : level === 2 ? 'Medium' : 'Low'}
                          </button>
                        ))}
                      </div>
                    </div>
                    
                    {/* Due Date Picker */}
                    <div className={`p-3 rounded-lg ${darkMode ? 'bg-gray-700' : 'bg-gray-100'}`}>
                      <label className="block text-sm font-medium mb-2">Due Date</label>
                      <DatePicker
                        selected={dueDate}
                        onChange={(date) => setDueDate(date)}
                        minDate={new Date()}
                        placeholderText="Select date"
                        className={`w-full px-3 py-2 rounded-md border focus:outline-none focus:ring-2 ${
                          darkMode 
                            ? 'bg-gray-600 border-gray-500 focus:ring-purple-500 text-white' 
                            : 'bg-white border-gray-300 focus:ring-indigo-500'
                        }`}
                      />
                    </div>
                    
                    {/* Category Selector */}
                    <div className={`p-3 rounded-lg ${darkMode ? 'bg-gray-700' : 'bg-gray-100'}`}>
                      <label className="block text-sm font-medium mb-2">Category</label>
                      <div className="relative">
                        {!showCategoryInput ? (
                          <>
                            <select
                              value={category}
                              onChange={(e) => setCategory(e.target.value)}
                              className={`w-full px-3 py-2 rounded-md border focus:outline-none focus:ring-2 ${
                                darkMode 
                                  ? 'bg-gray-600 border-gray-500 focus:ring-purple-500 text-white' 
                                  : 'bg-white border-gray-300 focus:ring-indigo-500'
                              }`}
                            >
                              <option value="">None</option>
                              {categories.map((cat) => (
                                <option key={cat} value={cat}>{cat}</option>
                              ))}
                            </select>
                            <button
                              onClick={() => setShowCategoryInput(true)}
                              className={`absolute right-2 top-2 p-1 rounded-full ${
                                darkMode ? 'text-gray-300 hover:text-white' : 'text-gray-500 hover:text-indigo-600'
                              }`}
                            >
                              <FaTag />
                            </button>
                          </>
                        ) : (
                          <div className="flex">
                            <input
                              type="text"
                              value={newCategory}
                              onChange={(e) => setNewCategory(e.target.value)}
                              placeholder="New category"
                              className={`flex-1 px-3 py-2 rounded-l-md border focus:outline-none ${
                                darkMode 
                                  ? 'bg-gray-600 border-gray-500 text-white' 
                                  : 'bg-white border-gray-300'
                              }`}
                            />
                            <button
                              onClick={addNewCategory}
                              className={`px-3 py-2 rounded-r-md ${
                                darkMode 
                                  ? 'bg-purple-600 hover:bg-purple-700 text-white' 
                                  : 'bg-indigo-600 hover:bg-indigo-700 text-white'
                              }`}
                            >
                              Add
                            </button>
                          </div>
                        )}
                      </div>
                    </div>
                  </div>
                  
                  <button
                    onClick={handleAdd}
                    disabled={todo.length < 3}
                    className={`w-full py-3 px-4 rounded-lg font-bold text-white transition-all ${
                      todo.length < 3
                        ? 'bg-gray-400 cursor-not-allowed'
                        : 'bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-700 hover:to-purple-700 transform hover:scale-[1.02]'
                    } shadow-lg hover:shadow-xl`}
                  >
                    Add Task
                  </button>
                </div>
              </div>
              
              {/* Task List */}
              <div>
                <div className="flex justify-between items-center mb-6">
                  <h2 className="text-xl font-semibold">Your Tasks</h2>
                  <div className="flex items-center">
                    <input
                      id="show"
                      type="checkbox"
                      checked={showFinished}
                      onChange={toggleFinished}
                      className={`w-4 h-4 rounded focus:ring-2 ${
                        darkMode 
                          ? 'bg-gray-700 border-gray-600 focus:ring-purple-500 text-purple-600' 
                          : 'bg-white border-gray-300 focus:ring-indigo-500 text-indigo-600'
                      }`}
                    />
                    <label htmlFor="show" className={`ml-2 text-sm ${darkMode ? 'text-gray-300' : 'text-gray-600'}`}>
                      Show completed
                    </label>
                  </div>
                </div>
                
                {todos.length === 0 ? (
                  <div className={`text-center py-10 rounded-lg ${darkMode ? 'bg-gray-700' : 'bg-gray-100'}`}>
                    <p className="text-lg">No tasks yet. Add your first task above!</p>
                  </div>
                ) : (
                  <div className="space-y-3">
                    {todos
                      .filter(task => showFinished || !task.isCompleted)
                      .sort((a, b) => {
                        // Sort by priority first, then by due date
                        if (a.priority !== b.priority) return a.priority - b.priority;
                        if (a.dueDate && b.dueDate) return new Date(a.dueDate) - new Date(b.dueDate);
                        if (a.dueDate) return -1;
                        if (b.dueDate) return 1;
                        return 0;
                      })
                      .map((task) => (
                        <div
                          key={task.id}
                          className={`p-4 rounded-lg border transition-all ${
                            task.isCompleted
                              ? darkMode
                                ? 'border-gray-600 bg-gray-700 bg-opacity-50'
                                : 'border-gray-200 bg-gray-100'
                              : darkMode
                                ? 'border-gray-600 bg-gray-700 hover:bg-gray-600'
                                : 'border-gray-200 bg-white hover:bg-gray-50'
                          } ${isTaskOverdue(task.dueDate) && !task.isCompleted ? 'border-red-500 border-l-4' : ''}`}
                        >
                          <div className="flex items-start">
                            <div className="flex items-center h-5 mr-3 mt-1">
                              <input
                                type="checkbox"
                                checked={task.isCompleted}
                                onChange={(e) => handleCheckbox(e, task.id)}
                                className={`w-5 h-5 rounded focus:ring-2 ${
                                  darkMode 
                                    ? 'bg-gray-600 border-gray-500 focus:ring-purple-500 text-purple-600' 
                                    : 'bg-white border-gray-300 focus:ring-indigo-500 text-indigo-600'
                                }`}
                              />
                            </div>
                            <div className="flex-1 min-w-0">
                              <p className={`text-lg font-medium mb-1 ${
                                task.isCompleted ? 'line-through opacity-70' : ''
                              }`}>
                                {task.todo}
                              </p>
                              <div className="flex flex-wrap items-center gap-3 text-sm mt-2">
                                {task.priority && (
                                  <span className={`inline-flex items-center ${darkMode ? 'text-gray-300' : 'text-gray-600'}`}>
                                    {getPriorityStars(task.priority)}
                                  </span>
                                )}
                                {task.category && (
                                  <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full ${
                                    darkMode ? 'bg-gray-600 text-purple-300' : 'bg-purple-100 text-purple-800'
                                  }`}>
                                    <FaTag className="mr-1" size={12} />
                                    {task.category}
                                  </span>
                                )}
                                {task.dueDate && (
                                  <span className={`inline-flex items-center ${
                                    isTaskOverdue(task.dueDate) && !task.isCompleted 
                                      ? 'text-red-500' 
                                      : darkMode 
                                        ? 'text-gray-300' 
                                        : 'text-gray-600'
                                  }`}>
                                    <FaCalendarAlt className="mr-1" size={12} />
                                    {formatDate(task.dueDate)}
                                    {isTaskOverdue(task.dueDate) && !task.isCompleted && (
                                      <span className="ml-1 text-xs font-bold">(OVERDUE)</span>
                                    )}
                                  </span>
                                )}
                              </div>
                            </div>
                            <div className="flex space-x-2 ml-2">
                              <button
                                onClick={(e) => handleEdit(e, task.id)}
                                className={`p-2 rounded-full ${
                                  darkMode 
                                    ? 'text-gray-300 hover:bg-gray-600 hover:text-white' 
                                    : 'text-gray-500 hover:bg-gray-200 hover:text-indigo-600'
                                }`}
                              >
                                <FaEdit size={16} />
                              </button>
                              <button
                                onClick={(e) => handleDelete(e, task.id)}
                                className={`p-2 rounded-full ${
                                  darkMode 
                                    ? 'text-gray-300 hover:bg-gray-600 hover:text-red-400' 
                                    : 'text-gray-500 hover:bg-gray-200 hover:text-red-600'
                                }`}
                              >
                                <FaTrash size={16} />
                              </button>
                            </div>
                          </div>
                        </div>
                      ))}
                  </div>
                )}
              </div>
            </>
          )}

          {activeTab === "Your Tasks" && (
            <div>
              <h1 className="text-3xl font-bold text-center mb-6 bg-gradient-to-r from-indigo-600 to-purple-600 bg-clip-text text-transparent">
                Your Achievements 🎉
              </h1>
              
              <div className="mb-6">
                <div className={`p-4 rounded-lg ${darkMode ? 'bg-purple-900 bg-opacity-30' : 'bg-purple-100'}`}>
                  <p className="text-center font-medium">
                    You've completed <span className="font-bold text-purple-600 dark:text-purple-300">{todos.filter(t => t.isCompleted).length}</span> tasks!
                  </p>
                </div>
              </div>
              
              {todos.filter(t => t.isCompleted).length === 0 ? (
                <div className={`text-center py-10 rounded-lg ${darkMode ? 'bg-gray-700' : 'bg-gray-100'}`}>
                  <p className="text-lg">No completed tasks yet. Keep going!</p>
                </div>
              ) : (
                <div className="space-y-3">
                  {todos
                    .filter(task => task.isCompleted)
                    .sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt))
                    .map((task) => (
                      <div
                        key={task.id}
                        className={`p-4 rounded-lg border ${
                          darkMode 
                            ? 'border-gray-600 bg-gray-700 bg-opacity-50' 
                            : 'border-gray-200 bg-gray-100'
                        }`}
                      >
                        <div className="flex items-start">
                          <div className="flex-1 min-w-0">
                            <p className="text-lg font-medium line-through opacity-70 mb-1">
                              {task.todo}
                            </p>
                            <div className="flex flex-wrap items-center gap-3 text-sm mt-2">
                              {task.priority && (
                                <span className={`inline-flex items-center ${darkMode ? 'text-gray-300' : 'text-gray-600'}`}>
                                  {getPriorityStars(task.priority)}
                                </span>
                              )}
                              {task.category && (
                                <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full ${
                                  darkMode ? 'bg-gray-600 text-purple-300' : 'bg-purple-100 text-purple-800'
                                }`}>
                                  <FaTag className="mr-1" size={12} />
                                  {task.category}
                                </span>
                              )}
                              {task.dueDate && (
                                <span className={`inline-flex items-center ${darkMode ? 'text-gray-300' : 'text-gray-600'}`}>
                                  <FaCalendarAlt className="mr-1" size={12} />
                                  {formatDate(task.dueDate)}
                                </span>
                              )}
                              <span className={`inline-flex items-center ${darkMode ? 'text-gray-400' : 'text-gray-500'}`}>
                                Completed on {formatDate(task.createdAt)}
                              </span>
                            </div>
                          </div>
                        </div>
                      </div>
                    ))}
                </div>
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

export default App;