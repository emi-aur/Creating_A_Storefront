import jwt from "jsonwebtoken";

describe("JWT AUTHENTICATION", () => {
  it("should generate and verify a JWT token for a user", () => {
    const user = { id: 1, firstname: "Max", lastname: "Mustermann" };
    const token = jwt.sign({ user }, process.env.TOKEN_SECRET as string);

    const verified = jwt.verify(
      token,
      process.env.TOKEN_SECRET as string
    ) as any;

    expect(verified.user.id).toBe(user.id);
    expect(verified.user.firstname).toBe(user.firstname);
    expect(verified.user.lastname).toBe(user.lastname);
  });
});
