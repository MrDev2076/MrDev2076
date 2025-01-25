import React, { useEffect, useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import './Profile.css';
import logo from './logo1.png';

function ProfilePage() {
  const [auth, setAuth] = useState(false);
  const [userData, setUserData] = useState({
    name: "",
    email: "",
    role: "",
  });
  const navigate = useNavigate();

  // Function to fetch current user data
  const getUserData = async () => {
    try {
      const response = await axios.get('http://localhost:8081/', {
        withCredentials: true, // Ensure cookies are sent with the request
      });

      if (response.data.Status === 'Success') {
        setAuth(true);
        setUserData({
          name: response.data.name,
          email: response.data.email,
          role: response.data.role,
        });
      } else {
        setAuth(false);
      }
    } catch (err) {
      console.log(err);
    }
  };

  // Logout function
  const handleLogout = () => {
    axios
      .get("http://localhost:8081/logout")
      .then(() => {
        navigate("/login");
      })
      .catch((err) => console.log(err));
  };

  useEffect(() => {
    getUserData(); // Call function when page is loaded
  }, []);

  return (
    <div className="profile-page">
      {auth ? (
        <div className="profile-container">
        
          <div className="profile-card">
            <img src={logo} alt="Logo" className="img-fluid" style={{ width: "90px", height: "90px" }} />

            {/* Edit Icon */}
            <div className="edit-icon">
              <a href="#">
              <svg width="64px" height="64px" viewBox="-13.86 -13.86 48.72 48.72" version="1.1" xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink" fill="#000000"><g id="SVGRepo_bgCarrier" stroke-width="0" transform="translate(0,0), scale(1)"><path transform="translate(-13.86, -13.86), scale(1.5225)" d="M16,25.969411722877446C17.813532802988508,25.743392790156523,19.61498350977177,26.695323465822945,21.394220216074697,26.27782792284318C23.39857813211356,25.80750798535648,25.80844176786381,25.255867161374052,26.778921196520002,23.440152101751455C27.771220312578404,21.583613575043824,25.59105865943646,19.24908352736692,26.22407535597892,17.2414275063368C27.071880121846615,14.552556340458883,31.199320125217007,13.150574321078452,30.907410211440848,10.346365043945797C30.647348585531883,7.848103801063429,27.37942690352814,6.700686142479728,25.033409266346432,5.803388793218669C22.98676583814703,5.020595137322703,20.630446510639644,6.333773725410172,18.557726115556527,5.622897228605517C16.188156972325565,4.810211149251871,14.924979744975618,1.5334844556172251,12.420545382656206,1.4775817458324507C10.046887194054289,1.424598155269199,8.439417720084853,3.892113756414032,6.5696230353243354,5.355304890212766C4.595269419774995,6.900317681617334,1.9992775917025436,8.009081850492334,1.0889808749368264,10.344996363543281C0.1783025083209937,12.681890229158471,0.9548035433849504,15.350958653353972,1.7470087958397293,17.730626458858566C2.4600850121850915,19.87260230369172,3.9833942112060794,21.55958376164731,5.405952556593322,23.312542963721114C6.73958652924583,24.95592437731303,7.797856086950496,27.201650479744725,9.850714585800668,27.716484460024667C11.948063453168622,28.242476127754063,13.854300145953802,26.23682833103131,16,25.969411722877446" fill="#ec7e94" strokewidth="0"></path></g><g id="SVGRepo_tracerCarrier" stroke-linecap="round" stroke-linejoin="round" stroke="#CCCCCC" stroke-width="0.041999999999999996"></g><g id="SVGRepo_iconCarrier"> <title>edit [#1479]</title> <desc>Created with Sketch.</desc> <defs> </defs> <g id="Page-1" stroke-width="0.00021000000000000004" fill="none" fill-rule="evenodd"> <g id="Dribbble-Light-Preview" transform="translate(-99.000000, -400.000000)" fill="#000000"> <g id="icons" transform="translate(56.000000, 160.000000)"> <path d="M61.9,258.010643 L45.1,258.010643 L45.1,242.095788 L53.5,242.095788 L53.5,240.106431 L43,240.106431 L43,260 L64,260 L64,250.053215 L61.9,250.053215 L61.9,258.010643 Z M49.3,249.949769 L59.63095,240 L64,244.114985 L53.3341,254.031929 L49.3,254.031929 L49.3,249.949769 Z" id="edit-[#1479]"> </path> </g> </g> </g> </g></svg>
              </a>
            </div>
    
            {/* Profile Picture */}
            <div className="profile-pic">
              <img src="https://www.svgrepo.com/show/355688/user-a-solid.svg" alt="Profile Picture" />
            </div>
            <h2>Profile Details</h2>
            <div className="profile-info">
              <p><strong>Name:</strong> {userData.name}</p>
              <p><strong>Email:</strong> {userData.email}</p>
              <p><strong>Role:</strong> {userData.role}</p>
            </div>

            <button className="btn btn-outline-danger" onClick={handleLogout}>
              Logout
            </button>
          </div>
        </div>
      ) : (
        <div className="unauthorized">
          <h3>You are not authorized to view this page. Please login first.</h3>
          <button className="btn btn-primary" onClick={() => navigate("/login")}>
            Login
          </button>
        </div>
      )}
    </div>
  );
}

export default ProfilePage;
