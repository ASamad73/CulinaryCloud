function Navbar(props){
    return(
        <div className="navbar">
            <h2 className="navbar-name">CulinaryCloud</h2>
            <div className="sites-container">
                <div className="sites" onClick={()=>props.setPost(false)}>
                    <i className="fa-solid fa-house"></i>
                    <h3>Home</h3>
                </div>
                <div className="sites">
                    <i className="fa-solid fa-forward-fast"></i>
                    <h3>Quick</h3>
                </div>
                <div className="sites" onClick={()=>props.setPost(true)}>
                    <i className="fa-solid fa-square-plus"></i>
                    <h3>Create</h3>
                </div>
                <div className="sites">
                    <i className="fa-solid fa-user"></i>
                    <h3>Profile</h3>
                </div>
                <div className="sites">
                    <i className="fa-solid fa-gear"></i>
                    <h3>Settings</h3>
                </div>
            </div>
        </div>  
    );
}

export default Navbar