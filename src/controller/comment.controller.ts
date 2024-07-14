import { Request, Response } from 'express';
import CommentServices from '../services/comment.services';
import ExpressResponse from '../helper/response';
import userServices from '../services/user.services';


const expressResponse = new ExpressResponse()
const commentServices = new CommentServices();

class CommentController {
  public async addComment(req: Request, res: Response) {
    const userId = req.user.id;
    const userExist = await userServices.getUserById(Number(userId))
    if(!userExist) {
     return expressResponse.errorResponse(res, "user does not exist", 404)
    }
    const commentorId = Number(userExist.id)
    const {  content } = req.body; 
    try {
      const comment = await commentServices.addComment(commentorId, content);
      expressResponse.successResponse(res, comment, "comment successful", 200)
    } catch (error) {
      console.error(error);
     expressResponse.errorResponse(res, "error while adding comment", 500)
    }
  }

  public async getCommentsByPostId(req: Request, res: Response): Promise<void> {
    const commentorId = parseInt(req.params.commentorId)
    try {
      const comments = await commentServices.getCommentsByPostId(commentorId);
      expressResponse.successResponse(res, comments, "comment retrieved successfully", 200)
    } catch (error) {
      console.error(error);
      res.status(500).json({ error: 'Error fetching comments' });
    }
  }
}
export default CommentController