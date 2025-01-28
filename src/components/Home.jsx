// Home.jsx
const Home = ({ todos, changePage }) => {
    const categories = Array.from(new Set(todos.map(todo => todo.category || "Uncategorized")));
  
    return (
      <div className="home-container mx-auto my-5 p-5 rounded-xl bg-gradient-to-br from-gold via-golden to-gold-dark min-h-[80vh] md:w-[60%]">
        <h1 className="text-center text-4xl font-extrabold text-white">Task Categories</h1>
        <div className="categories my-5 flex flex-col gap-4">
          {categories.map(category => (
            <div key={category} className="category-item p-4 rounded-lg bg-gold-light text-gold-dark font-bold cursor-pointer hover:shadow-lg" onClick={() => changePage('yourTasks')}>
              {category}
            </div>
          ))}
        </div>
      </div>
    );
  };
  
  export default Home;