import React, { useEffect, useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import { useAuth } from "@clerk/clerk-react";
import { useForm } from "react-hook-form";

function Articles() {
  const [articles, setArticles] = useState([]);
  const [error, setError] = useState("");
  const navigate = useNavigate();
  const { getToken } = useAuth();
  const {
    register,
    watch,
    formState: { errors },
  } = useForm();
  const [selection, setSelection] = useState("");
  const selectedCategory = watch("category");

  //get all articles
  async function getArticles() {
    //get jwt token
    const token = await getToken();
    //make authenticated request
    let res = await axios.get("http://localhost:3000/author-api/articles", {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });
    if (res.data.message === "articles") {
      setArticles(res.data.payload);
      setError("");
    } else {
      setError(res.data.message);
    }
  }

  //go to article by id
  function goToArticleById(articleObj) {
    navigate(`../${articleObj.articleId}`, { state: articleObj });
  }

  useEffect(() => {
    getArticles();
  }, []);
  console.log(articles);

  //filter
  // useEffect(() => {
  //   if (selectedCategory) {
  //     console.log("Category changed to:", selection);
  //   }
  // }, [selectedCategory]);

  return (
    <div className="container">
      <div>
        {error.length !== 0 && (
          <p className="display-4 text-center mt-5 text-danger">{error}</p>
        )}
        {/* <div class="btn-group">
          <button
            type="button"
            class="btn btn-info dropdown-toggle"
            data-bs-toggle="dropdown"
            aria-expanded="false"
          >
            Select category
          </button>
          <ul class="dropdown-menu">
            <li>
              <a class="dropdown-item" href="#">
              Programming
              </a>
            </li>
            <li>
              <a class="dropdown-item" href="#">
              AI&ML
              </a>
            </li>
            <li>
              <a class="dropdown-item" href="#">
              Database
              </a>
            </li>
            <li>
              <hr class="dropdown-divider"></hr>
            </li>
            <li>
              <a class="dropdown-item" href="#">
                All
              </a>
            </li>
          </ul>
        </div> */}
        <form>
          <div className="mb-4">
            <label htmlFor="category" className="form-label">
              Select a category
            </label>
            <select
              {...register("category")}
              id="category"
              className="form-select"
              defaultValue=""
            >
              <option value="All">All</option>
              <option value="programming">Programming</option>
              <option value="AI&ML">AI&ML</option>
              <option value="database">Database</option>
            </select>
            {/* title validation err msg */}
          </div>
        </form>
        <div className="row row-cols-1 row-cols-sm-2 row-cols-md-3">
          {articles.map(
            (articleObj) =>
              (selectedCategory === "All" ||
                articleObj.category === selectedCategory) && (
                <div className="col g-4" key={articleObj.articleId}>
                  <div className="card h-100">
                    <div className="card-body">
                      <div className="author-details text-end">
                        <img
                          src={articleObj.authorData.profileImageUrl}
                          alt="ProfileImage"
                          width="40px"
                          className="rounded-circle"
                        />
                        <p>
                          <small className="text-secondary">
                            {articleObj.authorData.nameOfAuthor}
                          </small>
                        </p>
                      </div>
                      <h5 className="card-title">{articleObj.title}</h5>
                      <p className="card-context">
                        {articleObj.content.substring(0, 80) + "....."}
                      </p>
                      <button
                        className="custom-btn btn-4"
                        onClick={() => goToArticleById(articleObj)}
                      >
                        Read more
                      </button>
                    </div>
                    <div className="card-footer">
                      <small className="text-body-secondary">
                        Last updated on {articleObj.dateOfModification}
                      </small>
                    </div>
                  </div>
                </div>
              )
          )}
        </div>
      </div>
    </div>
  );
}

export default Articles;
