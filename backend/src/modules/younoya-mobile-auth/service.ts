import {
  AbstractAuthModuleProvider,
} from "@medusajs/framework/utils"
import type {
  AuthenticationInput,
  AuthenticationResponse,
  AuthIdentityProviderService,
} from "@medusajs/framework/types"
import jwt from "jsonwebtoken"

type TicketPayload = {
  purpose: string
  identifier: string
  identifier_type: "mobile" | "email"
  jti: string
}

export class YounoyaMobileOtpProvider extends AbstractAuthModuleProvider {
  static identifier = "younoya-mobile-otp"
  static DISPLAY_NAME = "Mobile OTP"

  protected constructor() {
    super()
  }

  static validateOptions(): void {
    // no options required
  }

  protected verifyTicket(data: AuthenticationInput): TicketPayload | null {
    const ticket = (data.body?.ticket ?? data.body?.otp ?? "") as string
    if (!ticket || !process.env.JWT_SECRET) return null
    try {
      const payload = jwt.verify(
        ticket,
        process.env.JWT_SECRET
      ) as TicketPayload
      if (payload.purpose !== "otp-login" || !payload.identifier) return null
      return payload
    } catch {
      return null
    }
  }

  async authenticate(
    data: AuthenticationInput,
    authIdentityProviderService: AuthIdentityProviderService
  ): Promise<AuthenticationResponse> {
    const payload = this.verifyTicket(data)
    if (!payload) {
      return { success: false, error: "Invalid or expired login ticket." }
    }

    const contact =
      payload.identifier_type === "mobile"
        ? { phone: payload.identifier }
        : { email: payload.identifier }

    let authIdentity
    try {
      authIdentity = await authIdentityProviderService.retrieve({
        entity_id: payload.identifier,
      })
      await authIdentityProviderService.update(payload.identifier, {
        user_metadata: contact,
      })
    } catch {
      authIdentity = await authIdentityProviderService.create({
        entity_id: payload.identifier,
        user_metadata: contact,
      })
    }

    return { success: true, authIdentity }
  }

  async register(
    data: AuthenticationInput,
    authIdentityProviderService: AuthIdentityProviderService
  ): Promise<AuthenticationResponse> {
    // passwordless — registration happens on first authenticate
    return this.authenticate(data, authIdentityProviderService)
  }
}

export default YounoyaMobileOtpProvider
