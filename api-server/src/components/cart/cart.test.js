const request = require("supertest");
const Database = require("../../dbs/init.mongodb");
beforeAll(async () => {
  await Database.connect();
});
afterAll(async () => {
  await Database.close();
});

describe("POST /cart/add", () => {
  it("should add a product to the cart", async () => {
    const response = await request("http://localhost:3001/v1/api")
      .post("/cart/add")
      .send({ productId: "60c4d8f8c8a3c0f9e8b4d1e1", quantity: 1 });
    expect(response.statusCode).toBe(200);
    expect(response.body).toHaveProperty("metadata");
    expect(response.body.metadata).toHaveProperty("message");
  });
})