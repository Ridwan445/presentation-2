import { Router } from 'express';
import CommentController from '../controller/comment.controller';
import AuthMiddleware from '../auth/authentication';

 const auth = new AuthMiddleware()


const commentController = new CommentController();

class CommentRoutes {
  public router: Router
  constructor() {
    this.router = Router()
    this.routes()
  }
  private routes(): void {
    this.router.put('/post/:postId/comments', auth.authenticate, commentController.addComment);
    this.router.get('/posts/:postId/comments', commentController.getCommentsByPostId);
  }
 
}



export default CommentRoutes;
