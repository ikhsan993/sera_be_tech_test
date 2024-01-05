export interface Customer {
  id: string;
  name: string;
  address?: string;
  phone: string;
  email: string;
}

let customers: Customer[] = [];

export const getCustomers = async (): Promise<Customer[]> => {
  return customers;
};

export const getCustomerByEmail = async (
  email: string
): Promise<Customer | undefined> => {
  return customers.find((customer) => customer.email === email);
};

export const getCustomerById = async (
  id: string
): Promise<Customer | undefined> => {
  return customers.find((customer) => customer.id === id);
};

export const createCustomer = async (customer: Customer): Promise<Customer> => {
  customer.id = Math.random().toString();
  customers.push(customer);
  return customer;
};

export const deleteCustomerById = async (id: string): Promise<boolean> => {
  const initialLength = customers.length;
  customers = customers.filter((customer) => customer.id !== id);
  return customers.length !== initialLength;
};

export const updateCustomerById = async (
  id: string,
  newData: Partial<Customer>
): Promise<Customer | undefined> => {
  const customerIndex = customers.findIndex((customer) => customer.id === id);
  if (customerIndex !== -1) {
    customers[customerIndex] = { ...customers[customerIndex], ...newData };
    return customers[customerIndex];
  }
  return undefined;
};
