import mongoose, {
  InferSchemaType,
  Model,
  ObtainSchemaGeneric,
  Schema,
} from "mongoose";

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

type GenericModel<TSchema extends Schema = any> = Model<
  InferSchemaType<TSchema>,
  ObtainSchemaGeneric<TSchema, "TQueryHelpers">,
  ObtainSchemaGeneric<TSchema, "TInstanceMethods">,
  ObtainSchemaGeneric<TSchema, "TVirtuals">,
  TSchema
> &
  ObtainSchemaGeneric<TSchema, "TStaticMethods">;

type CustomerModel = GenericModel<typeof CustomerSchema>;

// Register the model
export const Customer =
  (mongoose.models.Customer as CustomerModel) ||
  mongoose.model("Customer", CustomerSchema);
