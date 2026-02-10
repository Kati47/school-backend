import { Request, Router } from "express";
import { Model } from "mongoose";
import { asyncHandler } from "../middleware/asyncHandler";
import { ApiError } from "../utils/ApiError";
import { validate } from "../middleware/validate";
import { ZodSchema } from "zod";

interface CrudOptions<T> {
  model: Model<T>;
  createSchema?: ZodSchema;
  updateSchema?: ZodSchema;
  onCreate?: (doc: T, req: Request) => Promise<void>;
  onUpdate?: (doc: T, req: Request) => Promise<void>;
  onDelete?: (doc: T, req: Request) => Promise<void>;
}

export function createCrudRouter<T>({
  model,
  createSchema,
  updateSchema,
  onCreate,
  onUpdate,
  onDelete
}: CrudOptions<T>) {
  const router = Router();

  if (createSchema) {
    router.post("/", validate(createSchema));
  }
  router.post(
    "/",
    asyncHandler(async (req, res) => {
      const doc = await model.create(req.body);
      if (onCreate) {
        await onCreate(doc, req);
      }
      res.status(201).json(doc);
    })
  );

  router.get(
    "/",
    asyncHandler(async (_req, res) => {
      const docs = await model.find();
      res.json(docs);
    })
  );

  router.get(
    "/:id",
    asyncHandler(async (req, res) => {
      const doc = await model.findById(req.params.id);
      if (!doc) {
        throw new ApiError(404, "Not found");
      }
      res.json(doc);
    })
  );

  if (updateSchema) {
    router.put("/:id", validate(updateSchema));
  }
  router.put(
    "/:id",
    asyncHandler(async (req, res) => {
      const doc = await model.findByIdAndUpdate(req.params.id, req.body, { new: true });
      if (!doc) {
        throw new ApiError(404, "Not found");
      }
      if (onUpdate) {
        await onUpdate(doc, req);
      }
      res.json(doc);
    })
  );

  router.delete(
    "/:id",
    asyncHandler(async (req, res) => {
      const doc = await model.findByIdAndDelete(req.params.id);
      if (!doc) {
        throw new ApiError(404, "Not found");
      }
      if (onDelete) {
        await onDelete(doc, req);
      }
      res.status(204).send();
    })
  );

  return router;
}
