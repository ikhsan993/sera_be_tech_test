import express from "express";

import {
  addCustomer,
  getAllCustomers,
  deleteCustomer,
  getCustomer,
  updateCustomer,
} from "../controllers/customer";

export default (router: express.Router) => {
  router.post("/customer/new", addCustomer);
  router.post("/customer/getAll", getAllCustomers);
  router.post("/customer/delete", deleteCustomer);
  router.post("/customer/get", getCustomer);
  router.post("/customer/update/:id", updateCustomer);
};
