import { Request, Response } from "express";
import userServices from "../services/user.services";
import ExpressResponse from "../helper/response";
import mailer from "../nodemailer/mailer";
import argon2 from "argon2";


const expressResponse = new ExpressResponse();

class UserController {
  public async getUsers(req: Request, res: Response): Promise<void> {
    try {
      const users = await userServices.getUsers();
      expressResponse.successResponse(res, users, "Users retrieved successfully", 200);
    } catch (error) {
      expressResponse.errorResponse(res, "Error retrieving users", 500);
    }
  }

  public async createUser(req: Request, res: Response): Promise<void> {
    try {
      const { name, email, password, role } = req.body;

      if (!name && !email && !password ) {
        expressResponse.errorResponse(res, "Fill in the field", 400);
        return;
      }

      const userExists = await userServices.userExists(email);

      if (userExists) {
        expressResponse.errorResponse(res, "User already exists", 400);
        return;
      }

      const user = await userServices.createUser(name, email, password, role);


      await mailer.sendMail(
        email,
        "Account Register",
      `Hi ${name} You just signed up`,
      `<body> 
        <p>Name: ${name}</p>
        <p>Email: ${email}</p>
        <p>Password: ${password}</p>
       </body>`
      );

      expressResponse.successResponse(res, user, "User created successfully", 201);
    } catch (error) {
      console.log(error);
      
      expressResponse.errorResponse(res, "Error creating user", 500);
    }
  }

  async loginUser(req: Request, res: Response) {
    const { email, password } = req.body;
    try {
      if (!email || !password) {
        return res.status(400).json({ error: 'Please provide email and password' });
      }

      const { token, user } = await userServices.loginUser(email, password);
      const comparedPassword = await argon2.verify(user.password, password)
      if(!comparedPassword){
        return res.status(404).json("🔥 INVALID PASSWORD")
      }

      res.status(200).json({ message: 'Logged in successfully', token, user });
    } catch (error) {
      console.error('Error logging in:', error);
      res.status(500).json("internal server error");
    }
  }

  // public async getUserById(req: Request, res: Response): Promise<void> {
  //   try {
  //     const id = parseInt(req.params.id);
  //     const user = await userServices.getUserById(Number(id));
  //     if (user) {
  //       expressResponse.successResponse(res, user, "User retrieved successfully", 200);
  //     } else {
  //       expressResponse.errorResponse(res, "User not found", 404);
  //     }
  //   } catch (error) {
  //     expressResponse.errorResponse(res, "Error retrieving user", 500);
  //   }
  // }

  public async deleteAllUsers(req: Request, res: Response): Promise<void> {
    try {
      await userServices.deleteAllUsers();
      expressResponse.successResponse(res, null, "User deleted successfully", 200);
    } catch (error) {
      console.log(error);
      
      expressResponse.errorResponse(res, "Error deleting user", 500);
    }
  }
}

export default new UserController();

