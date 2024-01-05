import express from "express";
import Joi from "joi";

import {
  getCustomers,
  getCustomerByEmail,
  getCustomerById,
  createCustomer,
  deleteCustomerById,
  updateCustomerById,
} from "../db/customer";

export const addCustomer = async (
  req: express.Request,
  res: express.Response
) => {
  const { name, address, phone, email } = req.body;
  const schema = Joi.object({
    name: Joi.string().min(3).required(),
    address: Joi.string().min(3),
    phone: Joi.string().min(6).required(),
    email: Joi.string().email().min(6).required(),
  });
  const { error } = schema.validate(req.body);
  if (error) {
    return res.status(400).send({
      message: error.details[0].message,
    });
  }
  try {
    const existingCustomer = await getCustomerByEmail(email);
    if (existingCustomer) {
      return res.status(400).send({
        status: "failed",
        message: "customer already exist",
      });
    } else {
      const newCustomer = await createCustomer({
        name,
        address,
        phone,
        email,
      });

      return res.status(200).json({ status: "success", data: newCustomer });
    }
  } catch (error) {
    return res.status(400).send({
      message: error.message,
    });
  }
};

export const getAllCustomers = async (
  req: express.Request,
  res: express.Response
) => {
  try {
    const customers = await getCustomers();
    return res.status(200).json({ status: "success ", data: customers });
  } catch (error) {
    return res.status(400).send({
      status: "failed",
      message: error.message,
    });
  }
};

export const getCustomer = async (
  req: express.Request,
  res: express.Response
) => {
  const { id } = req.body;
  try {
    const customer = await getCustomerById(id);
    if (customer) {
      return res.status(200).json({ status: "success ", data: customer });
    } else {
      return res
        .status(400)
        .json({ status: "failed ", message: "no customer found" });
    }
  } catch (error) {
    return res.status(400).send({
      status: "failed",
      message: error.message,
    });
  }
};

export const deleteCustomer = async (
  req: express.Request,
  res: express.Response
) => {
  const { id } = req.body;
  try {
    const deletedCustomer = await deleteCustomerById(id);
    return res.status(200).json({
      status: "success",
      message: "customer delete succesfully",
    });
  } catch (error) {
    return res.status(400).send({
      status: "failed",
      message: error.message,
    });
  }
};

export const updateCustomer = async (
  req: express.Request,
  res: express.Response
) => {
  const { id } = req.params;
  const schema = Joi.object({
    name: Joi.string().min(3),
    address: Joi.string().min(3),
    phone: Joi.string().min(6),
    email: Joi.string().email().min(6),
  });
  const { error } = schema.validate(req.body);
  if (error) {
    return res.status(400).send({
      message: error.details[0].message,
    });
  }
  try {
    const user = await getCustomerById(id);
    if (!user) {
      return res.status(400).send({
        status: "failed",
        message: "customer not found",
      });
    } else {
      const updateCustomer = await updateCustomerById(id, req.body);

      return res.status(200).json({ status: "success", data: updateCustomer });
    }
  } catch (error) {
    return res.status(400).send({
      message: error.message,
    });
  }
};
