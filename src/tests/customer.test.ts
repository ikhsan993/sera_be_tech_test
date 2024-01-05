import * as chai from "chai";
import chaiHttp from "chai-http";
import { describe, it, beforeEach, afterEach } from "mocha";
import express from "express";
import sinon from "sinon";
import * as customerDb from "../db/customer";
import { addCustomer } from "../controllers/customer";
import mongoose from "mongoose";

chai.use(chaiHttp);
const expect = chai.expect;

describe("Customer Controller", () => {
  let app: express.Application;

  beforeEach(() => {
    app = express();
    app.use(express.json());
    app.post("/api/customers", addCustomer);
  });

  afterEach(() => {
    sinon.restore();
  });

  it("should add a new customer", async () => {
    const mockCustomer = {
      name: "John Doe",
      address: "123 Main St",
      phone: "1234567890",
      email: "john@example.com",
      _id: new mongoose.Types.ObjectId(),
    };

    sinon.stub(customerDb, "getCustomerByEmail").resolves(null);
    sinon.stub(customerDb, "createCustomer").resolves(mockCustomer);

    const response = await chai
      .request(app)
      .post("/api/customers")
      .send(mockCustomer);

    expect(response.status).to.equal(200);
    expect(response.body).to.eql({
      status: "success",
      data: mockCustomer,
    });

    sinon.assert.calledWithExactly(
      customerDb.createCustomer as sinon.SinonSpy,
      sinon.match(mockCustomer)
    );
  });

  it("should handle validation errors", async () => {
    const invalidCustomer = {
      name: "Jo",
      address: "1", // invalid address
      phone: "123", // invalid phone
      email: "invalid-email", // invalid email
    };

    const response = await chai
      .request(app)
      .post("/api/customers")
      .send(invalidCustomer);

    expect(response.status).to.equal(400);
    expect(response.body).to.have.property("message");
  });

  it("should handle existing customer", async () => {
    const existingCustomer = {
      name: "Existing Customer",
      address: "456 Existing St",
      phone: "9876543210",
      email: "existing@example.com",
      _id: new mongoose.Types.ObjectId(),
    };

    sinon
      .stub(customerDb, "getCustomerByEmail")
      .resolves(existingCustomer as any);

    const response = await chai
      .request(app)
      .post("/api/customers")
      .send(existingCustomer);

    expect(response.status).to.equal(400);
    expect(response.body).to.eql({
      status: "failed",
      message: "customer already exists",
    });
  });
});
