import mongoose from "mongoose";

const CustomerSchema = new mongoose.Schema({
  name: { type: String, required: true },
  address: { type: String },
  email: { type: String, required: true },
  phone: { type: String, required: true },
});

export const CustomerModel = mongoose.model("Customer", CustomerSchema);

export const getCustomers = () => CustomerModel.find();
export const getCustomerByEmail = (email: string) =>
  CustomerModel.findOne({ email });
export const getCustomerById = (id: string) => CustomerModel.findById(id);
export const createCustomer = (values: Record<string, any>) =>
  new CustomerModel(values).save().then((customer) => customer.toObject());
export const deleteCustomerById = (id: string) =>
  CustomerModel.findByIdAndDelete(id);
export const updateCustomerById = (id: string, values: Record<string, any>) =>
  CustomerModel.findByIdAndUpdate(id, values, { new: true });
