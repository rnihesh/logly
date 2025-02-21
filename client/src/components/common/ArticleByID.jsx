import React, { useContext, useEffect, useState } from "react";
import { useLocation } from "react-router-dom";
import { userAuthorContextObj } from "../../contexts/UserAuthorContext";
import { FaEdit } from "react-icons/fa";
import { MdDelete, MdRestore } from "react-icons/md";
import { useForm } from "react-hook-form";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import { useAuth } from "@clerk/clerk-react";
import { getBaseUrl } from "../../utils/config.js";

function ArticleByID() {
  const { state } = useLocation();
  const { currentUser } = useContext(userAuthorContextObj);
  const { register, handleSubmit } = useForm();
  const [editArticleStatus, setEditArticleStatus] = useState(false);
  const navigate = useNavigate();
  const { getToken } = useAuth();
  const [currentArticle, setCurrentArticle] = useState(state);
  const [commentStatus, setCommentStatus] = useState("");
  // const storedUser = JSON.parse(localStorage.getItem("currentuser") || "{}");
  // console.log(storedUser.email, " ", state.authorData.email);
  // console.log(state)
  // console.log(state);

  //enable edit of article
  function enableEdit() {
    setEditArticleStatus(true);
  }

  //to save modified article
  async function onSave(modifiedArticle) {
    const articleAfterChanges = { ...state, ...modifiedArticle };
    const token = await getToken();
    const currentDate = new Date();
    //change date of mofification
    articleAfterChanges.dateOfModification =
      currentDate.getDate() +
      "-" +
      currentDate.getMonth() +
      "-" +
      currentDate.getFullYear() +
      " " +
      currentDate.toLocaleTimeString("en-US", { hour12: true });
    // console.log(articleAfterChanges);

    //make http post request
    let res = await axios.put(
      `${getBaseUrl()}/author-api/article/${articleAfterChanges.articleId}`,
      articleAfterChanges,
      {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      }
    );

    if (res.data.message === "article modified") {
      //change edit article status to false
      setEditArticleStatus(false);
      navigate(`/author-profile/articles/${state.articleId}`, {
        state: res.data.payload,
      });
    }

    // console.log(modifiedArticle);
  }

  //add comment by user
  async function addComment(commentObj) {
    //add name of user to comment obj
    commentObj.nameOfUser = currentUser.firstName;
    // console.log(commentObj);
    //http put request
    let res = await axios.put(
      `${getBaseUrl()}/user-api/comment/${currentArticle.articleId}`,
      commentObj
    );
    if (res.data.message === "comment added") {
      setCommentStatus(res.data.message);
    }
  }
  useEffect(() => {}, [state.comments]);

  //delete article
  async function deleteArticle() {
    state.isArticleActive = false;

    let res = await axios.put(
      `${getBaseUrl()}/author-api/articles/${state.articleId}`,
      state
    );
    if (res.data.message === "article deleted or restored") {
      setCurrentArticle(res.data.payload);
    }
  }

  //restore article
  async function restoreArticle() {
    state.isArticleActive = true;
    let res = await axios.put(
      `${getBaseUrl()}/author-api/articles/${state.articleId}`,
      state
    );
    if (res.data.message === "article deleted or restored") {
      setCurrentArticle(res.data.payload);
    }
  }

  return (
    <div className="container">
      {editArticleStatus === false ? (
        <>
          <div className="articleID-container p-6 bg-white shadow-lg rounded-2xl">
            <div className="articleID-header flex justify-between items-center mb-6 border-b pb-4 flex-wrap">
              <div>
                <h1 className="articleID-title text-3xl font-bold text-gray-800 mb-2">
                  {state.title}
                </h1>
                <div className="articleID-meta text-sm text-wrap">
                  <span className="mr-4">
                    Created on: {state.dateOfCreation}
                  </span>{" "}
                  <span>
                    {" "}
                    <br />
                  </span>
                  <span>Modified on: {state.dateOfModification}</span>
                </div>
              </div>
              <div className="gro"></div>
              <div className="articleID-author p-2 text-center">
                <img
                  src={state.authorData.profileImageUrl}
                  className="articleID-profile w-12 h-12 rounded-full mx-auto mb-2"
                  alt="ProfileImage"
                />
                <p className="text-gray-700 font-medium">
                  {state.authorData.nameOfAuthor}
                </p>
              </div>
              <div></div>

              {currentUser.role === "author" &&
                currentUser.email === state.authorData.email && (
                  <div className="articleID-actions d-flex flex-column g-3 mb-6">
                    <button className="p-2 rounded" onClick={enableEdit}>
                      <FaEdit />
                    </button>
                    {state.isArticleActive ? (
                      <button className="p-2 rounded" onClick={deleteArticle}>
                        <MdDelete />
                      </button>
                    ) : (
                      <button className="p-2 rounded" onClick={restoreArticle}>
                        <MdRestore />
                      </button>
                    )}
                  </div>
                )}
            </div>

            <p className="articleID-content text-lg leading-relaxed text-gray-700 whitespace-pre-line mb-6">
              {state.content}
            </p>

            <div className="articleID-comments mt-5">
              {state.comments.length === 0 ? (
                <p className="text-xl text-gray-500">No comments yet...</p>
              ) : (
                state.comments.map((commentObj) => (
                  <div
                    key={commentObj._id}
                    className="articleID-comment p-4 bg-gray-100 rounded-lg mb-4"
                  >
                    <p className="articleID-comment-user font-bold text-gray-800">
                      {commentObj?.nameOfUser}
                    </p>
                    <p className="articleID-comment-text text-gray-700">
                      {commentObj?.comment}
                    </p>
                  </div>
                ))
              )}
            </div>

            <h1 className="articleID-commentStatus text-xl font-semibold mb-4">
              {commentStatus}
            </h1>
            {currentUser.role === "user" && (
              <form
                onSubmit={handleSubmit(addComment)}
                className="articleID-commentForm flex flex-col gap-4"
              >
                <input
                  type="text"
                  {...register("comment")}
                  className="articleID-input p-2 border rounded-lg"
                  placeholder="Write a comment..."
                />
                <button className="articleID-submit text-white p-2 rounded-lg">
                  Add a comment
                </button>
              </form>
            )}
          </div>
        </>
      ) : (
        <>
          {/* edit form */}
          <form onSubmit={handleSubmit(onSave)}>
            <div className="mb-4">
              <label htmlFor="title" className="form-label">
                Title
              </label>
              <input
                type="text"
                className="form-control"
                id="title"
                defaultValue={state.title}
                {...register("title")}
              />
            </div>

            <div className="mb-4">
              <label htmlFor="category" className="form-label">
                Select a category
              </label>
              <select
                {...register("category")}
                id="category"
                className="form-select"
                defaultValue={state.category}
              >
                <option value="programming">Programming</option>
                <option value="AI&ML">AI&ML</option>
                <option value="database">Database</option>
              </select>
            </div>
            <div className="mb-4">
              <label htmlFor="content" className="form-label">
                Content
              </label>
              <textarea
                {...register("content")}
                className="form-control"
                id="content"
                rows="10"
                defaultValue={state.content}
              ></textarea>
            </div>

            <div className="text-end">
              <button type="submit" className="btn btn-light articleID-submit">
                Save
              </button>
            </div>
          </form>
        </>
      )}
    </div>
  );
}

export default ArticleByID;
