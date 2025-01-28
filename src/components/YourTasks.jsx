// YourTasks.jsx
const YourTasks = ({ todos, handleEdit, handleDelete, toggleFinished, showFinished, handleCheckbox }) => {
    return (
      <div className="tasks-container mx-auto my-5 p-5 rounded-xl bg-gradient-to-br from-gold via-golden to-gold-dark min-h-[80vh] md:w-[60%]">
        <h1 className="text-center text-4xl font-extrabold text-white">Your Tasks</h1>
        <input className='my-4' id='show' onChange={toggleFinished} type="checkbox" checked={showFinished} />
        <label className='mx-2 text-white' htmlFor="show">Show Finished</label>
        <div className='h-[1px] bg-white opacity-15 w-[90%] mx-auto my-2'></div>
        <div className="todos">
          {todos.length === 0 && <div className='m-5 text-white'>No Todos to display</div>}
          {todos.map(item => (
            (showFinished || !item.isCompleted) && (
              <div key={item.id} className={"todo flex my-3 justify-between bg-gold-light p-4 rounded-lg text-gold-dark"}>
                <div className='flex gap-5'>
                  <input name={item.id} onChange={handleCheckbox} type="checkbox" checked={item.isCompleted} id="" />
                  <div className={item.isCompleted ? "line-through" : ""}>{item.todo}</div>
                </div>
                <div className="buttons flex h-full">
                  <button onClick={(e) => handleEdit(e, item.id)} className='bg-gold-dark hover:bg-gold text-white p-2 py-1 text-sm font-bold rounded-md mx-1'><FaEdit /></button>
                  <button onClick={(e) => { handleDelete(e, item.id); }} className='bg-gold-dark hover:bg-gold text-white p-2 py-1 text-sm font-bold rounded-md mx-1'><AiFillDelete /></button>
                </div>
              </div>
            )
          ))}
        </div>
      </div>
    );
  };


  export default YourTasks;