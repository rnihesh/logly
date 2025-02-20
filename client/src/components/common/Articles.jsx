import React, { useEffect, useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import { useAuth } from "@clerk/clerk-react";
import { useForm } from "react-hook-form";
import { getBaseUrl } from "../../utils/config.js";

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
  const [loading, setLoading] = useState(true);

  //get all articles
  async function getArticles() {
    //get jwt token
    const token = await getToken();
    //make authenticated request
    let res = await axios.get(`${getBaseUrl()}/author-api/articles`, {
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
  // console.log(articles);
  useEffect(() => {
    if (articles.length > 0) {
      setLoading(false);
    }
  }, [articles]);

  return (
    <div className="container mt-4">
      {error && <p className="text-center text-danger display-6">{error}</p>}
      <form className="mb-4">
        <label htmlFor="category" className="form-label fw-bold">
          Select a category
        </label>
        <select {...register("category")} id="category" className="form-select">
          <option value="All">All</option>
          <option value="programming">Programming</option>
          <option value="AI&ML">AI&ML</option>
          <option value="database">Database</option>
        </select>
      </form>
      <div className="row row-cols-1 row-cols-md-2 row-cols-lg-3 g-4">
        {loading ? (
          <div className="w-100 text-center">
            <div className="spinner-grow text-secondary" role="status">
              <span className="visually-hidden">Loading...</span>
            </div>
          </div>
        ) : (
          articles
            .filter(
              (articleObj) =>
                selectedCategory === "All" ||
                articleObj.category === selectedCategory
            )
            .map((articleObj) => (
              <div className="col" key={articleObj.articleId}>
                <div className="card h-100 shadow-sm">
                  <div className="card-body">
                    <div className="d-flex justify-content-start mb-4 align-items-center card-det">
                      <img
                        src={articleObj.authorData.profileImageUrl}
                        alt="Profile"
                        width="40"
                        className="rounded-circle me-2"
                      />
                      <small className="text-secondary">
                        {articleObj.authorData.nameOfAuthor}
                      </small>
                    </div>

                    <h5 className="card-title mt-2">{articleObj.title}</h5>
                    <p className="card-text text-muted">
                      {articleObj.content.substring(0, 80)}...
                    </p>
                    <button
                      className=" btn-prima"
                      onClick={() => goToArticleById(articleObj)}
                    >
                      Read more...
                    </button>
                  </div>
                  <div className="card-footer text-muted text-start border-0">
                    <small>
                      Last updated on {articleObj.dateOfModification}
                    </small>
                  </div>
                </div>
              </div>
            ))
        )}
      </div>
    </div>
  );
}

export default Articles;
