# E-Comerce API Project

**Header require:**

- *x-api-key: key provide to access out service*
- *x-client-id: user._id*
- *authorization: beer "Your accessToken"*

### Authentication

1. **Signin:**
   req.body: {
   - email: sampleemail@gmail.com
     password: samplepassword
     }
2. **Signup**
   req.body: {
   - name:
   - email:
   - password:
   }

### Shops

1. **CreateShop**
   req.body:{
   - name:
   - address:
   - phone:
   - decription:
   }
2. **Update**
   req.params: id
   req.body:{
   - name:
   - address:
   - phone:
   - decription:
   }

### Products

1. **CreateProduct**
   req.body{
   - product_name,
   - product_price,
   - product_description,
   - product_thumbnail,
   - product_quantity,
   - product_category,
   - product_attributes: { *depend on category*  }
   - product_shop,
   }

## Getting Started

1. Clone the repository.
2. Install the dependencies by running `npm install`.
3. Start the server by running `npm start`.
4. Open a web browser and go to `http://localhost:3000/`.

## License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## Acknowledgments

- [Express.js](https://expressjs.com/)
- [Mongoose](https://mongoosejs.com/)
- [dotenv](https://www.npmjs.com/package/dotenv)
