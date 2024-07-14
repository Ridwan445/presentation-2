import { Router } from "express";
import AuthMiddleware from "../auth/authentication";
import PostController from './../controller/post.controller';

const postController = new PostController()

const auth = new AuthMiddleware()

class PostRoutes {
  public router: Router;

  constructor() {
    this.router = Router();
    this.routes();
  }

  private routes(): void {
    this.router.get('/post',auth.authenticate, postController.getAllPosts);
    this.router.get('/posts/:id', postController.getPostById);
    this.router.get('/likes/:id', postController.getLikesById);
    this.router.get('/users/:ownerId/posts', postController.getPostsByUserId);
    this.router.get("/admin/count/post", auth.authenticate, auth.isAdmin, postController.countPost)
    this.router.post('/post',auth.authenticate, postController.createPost);
    this.router.delete('/delete/posts',auth.authenticate, auth.isAdmin, postController.deleteAllPosts);
    this.router.put('/update/:id', auth.authenticate, postController.updatePost);
    this.router.put("/post/:id", auth.authenticate, postController.likePost)
    this.router.put("/posts/star/:id", auth.authenticate, postController.starPost)
    this.router.delete('/delete/:id', auth.authenticate, postController.deletePost);
}
}

export default PostRoutes;
