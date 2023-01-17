import mongoose, { InferSchemaType, Schema } from "mongoose";

const caseInsentiveCollation = {
  locale: "en",
  // Ignore case and diacretics
  strength: 1,
};

export const CustomerSchema = new Schema(
  {
    shopifyCustomerId: {
      type: String,
      required: true,
      index: { unique: true },
    },
    email: {
      type: String,
      required: true,
      index: { collation: caseInsentiveCollation },
    },
    firstName: {
      type: String,
      index: 1,
    },
    lastName: {
      type: String,
      index: 1,
    },
    deleted: {
      type: Boolean,
      required: true,
      index: 1,
      default: false,
    },
    orders: [
      {
        type: String,
        ref: "Orders",
      },
    ],
  },
  {
    virtuals: {
      fullName: {
        get() {
          // Join first and last name, trim trailing spaces
          return `${this.firstName || ""} ${this.lastName || ""}`.trim();
        },
      },
    },
    methods: {
      markDeleted() {
        this.deleted = true;

        // ... some other stuff
      },
    },
    statics: {
      findByEmail(email: string) {
        return this.find({ email })
          .sort({ deleted: 1 }) // non-deleted records first
          .collation(caseInsentiveCollation)
          .exec();
      },
    },
    timestamps: true,
    collection: "customers",
  }
);

// Register the model
export const Customer =
  mongoose.models.Customer || mongoose.model("Customer", CustomerSchema);
export type Customer = InferSchemaType<typeof CustomerSchema>;
