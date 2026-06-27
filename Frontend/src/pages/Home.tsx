import React, { useEffect, useState } from "react";
import { getAllBlogs, getAllPublicBlogs } from "../utils/blogsApi";
import BlogCard from "../components/BlogComments";
import CategoriesBar from "../components/CategoriesBar";

function Home() {
  const [category, setCategory] = useState("all");

  const [blogs, setBlogs] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchBlogs = async () => {
      try {
        const allBlogs = await getAllPublicBlogs();
        setBlogs(allBlogs);
      } catch (error) {
        console.error(error);
      } finally {
        setLoading(false);
      }
    };
    fetchBlogs();
  }, []);

  const filteredBlogs =
    category === "all"
      ? blogs
      : blogs.filter((blog) => blog.category === category);

  return (
    <div className="min-h-screen p-10 mt-16">
      <div className="text-center mb-10">
        <h1 className="text-4xl font-bold bg-linear-to-r from-green-100 via-cyan-500 to-blue-500 bg-clip-text text-transparent mb-4">
          Your space to write <br /> express, and inspire
        </h1>
        <p className="text-gray-500">
          {" "}
          Share your thoughts, experiences and ideas with the world. Your story
          starts here 🌍
        </p>
      </div>

      <CategoriesBar selectedCategory={category} onSelect={setCategory} />

      {loading ? (
        <p className="text-center text-gray-500">Loading blogs...</p>
      ) : blogs.length === 0 ? (
        <p className="text-center text-gray-500">No blogs yet.</p>
      ) : (
        <div className="grid gap-6 grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
          {filteredBlogs.map((blog) => (
            <BlogCard
              id={blog._id}
              key={blog._id}
              title={blog.title}
              subtitle={blog.subtitle}
              category={blog.category}
              thumbnail={blog.thumbnail}
              author={blog.author?.name}
              date={blog.createdAt}
            />
          ))}
        </div>
      )}
    </div>
  );
}

export default Home;
