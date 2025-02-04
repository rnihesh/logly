import React from "react";
import { useContext, useEffect } from "react";
import { userAuthorContextObj } from "../../contexts/UserAuthorContext.jsx";
import { useUser, useAuth } from "@clerk/clerk-react";
import axios from "axios"

function Home() {
  const { currentUser, setCurrentUser } = useContext(userAuthorContextObj);

  const { isSignedIn, user, isLoaded } = useUser();
  console.log("isSignedIn :", isSignedIn);
  console.log("user :", user);
  console.log("isLoaded :", isLoaded);

  useEffect(() => {
    setCurrentUser({
      ...currentUser,
      firstName: user?.firstName,
      lastName: user?.lastName,
      email: user?.emailAddresses[0].emailAddress,
      profileImageUrl: user?.imageUrl,
    });
  }, [isLoaded]);

  async function onSelectRole(e){
    const selectedRole = e.target.value;
    currentUser.role = selectedRole;
    let res = null;
    if(selectedRole ==='author'){
      res = await axios.post('http://localhost:3000/author-api/author',currentUser)
      let {message, payload} = res.data;
      if(message==='author'){
        setCurrentUser({
          ...currentUser,
          ...payload
        })
      }
    }
    if(selectedRole==='user'){res = await axios.post('http://localhost:3000/user-api/user',currentUser)
      let {message, payload} = res.data;
      if(message==='user'){
        setCurrentUser({
          ...currentUser,
          ...payload
        })
      }
    }

  }

  return (
    <div className="container">
      {isSignedIn === false && 
        <div>
          <p className="lead">
            Lorem ipsum dolor sit amet consectetur adipisicing elit. Excepturi
            adipisci ratione aut id autem aliquid eligendi, odit aperiam quasi,
            quisquam nisi veniam a! Commodi sit suscipit voluptates, excepturi,
            quia quos praesentium distinctio fugit illum pariatur fuga maxime
            nihil ducimus sapiente quas consectetur explicabo unde, voluptatibus
            non fugiat sint? Facilis beatae, ab culpa obcaecati ullam
            aspernatur. Numquam aliquam reiciendis cupiditate magni, expedita
            itaque delectus accusamus sint unde aliquid soluta omnis quo. Quam
            iste, cupiditate ipsa molestiae odio ducimus eius vero provident
            fugiat in explicabo. Laboriosam praesentium aspernatur fuga soluta
            vel placeat magnam sint consequuntur recusandae quae, et at, vero ut
            necessitatibus!
          </p>
          <p className="lead">
            Lorem ipsum dolor sit amet consectetur adipisicing elit. Excepturi
            adipisci ratione aut id autem aliquid eligendi, odit aperiam quasi,
            quisquam nisi veniam a! Commodi sit suscipit voluptates, excepturi,
            quia quos praesentium distinctio fugit illum pariatur fuga maxime
            nihil ducimus sapiente quas consectetur explicabo unde, voluptatibus
            non fugiat sint? Facilis beatae, ab culpa obcaecati ullam
            aspernatur. Numquam aliquam reiciendis cupiditate magni, expedita
            itaque delectus accusamus sint unde aliquid soluta omnis quo. Quam
            iste, cupiditate ipsa molestiae odio ducimus eius vero provident
            fugiat in explicabo. Laboriosam praesentium aspernatur fuga soluta
            vel placeat magnam sint consequuntur recusandae quae, et at, vero ut
            necessitatibus!
          </p>
          <p className="lead">
            Lorem ipsum dolor sit amet consectetur adipisicing elit. Excepturi
            adipisci ratione aut id autem aliquid eligendi, odit aperiam quasi,
            quisquam nisi veniam a! Commodi sit suscipit voluptates, excepturi,
            quia quos praesentium distinctio fugit illum pariatur fuga maxime
            nihil ducimus sapiente quas consectetur explicabo unde, voluptatibus
            non fugiat sint? Facilis beatae, ab culpa obcaecati ullam
            aspernatur. Numquam aliquam reiciendis cupiditate magni, expedita
            itaque delectus accusamus sint unde aliquid soluta omnis quo. Quam
            iste, cupiditate ipsa molestiae odio ducimus eius vero provident
            fugiat in explicabo. Laboriosam praesentium aspernatur fuga soluta
            vel placeat magnam sint consequuntur recusandae quae, et at, vero ut
            necessitatibus!
          </p>
        </div>
      }
      {
        isSignedIn === true && 
        <div>
          <div className="d-flex justify-content-evenly bg-info p-3">
            <img src={user.imageUrl} width='100px' height='100px' className="rounded-circle" />
            <p className="display-6">{user.firstName} <br/>  {user.emailAddresses[0].emailAddress}</p>
          </div>
<p className="lead">Select role</p>
        <div className="d-flex role-radio py-3 justify-content-center">
        <div className="form-check me-4">
          <input type="radio" name="role" value='author' id="author" className="form-check-input" onChange={onSelectRole}/>
          <label htmlFor="author" className="form-check-label">Author</label>
          </div>
          <div className="form-check">
          <input type="radio" name="role" value='user' id="user" className="form-check-input" onChange={onSelectRole}/>
          <label htmlFor="user" className="form-check-label">User</label>
          </div>

          </div>
          
        </div>
      }
    </div>
  );
}

export default Home;
