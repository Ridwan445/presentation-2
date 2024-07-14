import { Router } from "express";
import userController from "../controller/user.controller";
import AuthMiddleware from "../auth/authentication";


const auth = new AuthMiddleware()

class UserRoutes {
  public router: Router;

  constructor() {
    this.router = Router();
    this.routes();
  }

  private routes(): void {
    this.router.post('/users/login', userController.loginUser);
    this.router.post('/users', userController.createUser);
    this.router.delete('/delete/users',auth.authenticate, auth.isAdmin, userController.deleteAllUsers);
  }
}

export default UserRoutes;
