// eslint-disable-next-line react/prop-types
const Navbar = ({ activeTab, setActiveTab }) => {
  return (
    <nav className='justify-around bg-[#654321] text-white py-2 flex'>
      <div className="logo">
        <span className='font-bold text-xl mx-8'>TaskTrail</span>
      </div>
      <ul className="flex gap-8 mx-9">
        <li
          className={`cursor-pointer hover:font-bold transition-all ${activeTab === "Home" ? "font-bold" : ""}`}
          onClick={() => setActiveTab("Home")}
        >
          <button className="metallic-button bg-gradient-to-r from-[#8B4513] via-[#A0522D] to-[#8B4513] text-white px-4 py-2 rounded-lg shadow-lg hover:shadow-xl transition-all">
            Home
          </button>
        </li>
        <li
          className={`cursor-pointer hover:font-bold transition-all ${activeTab === "Your Tasks" ? "font-bold" : ""}`}
          onClick={() => setActiveTab("Your Tasks")}
        >
          <button className="metallic-button bg-gradient-to-r from-[#8B4513] via-[#A0522D] to-[#8B4513] text-white px-4 py-2 rounded-lg shadow-lg hover:shadow-xl transition-all">
            Completed Tasks
          </button>
        </li>
      </ul>
    </nav>
  );
};

export default Navbar;