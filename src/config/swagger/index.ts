// swaggerConfig.ts
import swaggerJSDoc, { OAS3Options } from "swagger-jsdoc";

const options: OAS3Options = {
  definition: {
    openapi: "3.0.0",
    info: {
      title: "User API",
      version: "1.0.0",
      description: "API for managing users",
    },
  },
  apis: ["src/config/swagger/userController.swagger.ts"],
};

const swaggerSpec: object = swaggerJSDoc(options);

export default swaggerSpec;
