import { Customer } from "./models";

function useStatic() {
  return Customer.findByEmail('test@example.com');
}

async function useMethod() {
  const customer = await Customer.findOne().exec();
  customer // has type `any`
  customer?.markDeleted();
}

async function accessVirtualProperty() {
  const customer = await Customer.findOne().exec();
  customer // has type `any`
  return customer?.fullName || customer?.firstName;
}