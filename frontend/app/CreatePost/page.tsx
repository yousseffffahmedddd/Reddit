
// 'use client';
// import React, { useState, useEffect } from 'react';
// import { createPost } from '../../apis/Postapi';
// import axios from 'axios';
// import { useRouter } from 'next/navigation';

// interface Community {
//   _id: string;
//   name: string;
// }

// const CreatePost: React.FC = () => {
//   const router = useRouter();
// const [selectedCommunity, setSelectedCommunity] = useState("67a0222bcf1234abcd567111");
// const [userId, setUserId] = useState("67a0123bcf1234abcd567890"); // Test User

//  // const [communities, setCommunities] = useState<Community[]>([]);
//   //const [selectedCommunity, setSelectedCommunity] = useState<string>("64f100000000000000000001");
//   const [postType, setPostType] = useState<string>("Text");
//   const [title, setTitle] = useState<string>("");
//   const [content, setContent] = useState<string>("");
//   //const [userId, setUserId] = useState<string>("64f000000000000000000001"); // Alice
// const [communities, setCommunities] = useState<Community[]>([
//   { _id: "67a0222bcf1234abcd567111", name: "Test Community" }
// ]);

//   // Fetch communities
//   useEffect(() => {
//     const fetchCommunities = async () => {
//       try {
//        const res = await axios.get<Community[]>("http://localhost:3000/apis/Communityapi");
// setCommunities(res.data);
//         if (res.data.length > 0) setSelectedCommunity(res.data[0]._id);
//       } catch (err) {
//         console.error("Error fetching communities:", err);
//       }
//     };
//     fetchCommunities();
//   }, []);

//   const handlePost = async () => {
//     try {
//       await createPost({
//         title,
//         body:content,
//         userId,
//         communityId: selectedCommunity,
//       });
//       router.push("/Community");
//     } catch (err) {
//       console.error("Error creating post:", err);
//       alert("Failed to create post.");
//     }
//   };

//   return (
//     <div className="max-w-xl mx-auto p-4 bg-white rounded shadow mt-8">
//       <h1 className="text-2xl font-bold mb-4">Create Post</h1>

//       <div className="mb-4">
//         <label className="block font-semibold mb-1">Choose Community</label>
//         <select
//           className="w-full border border-gray-300 rounded p-2"
//           value={selectedCommunity}
//           onChange={(e) => setSelectedCommunity(e.target.value)}
//         >
//           {communities.map((c) => (
//             <option key={c._id} value={c._id}>
//               {c.name}
//             </option>
//           ))}
//         </select>
//       </div>

//       <div className="mb-4">
//         <label className="block font-semibold mb-1">Post Type</label>
//         <select
//           className="w-full border border-gray-300 rounded p-2"
//           value={postType}
//           onChange={(e) => setPostType(e.target.value)}
//         >
//           <option>Text</option>
//           <option>Image & video</option>
//           <option>Link</option>
//         </select>
//       </div>

//       <div className="mb-4">
//         <input
//           type="text"
//           placeholder="Title"
//           value={title}
//           onChange={(e) => setTitle(e.target.value)}
//           className="w-full border border-gray-300 rounded p-2"
//         />
//       </div>

//       <div className="mb-4">
//         <textarea
//           placeholder="What's on your mind?"
//           value={content}
//           onChange={(e) => setContent(e.target.value)}
//           className="w-full border border-gray-300 rounded p-2 h-32"
//         ></textarea>
//       </div>

//       <div className="flex gap-2">
//         <button
//           onClick={handlePost}
//           className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700"
//         >
//           Post
//         </button>
//       </div>
//     </div>
//   );
// };

// export default CreatePost;

'use client';
import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { createPost } from '../../apis/Postapi';
import { useRouter } from 'next/navigation';

interface Community {
  _id: string;
  name: string;
}

const CreatePost: React.FC = () => {
  const router = useRouter();

  const [communities, setCommunities] = useState<Community[]>([]);
  const [selectedCommunity, setSelectedCommunity] = useState<string>('');
  const [title, setTitle] = useState<string>('');
  const [content, setContent] = useState<string>('');
  const [postType, setPostType] = useState<string>('Text');
  const userId = '67a0123bcf1234abcd567890'; // Make sure this exists in DB

  // Fetch communities from backend
  useEffect(() => {
    const fetchCommunities = async () => {
      try {
        const res = await axios.get<Community[]>('http://localhost:3000/apis/Communityapi');
        setCommunities(res.data);

        // Set the first community as default if available
        if (res.data.length > 0) setSelectedCommunity(res.data[0]._id);
      } catch (err) {
        console.error('Error fetching communities:', err);
      }
    };

    fetchCommunities();
  }, []);

  // const handlePost = async () => {
  //   if (!title || !content || !selectedCommunity) {
  //     alert('Please fill all fields');
  //     return;
  //   }

  //   try {
  //     await createPost({
  //       title,
  //       content,       // must match your Post schema
  //       postType,
  //       author: userId,
  //       community: selectedCommunity,
  //     });

  //     router.push('/Community'); // navigate after post creation
  //   } catch (err) {
  //     console.error('Error creating post:', err);
  //     alert('Failed to create post.');
  //   }
  // };
  const handlePost = async () => {
  if (!title || !content || !selectedCommunity) {
    alert('Please fill all fields');
    return;
  }

  try {
    await createPost({
      title,
      content,         // matches backend schema
      postType,
      author: userId,  // matches backend schema
      community: selectedCommunity, // matches backend schema
    });

    router.push('/Mainpage'); // navigate after post creation
  } catch (err) {
    console.error('Error creating post:', err);
    alert('Failed to create post.');
  }
};


  return (
    <div className="max-w-xl mx-auto p-4 bg-white rounded shadow mt-8">
      <h1 className="text-2xl font-bold mb-4">Create Post</h1>

      <div className="mb-4">
        <label className="block font-semibold mb-1">Choose Community</label>
        <select
          className="w-full border border-gray-300 rounded p-2"
          value={selectedCommunity}
          onChange={(e) => setSelectedCommunity(e.target.value)}
        >
          {communities.map((c) => (
            <option key={c._id} value={c._id}>
              {c.name}
            </option>
          ))}
        </select>
      </div>

      <div className="mb-4">
        <label className="block font-semibold mb-1">Post Type</label>
        <select
          className="w-full border border-gray-300 rounded p-2"
          value={postType}
          onChange={(e) => setPostType(e.target.value)}
        >
          <option>Text</option>
          <option>Image & video</option>
          <option>Link</option>
        </select>
      </div>

      <div className="mb-4">
        <input
          type="text"
          placeholder="Title"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          className="w-full border border-gray-300 rounded p-2"
        />
      </div>

      <div className="mb-4">
        <textarea
          placeholder="What's on your mind?"
          value={content}
          onChange={(e) => setContent(e.target.value)}
          className="w-full border border-gray-300 rounded p-2 h-32"
        />
      </div>

      <div className="flex gap-2">
        <button
          onClick={handlePost}
          className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700"
        >
          Post
        </button>
      </div>
    </div>
  );
};

export default CreatePost;
