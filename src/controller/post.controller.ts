import ExpressResponse from "../helper/response";
import { Request, Response } from "express";
import PostServices from "../services/post.services";
import userServices from "../services/user.services";


const expressResponse = new ExpressResponse();
const postServices = new PostServices()
class PostController {
  public async getAllPosts(req: Request, res: Response) {
    try {
      const posts = await postServices.getAllPosts();
      return expressResponse.successResponse(res, posts, "Users posted successfully", 200);
    } catch (error) {
      return expressResponse.errorResponse(res, "Error while posting", 500);
    }
  }
  public async getPostById(req: Request, res: Response) {
    try {
      const id = parseInt(req.params.id)
      const posts = await postServices.getPostById(id);
      return expressResponse.successResponse(res, posts, "Users posted successfully", 200);
    } catch (error) {
      return expressResponse.errorResponse(res, "Error while posting", 500);
    }
  }

  public async getLikesById(req: Request, res: Response) {
    try {
      const id = parseInt(req.params.id)
      const posts = await postServices.getLikesById(id);
      return expressResponse.successResponse(res, posts, "Users posted successfully", 200);
    } catch (error) {
      return expressResponse.errorResponse(res, "Error while posting", 500);
    }
  }

  public async getPostsByUserId(req: Request, res: Response) {
    try {
      const ownerId = parseInt(req.params.ownerId)
      const posts = await postServices.getPostsByUserId(ownerId);
      return expressResponse.successResponse(res, posts, "Users posted successfully", 200);
    } catch (error) {
      return expressResponse.errorResponse(res, "Error while posting", 500);
    }
  }

  public async createPost(req: Request, res: Response) {
    try {
      const { content, title, ownerId } = req.body;

      if (!content && !title && !ownerId) {
        return expressResponse.errorResponse(res, "Fill in the field", 400);
      }

      const post = await postServices.createPost(content, title, ownerId);

  return expressResponse.successResponse(res, post, "User created successfully", 201);
} catch (error) {
  console.log(error);
  
  return expressResponse.errorResponse(res, "Error creating user", 500);
}
}

public async likePost(req: Request, res: Response) {
  try {
    const id = parseInt(req.params.id)
    const likePost = await postServices.likePost(id)
    return expressResponse.successResponse(res, likePost, "User liked successfully", 200)
  } catch (error: any) {
    console.log(error);
   return expressResponse.errorResponse(res, error.message, 500);
  }
}

public async starPost(req: Request, res: Response){
  try {
    const id = parseInt(req.params.id)
    const starPost = await postServices.starPost(id)
    return expressResponse.successResponse(res, starPost, "User liked successfully", 200)
  } catch (error: any) {
    console.log(error);
    return expressResponse.errorResponse(res, error.message, 500);
  }
}

public async deleteAllPosts(req: Request, res: Response){
  try {
    await postServices.deleteAllPosts();
    return expressResponse.successResponse(res, null, "post deleted successfully", 200);
  } catch (error) {
    console.log(error);
    
    return expressResponse.errorResponse(res, "Error deleting post", 500);
  }
}

public async deletePost(req: Request, res: Response) {
  try {
    const userId = req.user.id;
    const userExist = await userServices.getUserById(Number(userId))
    if(!userExist) {
     return expressResponse.errorResponse(res, "user does not exist", 404)
    }
    const id = parseInt(req.params.id)
    const postExist = await postServices.getPostById(id)  
    if(!postExist) {
      return expressResponse.errorResponse(res, "post does not exist", 404)
      }
    if (userExist?.id != postExist?.ownerId) {
     return expressResponse.errorResponse(res, "you are not the owner of this post", 403)
    }
    console.log(id);
    
    await postServices.deletePost(id);
    return expressResponse.successResponse(res, null, "post deleted successfully", 200);
  } catch (error) {
    console.log(error);
    return expressResponse.errorResponse(res, "Error deleting post", 500);
  }
}

public async updatePost(req: Request, res: Response){
  try {
    const userId = req.user.id;
    const userExist = await userServices.getUserById(Number(userId))
    if(!userExist) {
     return expressResponse.errorResponse(res, "user does not exist", 404)
    }
    const id = parseInt(req.params.id);
    const postExist = await postServices.getPostById(id)  
    if(!postExist) {
      return expressResponse.errorResponse(res, "post does not exist", 404)
      }
    if (userExist?.id != postExist?.ownerId) {
     return expressResponse.errorResponse(res, "you are not the owner of this post", 403)
    }
    const data = req.body;
    const post = await postServices.updatePost((id), data);
    return expressResponse.successResponse(res, post, "User updated successfully", 200);
  } catch (error) {
    return expressResponse.errorResponse(res, "Error updating user", 500);
  }
}


public async countPost(req: Request, res: Response) {
  try {
    const count = await postServices.countPost();
    return expressResponse.successResponse(res, count, "count post successfully", 200)
  } catch (error) {
    return expressResponse.errorResponse(res, "internal server error", 500)
  }
}
}

export default PostController