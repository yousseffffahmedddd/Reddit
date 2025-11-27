// // // import mongoose,{Schema} from "mongoose";
// // // const { ObjectId } = mongoose.Types;    

// // // const PostSchema = new Schema({
// // //   title: { type: String, required: true },
// // //   body: String,

// // //   userId: { type: ObjectId, ref: "User", required: true },          // Reference
// // //   communityId: { type: ObjectId, ref: "Community", required: true }, // Reference

// // //   createdAt: { type: Date, default: Date.now }
// // // });

// // // const Post = mongoose.model("Post", PostSchema);
// // // export default  Post;
// // import mongoose, { Schema, Document ,Model} from "mongoose";

// // export interface IPost extends Document {
// //   title: string;
// //   content: string;
// //   community: string;
// //   postType: string;
// // }

// // const PostSchema: Schema = new Schema(
// //   {
// //     title: { type: String, required: true },
// //     content: { type: String, required: true },
// //     community: { type: String, required: true },
// //     postType: { type: String, required: true }
// //   },
// //   { timestamps: true }
// // );

// // // THIS is the model
// // const Post: Model<IPost> =
// //   mongoose.models.Post || mongoose.model<IPost>("Post", PostSchema);
// // export default Post;


// import mongoose, { Schema, Document, Model } from "mongoose";

// export interface IPost extends Document {
//   title: string;
//   body: string;
//   author: mongoose.Types.ObjectId;
//   community: mongoose.Types.ObjectId;
// }

// const PostSchema: Schema = new Schema(
//   {
//     title: { type: String, required: true },
//     content: { type: String, required: true },
//     postType: { type: String, required: true },
//     author: { type: Schema.Types.ObjectId, ref: "User", required: true },
//     community: { type: Schema.Types.ObjectId, ref: "Community", required: true },
//   },
//   { timestamps: true }
// );

// const Post: Model<IPost> =
//   mongoose.models.Post || mongoose.model<IPost>("Post", PostSchema);

// export default Post;

import mongoose, { Schema, Document, Model } from "mongoose";

export interface IPost extends Document {
  title: string;
  content: string;  // matches schema
  postType: string;
  author: mongoose.Types.ObjectId;
  community: mongoose.Types.ObjectId;
}

const PostSchema: Schema = new Schema(
  {
    title: { type: String, required: true },
    content: { type: String, required: true },   // now matches interface
    postType: { type: String,enum:["Text","Image","Link"],default:"Text" },
    author: { type: Schema.Types.ObjectId, ref: "User", required: true },
    community: { type: Schema.Types.ObjectId, ref: "Community", required: true },
  },
  { timestamps: true }
);

const Post: Model<IPost> =
  mongoose.models.Post || mongoose.model<IPost>("Post", PostSchema);

export default Post;
