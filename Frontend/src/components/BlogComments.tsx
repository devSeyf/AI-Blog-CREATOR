import { Send, Sparkles } from 'lucide-react'
import React, { useEffect, useState } from 'react'
import { addComment, generateAiCommentSuggestions, getCommentsByBlog } from '../utils/commentApi'
import { useAuth } from '../context/AuthContext'


function BlogComments({ blogId , blogTitle }: { blogId: string, blogTitle :string }) {

    const {user} = useAuth()

    const [comment, setComment] = useState("")
    const [comments,setComments] = useState<any[]>([])
    const [loading,setLoading] = useState(false)
    const [aiSuggestions, setAiSuggestions] = useState<string[]>([]);

    useEffect(()=> {
        const fetchComments  = async()=> {
            const commentsData  = await getCommentsByBlog(blogId)
            setComments(commentsData)

        }
        fetchComments();

    },[blogId])

    const handleAddComment = async()=> {

          if (!comment.trim()) return; 
        try {
           
            const newComment  = await addComment(blogId,user?.name ?? "Guest" ,comment)
            setComments((prev) => [newComment, ...prev])
            setComment("")


        } catch (error) {
             console.error(error);
        }
    }

    const handleGenerateAI = async ()=> {
        setLoading(true)
        try {
            const aiResults = await generateAiCommentSuggestions(blogTitle)
            setAiSuggestions(aiResults)

        } catch (error) {
               console.error(error);
        }finally{
            setLoading(false)
        }
    }
  return (
    <div className='mt-10 bg-white p-6 rounded-xl shadow-sm border border-cyan-100 max-w-4xl mx-auto'>
        <h3 className='text-xl font-semibold text-sky-700 mb-4'> Comments</h3>

          <textarea
        value={comment}
        onChange={(e) => setComment(e.target.value)}
        placeholder="Write your comment..."
        rows={3}
        className="w-full border border-sky-200 rounded-lg p-3 outline-none focus:ring-2 focus:ring-sky-300"
      />

      <div className='flex gap-3 mt-3'>
        <button onClick={handleAddComment} className='px-5 py-2 bg-linear-to-r from-sky-400 to-cyan-400 text-white rounded-lg hover:from-sky-500 hover:to-cyan-500 transition flex items-center gap-1'>
        <Send size={16}/> Post
        </button>


         <button
          onClick={handleGenerateAI}
          disabled={loading}
          className="px-5 py-2 bg-linear-to-r from-emerald-400 to-cyan-400 text-white rounded-lg hover:from-emerald-500 hover:to-cyan-500 transition flex items-center gap-1"
        >
          <Sparkles size={16} /> {loading ? "Generating..." : "AI Suggestions"}
        </button>
      </div>

      {aiSuggestions.length > 0  && (
        <div className='mt-4 flex flex-wrap gap-3'>
            {aiSuggestions?.map((s,i)=> (
                <button   key={i} className='border border-cyan-200 text-cyan-700 px-3 py-1 rounded-full text-sm hover:bg-cyan-50 transition' onClick={()=> setComment(s)}>

                    {s}

                </button>
            ))}
        </div>

        
      )}

       <div className="mt-6 space-y-4">
        {comments.map((c) => (
          <div key={c._id} className="border-b pb-3">
            <p className="font-medium text-sky-800">{c.name}</p>
            <p className="text-gray-600">{c.comment}</p>
          </div>
        ))}
      </div>
    </div>
  )
}

export default BlogComments