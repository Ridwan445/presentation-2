import { PrismaClient, comment } from '@prisma/client';

const prisma = new PrismaClient();

class CommentServices {
  public async addComment( commentorId: number, content: string): Promise<comment> {
    const userExists = await prisma.user.findUnique({
      where: { id: commentorId },
    });

    if (!userExists) {
      throw new Error(`User with ID ${commentorId} does not exist.`);
    }
    return await prisma.comment.update({
      where: {
        id: commentorId
      },
      data: {
        content,
      },
    });
  }

  public async getCommentsByPostId(postId: number): Promise<comment[]> {
    return await prisma.comment.findMany({
      where: { postId },
    });
  }
}
export default CommentServices
