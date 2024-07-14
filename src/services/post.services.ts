import { PrismaClient, post } from "@prisma/client";


const prisma = new PrismaClient()

class PostServices {
  public async getAllPosts(): Promise<post[]> {
    return await prisma.post.findMany();
  }

  public async getLikesById(id: number): Promise<post | null> {
    return await prisma.post.findUnique({
      where: { id: id },
    });
  }

  public async getPostById(id: number): Promise<post | null> {
    return await prisma.post.findUnique({
      where: { id: id },
    });
  }

  public async getPostsByUserId(ownerId: number): Promise<post[]> {
    return await prisma.post.findMany({
      where: { ownerId }, 
    });
  }

  public async createPost(title: string, content: string, ownerId: number): Promise<post> {
    const user = await prisma.user.findUnique({
      where: { id: ownerId },
    });
    if(!user) {
      throw new Error("user not found")
    }
    const posts = await prisma.post.create({
      data: {
        title,
        content,
        ownerId,
      },
    });
    return posts;
  }

  public async deleteAllPosts() {
    return await prisma.post.deleteMany({})
  } 

  public async countPost() {
    const count = await prisma.post.count({})
   return count
 }

 public async updatePost(id: number, data: Partial<post>): Promise<post> {
  return await prisma.post.update({
    where: { id },
    data,
  });
}

public async deletePost(id: number): Promise<post> {
  return await prisma.post.delete({
    where: { 
      id: id
     },
  });
}

public async likePost(postId: number): Promise<post> {
  const post = await prisma.post.findUnique({
    where: { id: postId },
  });

  if (!post) {
    throw new Error(`Post with ID ${postId} does not exist.`);
  }


  return await prisma.post.update({
    where: { id: postId },
    data: {
      noOfLikes: {
        increment: 1,
      },
    },
  });
}

public async starPost(postId: number): Promise<post> {
  const post = await prisma.post.findUnique({
    where: { id: postId },
  });

  if (!post) {
    throw new Error(`Post with ID ${postId} does not exist.`);
  }


  return await prisma.post.update({
    where: { id: postId },
    data: {
      noOfStars: {
        increment: 1,
      },
    },
  });
}
}

export default PostServices