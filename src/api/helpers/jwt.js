import jsonwebtoken from "jsonwebtoken";

export function sign() {
  return jsonwebtoken.sign({}, process.env.HASH_SEED, {
    expiresIn: Number(process.env.TOKEN_EXPIRY_TIME)
  });
}

export function verify(token) {
  jsonwebtoken.verify(token, process.env.HASH_SEED);
}
