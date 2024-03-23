const swaggerAutogen = require("swagger-autogen")({ openapi: "3.0.0" });

const doc = {
  info: {
    version: "1.0.0",
    title: "eCommerce API",
    description: "API documentation for the eCommerce application",
  },
  servers: [
    {
      url: "http://localhost:3001",
      description: "Development server",
    },
    {
      url: "https://ecommerce-api.com",
      description: "Production server",
    },
  ],
  schemes: ["http", "https"],
  consumes: ["application/json"],
  produces: ["application/json"],
  securityDefinitions: {
    apiKeyAuth: {
      type: "apiKey",
      in: "header",
      name: "x-api-key",
    },
  },
  components: {
    securitySchemes: {
      bearerAuth: {
        type: "http",
        scheme: "bearer",
        example: "Bearer {token}",
      },
    },
    schemas: {
      UserSignUp: {
        $name: "John Doe",
        $email: "JohnDoe@gmail.com",
        $password: "secretPassword",
      },
      AuthResponse: {
        $user: {
          $_id: "65fe943c453954a263efd935",
          $name: "John Doe",
          $email: "JohnDoe@gmail.com",
          $roles: [
            "001"
          ]
        },
        $token: {
          $accessToken: "jwt-token",
          $refreshToken: "jwt-token",
        }
      },
      Response: {
        $message: "User created successfully",
        $code: "201xxx",
        $metadata: "metadata"
      },
    },
  },
};
const outputFile = "./swagger-output.json";
const endpointsFiles = ["./src/app.js"];

swaggerAutogen(outputFile, endpointsFiles, doc)