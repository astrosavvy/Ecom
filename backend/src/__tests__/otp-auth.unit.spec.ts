import jwt from "jsonwebtoken"
import { YounoyaMobileOtpProvider } from "../modules/younoya-mobile-auth/service"

const previous = process.env.JWT_SECRET
beforeEach(() => { process.env.JWT_SECRET = "unit-test-auth-only" })
afterEach(() => { if (previous) process.env.JWT_SECRET = previous; else delete process.env.JWT_SECRET })
const ticket = (identifier: string, type = "mobile") => jwt.sign({ purpose: "otp-login", identifier,
  identifier_type: type, jti: "unit-test-ticket" }, process.env.JWT_SECRET!, { expiresIn: "10m" })
const createProvider = () => new (YounoyaMobileOtpProvider as any)()

test("phone login creates the phone identity, then reuses it for the other delivery channel", async () => {
  const phone = "+919876543210"
  const identity = { id: "unit-auth-identity" }
  const service = { retrieve: jest.fn().mockRejectedValueOnce(new Error("Not found")).mockResolvedValue(identity),
    create: jest.fn().mockResolvedValue(identity), update: jest.fn() }
  const provider = createProvider()
  expect(await provider.authenticate({ body: { ticket: ticket(phone) } }, service)).toMatchObject({ success: true })
  expect(service.create).toHaveBeenCalledWith({ entity_id: phone, user_metadata: { phone } })
  expect(await provider.authenticate({ body: { ticket: ticket(phone) } }, service)).toMatchObject({ success: true })
  expect(service.create).toHaveBeenCalledTimes(1)
  expect(service.retrieve).toHaveBeenLastCalledWith({ entity_id: phone })
})
test("email identity remains independent; invalid tickets cannot create an account", async () => {
  const service = { retrieve: jest.fn().mockRejectedValue(new Error("Not found")), create: jest.fn(), update: jest.fn() }
  const provider = createProvider()
  await provider.authenticate({ body: { ticket: ticket("qa@example.invalid", "email") } }, service)
  expect(service.create).toHaveBeenCalledWith({ entity_id: "qa@example.invalid", user_metadata: { email: "qa@example.invalid" } })
  service.create.mockClear()
  expect(await provider.authenticate({ body: { ticket: "not-a-ticket" } }, service)).toMatchObject({ success: false })
  expect(await provider.authenticate({ body: { ticket: ticket("qa@example.invalid", "unknown") } }, service)).toMatchObject({ success: false })
  expect(service.create).not.toHaveBeenCalled()
})
