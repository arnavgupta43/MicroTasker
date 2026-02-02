import { v4 as uuidv4 } from "uuid";

export default function requestContext(req, res, next) {
  const incoming = req.headers["x-request-id"];
  const requestId =
    incoming && typeof incoming === "string" ? incoming : uuidv4();

  req.requestId = requestId;
  res.setHeader("x-request-id", requestId);

  next();
}
